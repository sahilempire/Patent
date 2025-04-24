-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload their own specimens" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own specimens" ON storage.objects;

-- Drop existing tables if they exist (in correct order to handle dependencies)
DROP TABLE IF EXISTS document_generation CASCADE;
DROP TABLE IF EXISTS trademark_applications CASCADE;
DROP TABLE IF EXISTS patent_applications CASCADE;

-- Create trademark_applications table with all necessary fields
CREATE TABLE trademark_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    -- Applicant Information
    applicant_name TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    nationality TEXT,
    street_address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    country TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    authorized_signatory_name TEXT,
    attorney_name TEXT,
    attorney_contact TEXT,
    business_registration_number TEXT,
    -- Trademark Information
    trademark_type TEXT NOT NULL,
    trademark_name TEXT NOT NULL,
    trademark_description TEXT NOT NULL,
    tagline TEXT,
    translation TEXT,
    has_color_claim BOOLEAN DEFAULT false,
    colors TEXT,
    is_stylized BOOLEAN DEFAULT false,
    trademark_language TEXT DEFAULT 'English',
    -- Classification & Usage
    selected_classes TEXT[] NOT NULL,
    goods_services TEXT NOT NULL,
    is_using_in_commerce BOOLEAN DEFAULT false,
    first_use_date DATE,
    intent_to_use BOOLEAN DEFAULT false,
    -- Priority Information
    priority_claim BOOLEAN DEFAULT false,
    priority_country TEXT,
    priority_date DATE,
    priority_number TEXT,
    -- Legal Information
    declaration_of_ownership BOOLEAN DEFAULT false,
    confirmation_of_accuracy BOOLEAN DEFAULT false,
    signature TEXT,
    submission_date DATE DEFAULT CURRENT_DATE,
    -- Additional Information
    existing_trademark_number TEXT,
    social_media_handles TEXT,
    website TEXT,
    specimen_url TEXT,
    -- Metadata
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create patent_applications table
CREATE TABLE patent_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    -- Basic Information
    title TEXT NOT NULL,
    inventors TEXT[] NOT NULL,
    description TEXT NOT NULL,
    claims TEXT[] NOT NULL,
    prior_art TEXT[],
    -- Legal Information
    declaration_of_ownership BOOLEAN DEFAULT false,
    confirmation_of_accuracy BOOLEAN DEFAULT false,
    signature TEXT,
    submission_date DATE DEFAULT CURRENT_DATE,
    -- Metadata
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create document_generation table
CREATE TABLE document_generation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    application_id UUID NOT NULL,
    application_type TEXT NOT NULL CHECK (application_type IN ('trademark', 'patent')),
    document_type TEXT NOT NULL,
    document_data JSONB NOT NULL,
    generated_content TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'generated', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Ensure application_id references the correct table based on application_type
    CONSTRAINT fk_application 
        FOREIGN KEY (application_id) 
        REFERENCES trademark_applications(id) 
        ON DELETE CASCADE
);

-- Create storage bucket for specimens
INSERT INTO storage.buckets (id, name, public) 
VALUES ('specimens', 'specimens', false)
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX idx_trademark_applications_user_id ON trademark_applications(user_id);
CREATE INDEX idx_trademark_applications_status ON trademark_applications(status);
CREATE INDEX idx_patent_applications_user_id ON patent_applications(user_id);
CREATE INDEX idx_patent_applications_status ON patent_applications(status);
CREATE INDEX idx_document_generation_user_id ON document_generation(user_id);
CREATE INDEX idx_document_generation_application_id ON document_generation(application_id);
CREATE INDEX idx_document_generation_status ON document_generation(status);

-- Enable Row Level Security
ALTER TABLE trademark_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE patent_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_generation ENABLE ROW LEVEL SECURITY;

-- Create policies for trademark_applications
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

-- Create policies for patent_applications
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

-- Create policies for document_generation
CREATE POLICY "Users can view their own document generations"
    ON document_generation FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own document generations"
    ON document_generation FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own document generations"
    ON document_generation FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own document generations"
    ON document_generation FOR DELETE
    USING (auth.uid() = user_id);

-- Create storage policies
CREATE POLICY "Users can upload their own specimens"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'specimens' AND auth.uid()::text = SPLIT_PART(name, '-', 1));

CREATE POLICY "Users can view their own specimens"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'specimens' AND auth.uid()::text = SPLIT_PART(name, '-', 1));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_trademark_applications_updated_at
    BEFORE UPDATE ON trademark_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patent_applications_updated_at
    BEFORE UPDATE ON patent_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_document_generation_updated_at
    BEFORE UPDATE ON document_generation
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 