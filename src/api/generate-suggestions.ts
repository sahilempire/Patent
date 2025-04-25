import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.VITE_ANTHROPIC_API_KEY,
});

export async function generateSuggestions(req: Request) {
  try {
    const { title, summary, type, inventors } = await req.json();
    console.log('📝 Received patent data:', { title, type, inventors, summary });

    const prompt = `As a patent expert, review the following patent application details and provide specific suggestions for improvement:

Title: ${title}
Type: ${type}
Inventors: ${inventors}
Summary: ${summary}

Please provide 3-5 specific suggestions for improving the patent application, focusing on:
1. Clarity and precision of the title
2. Completeness of the inventor information
3. Strength and comprehensiveness of the summary
4. Alignment with ${type} patent requirements
5. Potential areas for expansion or clarification

Format each suggestion as a clear, actionable item.`;

    console.log('🤖 Sending prompt to Anthropic API:', prompt);
    console.log('⏳ Waiting for Anthropic API response...');

    const message = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 500,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    console.log('✅ Received response from Anthropic API');
    console.log('📊 Raw API response:', JSON.stringify(message, null, 2));

    // Extract the text content from the response
    const responseText = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '';
    
    console.log('📄 Extracted text from response:', responseText);

    const suggestions = responseText
      .split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => line.replace(/^\d+\.\s*/, '').trim());

    console.log('✨ Processed suggestions:', suggestions);

    return new Response(JSON.stringify({ suggestions }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ Error generating suggestions:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate suggestions' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
} 