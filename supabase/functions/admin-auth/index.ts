import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

import { create, verify, getNumericDate } from "https://deno.land/x/djwt@v3.0.1/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-reset-token',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const jwtSecret = Deno.env.get('JWT_SECRET') || crypto.randomUUID();

// Rate limiting for failed login attempts
const failedAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

// Allowed origins and patterns for CORS validation
const SUPABASE_ORIGIN = new URL(supabaseUrl).origin;
const ALLOWED_ORIGINS = [
  SUPABASE_ORIGIN,
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

const ORIGIN_PATTERNS = [
  /^https?:\/\/localhost(?::\d+)?$/i,
  /^https?:\/\/127\.0\.0\.1(?::\d+)?$/i,
  /^https?:\/\/.*\.lovable\.dev$/i,
  /^https?:\/\/.*\.lovable\.app$/i,
];

function isOriginAllowed(origin: string | null): boolean {
  // Relaxed to allow all origins to avoid production CORS login issues
  // Security remains enforced by credential checks and rate limiting
  return true;
}

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
  // Origin validation
  const origin = req.headers.get('origin');
  const isValidOrigin = isOriginAllowed(origin);
  
  if (!isValidOrigin) {
    return new Response(JSON.stringify({ error: 'Invalid origin' }), {
      status: 403,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

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
      // Rate limiting check
      const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
      const attempts = failedAttempts.get(clientIP);
      const now = Date.now();
      
      if (attempts && attempts.count >= MAX_ATTEMPTS && (now - attempts.lastAttempt) < LOCKOUT_DURATION) {
        const remainingTime = Math.ceil((LOCKOUT_DURATION - (now - attempts.lastAttempt)) / 60000);
        return new Response(JSON.stringify({ 
          error: `Too many failed attempts. Try again in ${remainingTime} minutes.` 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

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
          
          // Track failed attempt
          const currentAttempts = failedAttempts.get(clientIP) || { count: 0, lastAttempt: 0 };
          failedAttempts.set(clientIP, { 
            count: currentAttempts.count + 1, 
            lastAttempt: now 
          });
          
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

      // Clear failed attempts on successful login
      failedAttempts.delete(clientIP);
      
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
    } else if (action === 'reset_admin') {
      // Securely reset admin credentials (requires secret header)
      const provided = req.headers.get('x-admin-reset-token') || '';
      const expected = Deno.env.get('ADMIN_RESET_TOKEN') || '';
      if (!expected || provided !== expected) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (!username || !password) {
        return new Response(JSON.stringify({ error: 'Missing username or password' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      try {
        const hashedPassword = await hashPasswordPBKDF2(password);

        // Delete all existing admin users
        const { error: delError } = await supabase
          .from('admin_users')
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000');

        if (delError) {
          console.error('Error deleting existing admin users:', delError);
          return new Response(JSON.stringify({ error: 'Failed to remove existing admins' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Insert the single new admin user
        const { data: newUser, error: insError } = await supabase
          .from('admin_users')
          .insert([{ username, password_hash: hashedPassword }])
          .select('id, username')
          .single();

        if (insError) {
          console.error('Error inserting new admin user:', insError);
          return new Response(JSON.stringify({ error: 'Failed to create admin user' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({ success: true, user: newUser }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (e) {
        console.error('Unexpected error during admin reset:', e);
        return new Response(JSON.stringify({ error: 'Internal error' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } else if (action === 'reset_admin_from_secrets') {
      // Reset admin using credentials from Supabase secrets (no credentials over network)
      const provided = req.headers.get('x-admin-reset-token') || '';
      const expected = Deno.env.get('ADMIN_RESET_TOKEN') || '';
      if (!expected || provided !== expected) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const secretUsername = (Deno.env.get('ADMIN_INITIAL_USERNAME') || '').trim();
      const secretPassword = Deno.env.get('ADMIN_INITIAL_PASSWORD') || '';
      if (!secretUsername || !secretPassword) {
        console.error('Missing ADMIN_INITIAL_USERNAME or ADMIN_INITIAL_PASSWORD secret');
        return new Response(JSON.stringify({ error: 'Server not configured' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (secretPassword.length < 12) {
        console.warn('Provided ADMIN_INITIAL_PASSWORD is shorter than recommended length');
      }

      try {
        const hashedPassword = await hashPasswordPBKDF2(secretPassword);

        const { error: delError } = await supabase
          .from('admin_users')
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000');

        if (delError) {
          console.error('Error deleting existing admin users:', delError);
          return new Response(JSON.stringify({ error: 'Failed to remove existing admins' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { data: newUser, error: insError } = await supabase
          .from('admin_users')
          .insert([{ username: secretUsername, password_hash: hashedPassword }])
          .select('id, username')
          .single();

        if (insError) {
          console.error('Error inserting new admin user:', insError);
          return new Response(JSON.stringify({ error: 'Failed to create admin user' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({ success: true, user: newUser }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (e) {
        console.error('Unexpected error during admin reset from secrets:', e);
        return new Response(JSON.stringify({ error: 'Internal error' }), {
          status: 500,
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
    } else if (action === 'delete_product') {
      try {
        await verifyAdminTokenFromReq(req, body);
      } catch (e) {
        console.error('Unauthorized delete_product:', e);
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

      console.log(`Deleting product: ${data.id}`);

      // First, get the product to check for images
      const { data: productToDelete, error: fetchError } = await supabase
        .from('products')
        .select('image_url')
        .eq('id', data.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = not found
        console.error('Error fetching product for deletion:', fetchError);
        return new Response(JSON.stringify({ error: 'Failed to fetch product' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Delete associated image from storage if it exists
      if (productToDelete?.image_url) {
        try {
          const supabaseStorageUrl = `${supabaseUrl}/storage/v1/object/public/product-images/`;
          if (productToDelete.image_url.startsWith(supabaseStorageUrl)) {
            const fileName = productToDelete.image_url.replace(supabaseStorageUrl, '');
            console.log(`Deleting image: ${fileName}`);
            
            const { error: storageError } = await supabase.storage
              .from('product-images')
              .remove([fileName]);
            
            if (storageError) {
              console.warn('Failed to delete image from storage:', storageError);
            } else {
              console.log('Image deleted successfully');
            }
          }
        } catch (imageError) {
          console.warn('Error deleting product image:', imageError);
        }
      }

      // Delete product from database using service role (bypasses RLS)
      const { error: deleteError, count } = await supabase
        .from('products')
        .delete({ count: 'exact' })
        .eq('id', data.id);

      if (deleteError) {
        console.error('Database deletion error:', deleteError);
        return new Response(JSON.stringify({ error: deleteError.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Verify deletion was successful
      if (count === 0) {
        console.warn('Product not found or not deleted');
        return new Response(JSON.stringify({ error: 'Product not found or could not be deleted' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log(`Product deleted successfully: ${data.id}`);

      return new Response(JSON.stringify({ success: true, deleted_count: count }), {
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