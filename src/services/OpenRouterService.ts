
export interface AIAnalysisResult {
  probability: number;
  feedback: string[];
}

export class OpenRouterService {
  private apiKey: string;

  constructor() {
    this.apiKey = localStorage.getItem('openRouterApiKey') || '';
  }

  async analyzeFiling(formData: any): Promise<AIAnalysisResult> {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key not found. Please set it in your account settings.');
    }

    try {
      // Prepare a simplified version of the form data for analysis
      const filingType = formData.filingType || 
        (formData.markName ? 'trademark' : 'patent');
      
      const simplifiedData = {
        filingType,
        ...(filingType === 'trademark' ? {
          markName: formData.markName,
          applicantName: formData.applicantName,
          markType: formData.markType,
          goodsServices: formData.goodsServices,
          hasUsageEvidence: !!formData.usageEvidence
        } : {
          title: formData.title,
          inventorCount: formData.inventors?.length || 0,
          descriptionLength: formData.description?.length || 0,
          claimCount: formData.claims?.length || 0,
          hasPriorArt: formData.priorArtReferences?.length > 0
        })
      };

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
        },
        body: JSON.stringify({
          model: 'mistralai/mixtral-8x7b-instruct',
          messages: [
            {
              role: 'system',
              content: 'You are an AI specialized in analyzing patent and trademark applications. Provide a success probability (as a number between 0-100) and specific feedback points. Format your response as: "Probability: [number between 0-100]\n\nFeedback:\n- [point 1]\n- [point 2]\n- [point 3]"'
            },
            {
              role: 'user',
              content: `Please analyze this ${simplifiedData.filingType} application: ${JSON.stringify(simplifiedData)}`
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const analysis = data.choices[0].message.content;
      
      // Improved regex pattern for more reliable extraction
      const probabilityMatch = analysis.match(/probability:\s*(\d+)/i);
      const probability = probabilityMatch ? (parseInt(probabilityMatch[1], 10) / 100) : 0.5;
      
      // Extract feedback points
      const feedbackSection = analysis.match(/feedback:([\s\S]*)/i)?.[1] || '';
      const feedback = feedbackSection
        .split(/\n-|\n•/)
        .map(item => item.trim())
        .filter(item => item.length > 0);
      
      return {
        probability,
        feedback: feedback.length > 0 ? feedback : ['No specific feedback provided by AI analysis.']
      };
    } catch (error) {
      console.error('OpenRouter analysis error:', error);
      return {
        probability: 0.5,
        feedback: [`Error: ${error instanceof Error ? error.message : 'Unable to analyze application'}`]
      };
    }
  }
}

export const openRouterService = new OpenRouterService();
