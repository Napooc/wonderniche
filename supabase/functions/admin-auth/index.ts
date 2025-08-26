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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { action, username, password } = await req.json();

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
      // Verify JWT token
      const { token } = await req.json();
      
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