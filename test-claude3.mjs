import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.AnthropicAPI });

try {
  const response = await client.messages.create({
    model: 'claude-3-7-sonnet-20250219',
    max_tokens: 100,
    messages: [{ role: 'user', content: 'Say hello in one sentence' }],
  });
  
  console.log('✓ Success! Claude 3.7 Sonnet is working!');
  console.log('Response:', response.content[0].text);
} catch (error) {
  console.error('✗ Error:', error.message);
}
