import Anthropic from '@anthropic-ai/sdk';

const apiKey = process.env.AnthropicAPI;
console.log('API Key exists:', !!apiKey);
console.log('API Key length:', apiKey?.length);

if (!apiKey) {
  console.error('No API key found!');
  process.exit(1);
}

const client = new Anthropic({ apiKey });

try {
  const response = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 100,
    messages: [{ role: 'user', content: 'Say hello' }],
  });
  
  console.log('Success!', response.content[0].text);
} catch (error) {
  console.error('Error:', error.message);
}
