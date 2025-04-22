
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
      throw new Error('OpenRouter API key not found');
    }

    try {
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
              content: 'You are an AI specialized in analyzing patent and trademark applications. Analyze the provided application details and provide a success probability and feedback.'
            },
            {
              role: 'user',
              content: `Please analyze this ${formData.filingType} application: ${JSON.stringify(formData)}`
            }
          ]
        })
      });

      const data = await response.json();
      const analysis = data.choices[0].message.content;
      
      // Parse the AI response to extract probability and feedback
      const probability = parseFloat(analysis.match(/probability:\s*(\d+)/i)?.[1] || '50') / 100;
      const feedback = analysis.match(/feedback:([\s\S]*)/i)?.[1]
        ?.split('\n')
        .filter(Boolean)
        .map(f => f.trim()) || [];

      return {
        probability,
        feedback
      };
    } catch (error) {
      console.error('OpenRouter analysis error:', error);
      return {
        probability: 0.5,
        feedback: ['Unable to analyze application at this time']
      };
    }
  }
}

export const openRouterService = new OpenRouterService();
