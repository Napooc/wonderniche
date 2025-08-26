import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

import { create, verify, getNumericDate } from "https://deno.land/x/djwt@v3.0.1/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const jwtSecret = Deno.env.get('JWT_SECRET') || 'your-jwt-secret-key';

// Password hashing using Web Crypto PBKDF2 (Edge-compatible)
const textEncoder = new TextEncoder();

function bytesToBase64(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function deriveBits(password: string, salt: Uint8Array, iterations: number): Promise<Uint8Array> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    textEncoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  return new Uint8Array(bits);
}

async function hashPasswordPBKDF2(password: string): Promise<string> {
  const iterations = 150000; // ~150k for good balance on Edge
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await deriveBits(password, salt, iterations);
  return `pbkdf2$${iterations}$${bytesToBase64(salt)}$${bytesToBase64(hash)}`;
}

async function verifyPasswordPBKDF2(password: string, stored: string): Promise<boolean> {
  // Expected format: pbkdf2$<iterations>$<saltB64>$<hashB64>
  if (!stored || !stored.startsWith('pbkdf2$')) return false;
  const parts = stored.split('$');
  if (parts.length !== 4) return false;
  const iterations = parseInt(parts[1], 10);
  const salt = base64ToBytes(parts[2]);
  const expected = base64ToBytes(parts[3]);
  const actual = await deriveBits(password, salt, iterations);
  if (actual.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected[i] ^ actual[i];
  return diff === 0;
}

async function verifyAdminTokenFromReq(req: Request, body?: any) {
  const authHeader = req.headers.get('authorization') || '';
  const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
  // IMPORTANT: Prefer token from request body to avoid picking up Supabase anon/session tokens
  const token = (body && body.token) ? body.token : bearerToken;
  if (!token) throw new Error('Missing token');
  
  try {
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(jwtSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign', 'verify']
    );
    const payload = await verify(token, key);
    if (payload?.role !== 'admin') throw new Error('Not admin');
    return payload;
  } catch (error) {
    console.error('Token verification error:', error);
    throw new Error('Invalid token');
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Handle file upload action
    if (req.url.includes('upload-image')) {
      const formData = await req.formData();
      const file = formData.get('file') as File;
      const token = formData.get('token') as string;
      
      if (!file) {
        return new Response(JSON.stringify({ error: 'No file provided' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      // Verify admin token
      try {
        const key = await crypto.subtle.importKey(
          "raw",
          new TextEncoder().encode(jwtSecret),
          { name: "HMAC", hash: "SHA-256" },
          false,
          ["sign", "verify"]
        );
        await verify(token, key);
      } catch (error) {
        console.error('Token verification failed for upload:', error);
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        return new Response(JSON.stringify({ error: 'Invalid file type' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (file.size > 5 * 1024 * 1024) {
        return new Response(JSON.stringify({ error: 'File too large' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      // Generate file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;
      
      console.log(`Uploading file: ${filePath}`);
      
      // Upload using service role (bypasses RLS)
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, { upsert: true });
      
      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        return new Response(JSON.stringify({ error: 'Upload failed' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);
      
      console.log(`Upload successful: ${publicUrl}`);
      
      return new Response(JSON.stringify({ 
        success: true, 
        url: publicUrl,
        path: filePath
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
const body = await req.json();
const { action, username, password, token, data } = body || {};
console.log(`Admin auth request: ${action} for user: ${username}`);

    if (action === 'login') {
      // Fetch user from admin_users table
      const { data: adminUser, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', username)
        .maybeSingle();

      if (error) {
        console.error('Database error:', error);
        return new Response(JSON.stringify({ error: 'Authentication failed' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (!adminUser) {
        console.log('User not found:', username);
        return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Check if password_hash is still placeholder - need to set real password
      if (adminUser.password_hash === 'placeholder_hash') {
        // Hash the provided password and update the record using PBKDF2
        const hashedPassword = await hashPasswordPBKDF2(password);

        const { error: updateError } = await supabase
          .from('admin_users')
          .update({ password_hash: hashedPassword })
          .eq('id', adminUser.id);

        if (updateError) {
          console.error('Error updating password:', updateError);
          return new Response(JSON.stringify({ error: 'Authentication failed' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        console.log('Password set for user:', username);
      } else {
        // Verify password against stored PBKDF2 hash
        const passwordMatch = await verifyPasswordPBKDF2(password, adminUser.password_hash);

        if (!passwordMatch) {
          console.log('Invalid password for user:', username);
          return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }

      // Generate JWT token
      const payload = {
        sub: adminUser.id,
        username: adminUser.username,
        role: 'admin',
        exp: getNumericDate(60 * 60 * 24), // 24 hours
      };

      const key = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(jwtSecret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign", "verify"]
      );

      const token = await create({ alg: "HS256", typ: "JWT" }, payload, key);

      console.log('Login successful for user:', username);

      return new Response(JSON.stringify({ 
        success: true, 
        token,
        user: {
          id: adminUser.id,
          username: adminUser.username,
          role: 'admin'
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (action === 'verify') {
      // Verify JWT token - use the token from the body parsed earlier
      if (!token) {
        return new Response(JSON.stringify({ valid: false }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      try {
        const key = await crypto.subtle.importKey(
          "raw",
          new TextEncoder().encode(jwtSecret),
          { name: "HMAC", hash: "SHA-256" },
          false,
          ["sign", "verify"]
        );

        const payload = await verify(token, key);
        
        return new Response(JSON.stringify({ 
          valid: true, 
          user: {
            id: payload.sub,
            username: payload.username,
            role: payload.role
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (error) {
        console.error('Token verification failed:', error);
        return new Response(JSON.stringify({ valid: false }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } else if (action === 'create_product') {
      try {
        await verifyAdminTokenFromReq(req, body);
      } catch (e) {
        console.error('Unauthorized create_product:', e);
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const allowed = ['name','description','short_description','category_id','image_url','affiliate_url','features','rating','reviews_count','is_featured','is_active','tags'];
      const payload: Record<string, any> = {};
      for (const k of allowed) {
        if (data && typeof data[k] !== 'undefined') payload[k] = data[k];
      }
      // Ensure no pricing fields are passed
      delete (payload as any).price;
      delete (payload as any).original_price;

      const { data: inserted, error: insertError } = await supabase
        .from('products')
        .insert([payload])
        .select();

      if (insertError) {
        console.error('Create product error:', insertError);
        return new Response(JSON.stringify({ error: insertError.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ success: true, data: inserted }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else if (action === 'update_product') {
      try {
        await verifyAdminTokenFromReq(req, body);
      } catch (e) {
        console.error('Unauthorized update_product:', e);
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (!data?.id) {
        return new Response(JSON.stringify({ error: 'Missing product id' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const allowed = ['name','description','short_description','category_id','image_url','affiliate_url','features','rating','reviews_count','is_featured','is_active','tags'];
      const payload: Record<string, any> = {};
      for (const k of allowed) {
        if (typeof data[k] !== 'undefined') payload[k] = data[k];
      }
      delete (payload as any).price;
      delete (payload as any).original_price;

      const { data: updated, error: updateError } = await supabase
        .from('products')
        .update(payload)
        .eq('id', data.id)
        .select();

      if (updateError) {
        console.error('Update product error:', updateError);
        return new Response(JSON.stringify({ error: updateError.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ success: true, data: updated }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in admin-auth function:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});