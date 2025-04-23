-- Create tables for trademark and patent applications
CREATE TABLE IF NOT EXISTS trademark_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  applicant_name TEXT NOT NULL,
  trademark TEXT NOT NULL,
  filing_basis TEXT NOT NULL,
  mark_name TEXT NOT NULL,
  mark_type TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  owner_type TEXT NOT NULL,
  owner_address TEXT NOT NULL,
  goods_services JSONB NOT NULL,
  usage_evidence JSONB NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
  user_id UUID NOT NULL REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS patent_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  title TEXT NOT NULL,
  inventors TEXT[] NOT NULL,
  description TEXT NOT NULL,
  claims TEXT[] NOT NULL,
  prior_art TEXT[] NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
  user_id UUID NOT NULL REFERENCES auth.users(id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_trademark_applications_user_id ON trademark_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_patent_applications_user_id ON patent_applications(user_id);

-- Set up Row Level Security (RLS)
ALTER TABLE trademark_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE patent_applications ENABLE ROW LEVEL SECURITY;

-- Create policies to ensure users can only access their own applications
CREATE POLICY "Users can view their own trademark applications"
  ON trademark_applications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trademark applications"
  ON trademark_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trademark applications"
  ON trademark_applications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trademark applications"
  ON trademark_applications FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own patent applications"
  ON patent_applications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own patent applications"
  ON patent_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own patent applications"
  ON patent_applications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own patent applications"
  ON patent_applications FOR DELETE
  USING (auth.uid() = user_id); 