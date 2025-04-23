import { NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { TrademarkApplication, PatentApplication } from '@/lib/supabase';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { application, type } = await request.json();

    // Generate document content using Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    let prompt = '';
    if (type === 'trademark') {
      const trademarkApp = application as TrademarkApplication;
      prompt = `Generate a professional trademark application document with the following information:

Basic Information:
- Applicant Name: ${trademarkApp.applicant_name}
- Trademark: ${trademarkApp.trademark}
- Mark Name: ${trademarkApp.mark_name}
- Mark Type: ${trademarkApp.mark_type}
- Filing Basis: ${trademarkApp.filing_basis}

Owner Information:
- Owner Name: ${trademarkApp.owner_name}
- Owner Type: ${trademarkApp.owner_type}
- Owner Address: ${trademarkApp.owner_address}

Goods & Services:
${trademarkApp.goods_services.map((item, index) => `
Item ${index + 1}:
- Description: ${item.description}
- Class: ${item.class}
- Industry: ${item.industry}
- Target Market: ${item.target_market}
`).join('\n')}

${trademarkApp.filing_basis === 'use_in_commerce' ? `
Usage Evidence:
- First Use Date: ${trademarkApp.usage_evidence.first_use_date}
- First Use in Commerce: ${trademarkApp.usage_evidence.first_use_commerce}
- Commerce Type: ${trademarkApp.usage_evidence.commerce_type}
- Usage Description: ${trademarkApp.usage_evidence.usage_description}
- Specimen URL: ${trademarkApp.usage_evidence.specimen_url}
` : ''}

Please format this as a professional legal document with proper sections, headers, and formatting.`;
    } else {
      const patentApp = application as PatentApplication;
      prompt = `Generate a professional patent application document with the following information:

Title: ${patentApp.title}

Inventors:
${patentApp.inventors.map((inventor, index) => `
Inventor ${index + 1}:
- Name: ${inventor.name}
- Address: ${inventor.address}
- Nationality: ${inventor.nationality}
`).join('\n')}

Description:
${patentApp.description}

Claims:
${patentApp.claims.map((claim, index) => `
Claim ${index + 1}: ${claim.text}
`).join('\n')}

Prior Art:
${patentApp.prior_art.map((art, index) => `
Reference ${index + 1}:
- Title: ${art.title}
- Author: ${art.author}
- Publication Date: ${art.publication_date}
- Description: ${art.description}
`).join('\n')}

Please format this as a professional legal document with proper sections, headers, and formatting.`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const documentContent = response.text();

    // Create PDF document
    const doc = new PDFDocument();
    const chunks: Uint8Array[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));

    // Add content to PDF
    doc.fontSize(20).text(`${type === 'trademark' ? 'Trademark' : 'Patent'} Application`, { align: 'center' });
    doc.moveDown();

    // Split content into paragraphs and add to PDF
    const paragraphs = documentContent.split('\n\n');
    paragraphs.forEach(paragraph => {
      doc.fontSize(12).text(paragraph);
      doc.moveDown();
    });

    // Finalize PDF
    doc.end();

    // Wait for all chunks to be collected
    const pdfBuffer = await new Promise<Buffer>((resolve) => {
      doc.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
    });

    // Return the PDF as a response
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${type}-application-${application.id}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating document:', error);
    return NextResponse.json(
      { error: 'Failed to generate document' },
      { status: 500 }
    );
  }
} 