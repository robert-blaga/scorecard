import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Decode the JWT to get the reference
const decodedToken = JSON.parse(atob(supabaseAnonKey.split('.')[1]));
const projectRef = decodedToken.ref;

// Ensure we're using the correct URL format
const correctedUrl = `https://${projectRef}.supabase.co`;

console.log('Initializing Supabase client with:', {
  configuredUrl: supabaseUrl,
  correctedUrl,
  projectRef,
  hasKey: !!supabaseAnonKey
});

// Create Supabase client with configuration
export const supabase = createClient(correctedUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: true,
    detectSessionInUrl: false
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js/2.x'
    }
  }
}); 