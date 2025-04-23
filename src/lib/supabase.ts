import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

// Types for our database tables
export type TrademarkApplication = {
  id: string;
  created_at: string;
  applicant_name: string;
  trademark: string;
  filing_basis: string;
  mark_name: string;
  mark_type: string;
  owner_name: string;
  owner_type: string;
  owner_address: string;
  goods_services: {
    description: string;
    class: string;
    industry: string;
    target_market: string;
  }[];
  usage_evidence: {
    first_use_date: string;
    first_use_commerce: string;
    commerce_type: string;
    usage_description: string;
    specimen_url: string;
  };
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  user_id: string;
};

export type PatentApplication = {
  id: string;
  created_at: string;
  title: string;
  inventors: string[];
  description: string;
  claims: string[];
  prior_art: string[];
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  user_id: string;
}; 