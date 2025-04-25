import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 SUPABASE CONFIGURATION:');
console.log('URL:', supabaseUrl ? '✅ Present' : '❌ Missing');
console.log('ANON KEY:', supabaseAnonKey ? '✅ Present' : '❌ Missing');

// Validate environment variables
if (!supabaseUrl) {
  console.error('❌ Missing VITE_SUPABASE_URL environment variable');
  throw new Error('Missing VITE_SUPABASE_URL environment variable. Please check your .env file.');
}

if (!supabaseAnonKey) {
  console.error('❌ Missing VITE_SUPABASE_ANON_KEY environment variable');
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable. Please check your .env file.');
}

// Create a singleton instance of the Supabase client
let supabaseInstance: ReturnType<typeof createClient> | null = null;

export const supabase = (() => {
  if (!supabaseInstance) {
    console.log('🔄 Creating new Supabase client instance');
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storageKey: 'patent-app-auth' // Unique storage key for this application
      }
    });
    console.log('✅ Supabase client instance created successfully');
  } else {
    console.log('ℹ️ Using existing Supabase client instance');
  }
  return supabaseInstance;
})();

// Helper function to check if a user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    console.log('🔍 Checking user authentication status');
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('❌ Error checking authentication:', error);
      return false;
    }
    const isAuth = !!data.session;
    console.log(`Authentication status: ${isAuth ? '✅ Authenticated' : '❌ Not authenticated'}`);
    return isAuth;
  } catch (error) {
    console.error('❌ Error checking authentication:', error);
    return false;
  }
};

// Helper function to get the current user
export const getCurrentUser = async () => {
  try {
    console.log('🔍 Getting current user');
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error('❌ Error getting current user:', error);
      return null;
    }
    if (data.user) {
      console.log('✅ Current user:', data.user.email);
    } else {
      console.log('❌ No user found');
    }
    return data.user;
  } catch (error) {
    console.error('❌ Error getting current user:', error);
    return null;
  }
};

// Helper function to sign out
export const signOut = async () => {
  try {
    console.log('🔄 Signing out user');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('❌ Error signing out:', error);
      throw error;
    }
    console.log('✅ User signed out successfully');
  } catch (error) {
    console.error('❌ Error signing out:', error);
    throw error;
  }
}; 