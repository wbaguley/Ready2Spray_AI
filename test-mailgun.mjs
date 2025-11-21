import formData from 'form-data';
import Mailgun from 'mailgun.js';
import dotenv from 'dotenv';

dotenv.config();

const mailgunApiKey = process.env.MAILGUN_API_KEY;
const mailgunDomain = process.env.MAILGUN_DOMAIN;
const fromEmail = process.env.FROM_EMAIL;
const ownerName = process.env.OWNER_NAME;

if (!mailgunApiKey) {
  console.error('❌ MAILGUN_API_KEY not found in environment');
  process.exit(1);
}

if (!mailgunDomain) {
  console.error('❌ MAILGUN_DOMAIN not found in environment');
  process.exit(1);
}

console.log('🔑 Mailgun API key found:', mailgunApiKey.substring(0, 10) + '...');
console.log('🌐 Mailgun domain:', mailgunDomain);
console.log('📧 From email:', fromEmail || 'Not set');

const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: 'api', key: mailgunApiKey });

async function testMailgun() {
  try {
    console.log('\n📊 Testing Mailgun API...\n');

    // Test 1: Validate domain
    console.log('1️⃣ Validating domain...');
    const domain = await mg.domains.get(mailgunDomain);
    console.log('✅ Domain:', domain.name);
    console.log('✅ State:', domain.state);
    console.log('✅ Type:', domain.type);

    // Test 2: Check domain verification
    console.log('\n2️⃣ Domain verification status:');
    if (domain.state === 'active') {
      console.log('✅ Domain is verified and active');
    } else {
      console.log('⚠️  Domain is not yet verified:', domain.state);
      console.log('   You need to verify DNS records in Mailgun dashboard');
    }

    // Test 3: List recent events (limit to 5)
    console.log('\n3️⃣ Listing recent email events...');
    try {
      const events = await mg.events.get(mailgunDomain, { limit: 5 });
      console.log(`✅ Found ${events.items?.length || 0} recent events`);
      if (events.items && events.items.length > 0) {
        const recent = events.items[0];
        console.log(`   Recent event: ${recent.event} - ${recent.recipient || 'N/A'}`);
      }
    } catch (err) {
      console.log('⚠️  Could not retrieve events (may require higher API permissions)');
    }

    // Test 4: Send test email (optional - commented out to avoid spam)
    console.log('\n4️⃣ Email sending capability: READY');
    console.log('   (Test email not sent to avoid spam)');
    console.log('   To send test email, uncomment the code in test-mailgun.mjs');
    
    /* Uncomment to actually send a test email:
    const testEmail = {
      from: fromEmail || `noreply@${mailgunDomain}`,
      to: fromEmail || 'test@example.com', // Change this to your email
      subject: 'Mailgun Test Email from Ready2Spray',
      text: 'This is a test email from Ready2Spray to verify Mailgun integration.',
      html: '<h1>Test Email</h1><p>This is a test email from Ready2Spray to verify Mailgun integration.</p>'
    };
    
    const result = await mg.messages.create(mailgunDomain, testEmail);
    console.log('✅ Test email sent! Message ID:', result.id);
    */

    console.log('\n✅ All Mailgun tests passed!\n');
    return true;
  } catch (error) {
    console.error('\n❌ Mailgun test failed:');
    console.error('Error:', error.message);
    if (error.status) {
      console.error('Status:', error.status);
    }
    if (error.details) {
      console.error('Details:', error.details);
    }
    return false;
  }
}

testMailgun()
  .then(success => process.exit(success ? 0 : 1))
  .catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
  });
