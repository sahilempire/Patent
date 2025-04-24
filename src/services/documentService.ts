import { GoogleGenerativeAI } from '@google/generative-ai';
import { jsPDF } from 'jspdf';
import { supabase } from '../lib/supabaseClient';

// Initialize the Google Generative AI client
const API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY;
if (!API_KEY) {
  console.error('Google AI API key is not set. Please add VITE_GOOGLE_AI_API_KEY to your .env file');
}

const genAI = new GoogleGenerativeAI(API_KEY || '');

interface DocumentTemplate {
  prompt: string;
  format: string;
}

interface ContentItem {
  type: 'heading1' | 'heading2' | 'listItem' | 'keyValue' | 'paragraph';
  text?: string;
  key?: string;
  value?: string;
}

const processContent = (text: string): ContentItem[] => {
  const lines = text.split('\n');
  const items: ContentItem[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (line.includes('===')) {
      items.push({ type: 'heading1', text: line.replace(/=/g, '').trim() });
    } else if (line.includes('---')) {
      items.push({ type: 'heading2', text: line.replace(/-/g, '').trim() });
    } else if (line.startsWith('- ')) {
      items.push({ type: 'listItem', text: line.substring(2) });
    } else if (line.includes(':')) {
      const [key, value] = line.split(':').map(s => s.trim());
      items.push({ type: 'keyValue', key, value });
    } else {
      items.push({ type: 'paragraph', text: line });
    }
  }
  
  return items;
};

const documentTemplates: Record<string, DocumentTemplate> = {
  "Trademark Application Form": {
    prompt: `You are a legal document generator. Using the following user data, generate a complete and professional Trademark Application Form. The document should be properly formatted with clear sections, proper spacing, and professional legal language.

IMPORTANT: Do not ask for additional information. Use the provided data to generate a complete document.

User Data:
{data}

Generate a complete document that includes:
1. A professional header with the document title
2. Clear section headers for each part of the application
3. All applicant information properly formatted
4. Detailed trademark information with proper descriptions
5. Complete specimen information
6. A professional declaration section
7. Proper signature lines

The document should be ready for filing with the USPTO. Format it with proper spacing and alignment, using clear section headers and maintaining consistent formatting throughout.

IMPORTANT: Do not use markdown formatting (no **, *, etc.). Use proper legal document formatting with:
- Centered headers
- Proper section numbering
- Indented paragraphs
- Proper spacing between sections
- Professional legal language`,
    format: "text"
  },
  "Declaration of Use": {
    prompt: `You are a legal document generator. Using the following user data, generate a complete and professional Declaration of Use document. The document should be properly formatted with clear sections, proper spacing, and professional legal language.

IMPORTANT: Do not ask for additional information. Use the provided data to generate a complete document.

User Data:
{data}

Generate a complete document that includes:
1. A professional header with the document title
2. Clear section headers for each part of the declaration
3. All applicant information properly formatted
4. Detailed trademark information
5. Complete use details with proper descriptions
6. A professional declaration section
7. Proper signature lines

The document should be ready for filing with the USPTO. Format it with proper spacing and alignment, using clear section headers and maintaining consistent formatting throughout.`,
    format: "text"
  },
  "Specimen of Use": {
    prompt: `You are a legal document generator. Using the following user data, generate a complete and professional Specimen of Use document. The document should be properly formatted with clear sections, proper spacing, and professional legal language.

IMPORTANT: Do not ask for additional information. Use the provided data to generate a complete document.

User Data:
{data}

Generate a complete document that includes:
1. A professional header with the document title
2. Clear section headers for each part of the specimen
3. Detailed trademark information
4. Complete specimen details with proper descriptions
5. A professional verification section
6. Proper signature lines

The document should be ready for filing with the USPTO. Format it with proper spacing and alignment, using clear section headers and maintaining consistent formatting throughout.`,
    format: "text"
  },
  "Power of Attorney": {
    prompt: `You are a legal document generator. Using the following user data, generate a complete and professional Power of Attorney document. The document should be properly formatted with clear sections, proper spacing, and professional legal language.

IMPORTANT: Do not ask for additional information. Use the provided data to generate a complete document.

User Data:
{data}

Generate a complete document that includes:
1. A professional header with the document title
2. Clear section headers for each part of the authorization
3. All principal information properly formatted
4. Complete attorney information
5. Detailed authorization details
6. A professional signature section

The document should be ready for filing with the USPTO. Format it with proper spacing and alignment, using clear section headers and maintaining consistent formatting throughout.`,
    format: "text"
  }
};

const textToPdf = (text: string): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new jsPDF();
      
      // Set margins
      const margin = 20;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const contentWidth = pageWidth - (margin * 2);
      
      // Set default font
      doc.setFont('helvetica');
      
      // Process content for formatting
      const lines = text.split('\n');
      let yPosition = margin;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) {
          yPosition += 5; // Add space for empty lines
          continue;
        }

        // Check if we need a new page
        if (yPosition > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }

        // Handle different types of content
        if (line.includes('TRADEMARK APPLICATION')) {
          // Main title
          doc.setFontSize(16);
          doc.setFont('helvetica', 'bold');
          doc.text(line, pageWidth / 2, yPosition, { align: 'center' });
          yPosition += 10;
        } else if (line.includes('To the Commissioner') || line.includes('United States Patent')) {
          // Subtitle
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text(line, pageWidth / 2, yPosition, { align: 'center' });
          yPosition += 8;
        } else if (line.match(/^[IVX]+\./)) {
          // Section headers
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.text(line, margin, yPosition);
          yPosition += 8;
        } else if (line.includes(':')) {
          // Key-value pairs
          const [key, value] = line.split(':').map(s => s.trim());
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text(key + ':', margin, yPosition);
          doc.setFont('helvetica', 'normal');
          doc.text(value || 'Not provided', margin + 50, yPosition);
          yPosition += 7;
        } else {
          // Regular text
          doc.setFontSize(12);
          doc.setFont('helvetica', 'normal');
          const lines = doc.splitTextToSize(line, contentWidth);
          lines.forEach((line: string) => {
            if (yPosition > pageHeight - margin) {
              doc.addPage();
              yPosition = margin;
            }
            doc.text(line, margin, yPosition);
            yPosition += 7;
          });
        }
        
        yPosition += 3; // Add space between lines
      }
      
      // Convert to blob
      const pdfBlob = doc.output('blob');
      resolve(pdfBlob);
    } catch (error) {
      reject(error);
    }
  });
};

export const generateDocument = async (
  userId: string,
  documentName: string
): Promise<Blob> => {
  try {
    if (!API_KEY) {
      throw new Error('Google AI API key is not set. Please add VITE_GOOGLE_AI_API_KEY to your .env file');
    }

    console.log('Fetching user data for userId:', userId);
    
    // Fetch user data from Supabase
    const { data: applications, error: fetchError } = await supabase
      .from('trademark_applications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError) {
      console.error('Error fetching user data:', fetchError);
      if (fetchError.code === 'PGRST116') {
        throw new Error('No trademark application found. Please complete the application form first.');
      }
      throw new Error(`Failed to fetch user data: ${fetchError.message}`);
    }

    if (!applications) {
      console.error('No user data found for userId:', userId);
      throw new Error('No trademark application found. Please complete the application form first.');
    }

    // Check if required fields are present
    const requiredFields = [
      'applicant_name',
      'entity_type',
      'street_address',
      'city',
      'state',
      'zip_code',
      'country',
      'email',
      'goods_services'
    ];

    const missingFields = requiredFields.filter(field => !applications[field]);
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}. Please complete the application form.`);
    }

    console.log('Creating document generation record...');
    
    // Create a document generation record
    const { data: docGenData, error: docGenError } = await supabase
      .from('document_generation')
      .insert([
        {
          user_id: userId,
          application_id: applications.id,
          application_type: 'trademark',
          document_type: documentName,
          document_data: applications,
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (docGenError) {
      console.error('Error creating document generation record:', docGenError);
      throw new Error(`Failed to create document generation record: ${docGenError.message}`);
    }

    if (!docGenData) {
      console.error('No document generation data returned');
      throw new Error('Failed to create document generation record');
    }

    console.log('Document generation record created:', docGenData);

    // Format user data for the AI prompt
    const formattedData = Object.entries(applications)
      .filter(([key]) => !['id', 'created_at', 'updated_at'].includes(key))
      .map(([key, value]) => {
        const formattedKey = key
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        return `${formattedKey}: ${value || 'Not provided'}`;
      })
      .join('\n');

    console.log('Formatted data for AI:', formattedData);

    // Get the template for the requested document
    const template = documentTemplates[documentName];
    if (!template) {
      throw new Error(`Template not found for document type: ${documentName}`);
    }

    // Create the prompt with the formatted data
    const prompt = template.prompt.replace('{data}', formattedData);
    console.log('Generated prompt:', prompt);

    // Generate content using the AI model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text();
    console.log('Generated text:', generatedText);

    // Update the document generation record with the generated content
    const { error: updateError } = await supabase
      .from('document_generation')
      .update({
        generated_content: generatedText,
        status: 'generated',
        updated_at: new Date().toISOString()
      })
      .eq('id', docGenData.id);

    if (updateError) {
      console.error('Error updating document generation record:', updateError);
      throw new Error(`Failed to update document generation record: ${updateError.message}`);
    }

    // Convert the generated text to PDF
    const pdfBlob = await textToPdf(generatedText);
    return pdfBlob;
  } catch (error) {
    console.error('Error in generateDocument:', error);
    throw error;
  }
};
