// Test the actual tRPC endpoint
const conversationId = 1;
const content = "Hello";

const response = await fetch('http://localhost:3000/api/trpc/chat.sendMessage', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Cookie': 'session=test' // You'll need a real session cookie
  },
  body: JSON.stringify({
    conversationId,
    content
  })
});

console.log('Status:', response.status);
const text = await response.text();
console.log('Response:', text.substring(0, 500));
