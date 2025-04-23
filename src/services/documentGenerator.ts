import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI with Flash model
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

interface DocumentGenerationParams {
  documentType: string;
  userData: Record<string, any>;
}

export const generateDocument = async ({
  documentType,
  userData,
}: DocumentGenerationParams): Promise<string> => {
  try {
    // Use the Flash model for faster generation
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    let prompt = "";
    switch (documentType) {
      case "Trademark Application":
        prompt = `Generate a USPTO Trademark Application form based on the following information:
        - Applicant Name: ${userData.applicantName}
        - Trademark: ${userData.trademark}
        - Goods/Services: ${userData.goodsServices}
        - Basis for Filing: ${userData.filingBasis}
        - Specimen Description: ${userData.specimenDescription}
        
        Please format the response as a properly structured USPTO form with the following sections:
        1. Applicant Information
        2. Trademark Details
        3. Goods/Services Description
        4. Basis for Filing
        5. Specimen Description
        6. Declaration Statement
        
        Make sure to include all necessary legal disclaimers and formatting. Use proper USPTO form structure and terminology.`;
        break;
      case "Goods and Services Description":
        prompt = `Generate a detailed Goods and Services Description document based on the following information:
        - Trademark: ${userData.trademark}
        - Goods/Services: ${userData.goodsServices}
        - Industry: ${userData.industry}
        - Target Market: ${userData.targetMarket}
        
        Please format this as a legal document with:
        1. Detailed description of goods/services
        2. International Class classification
        3. Specific use cases
        4. Market context
        5. Legal terminology and proper formatting`;
        break;
      case "Declaration of Use":
        prompt = `Generate a Declaration of Use document based on the following information:
        - Applicant Name: ${userData.applicantName}
        - Trademark: ${userData.trademark}
        - Goods/Services: ${userData.goodsServices}
        - Date of First Use: ${userData.firstUseDate}
        - Current Use Status: ${userData.currentUseStatus}
        - Specimen Description: ${userData.specimenDescription}
        
        Please format this as a formal declaration document with:
        1. Applicant's sworn statement
        2. Details of use
        3. Current status
        4. Legal declarations
        5. Notary section
        6. Proper USPTO formatting`;
        break;
      case "Specimen of Use":
        prompt = `Generate a Specimen of Use document based on the following information:
        - Trademark: ${userData.trademark}
        - Goods/Services: ${userData.goodsServices}
        - Specimen Description: ${userData.specimenDescription}
        - Date of First Use: ${userData.firstUseDate}
        - Type of Specimen: ${userData.specimenType}
        
        Please format this as a professional specimen document with:
        1. Clear description of the mark in use
        2. Date of first use
        3. Context of use
        4. Supporting evidence description
        5. Declaration of authenticity
        6. Proper USPTO formatting`;
        break;
      default:
        throw new Error("Unsupported document type");
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating document:", error);
    throw new Error("Failed to generate document. Please try again.");
  }
};

export const downloadDocument = async (content: string, filename: string) => {
  try {
    // Convert the text content to a Blob
    const blob = new Blob([content], { type: "application/pdf" });
    
    // Create a URL for the Blob
    const url = window.URL.createObjectURL(blob);
    
    // Create a temporary link element
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    
    // Append the link to the document, click it, and remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading document:", error);
    throw new Error("Failed to download document. Please try again.");
  }
}; 