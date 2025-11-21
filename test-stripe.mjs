import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error('❌ STRIPE_SECRET_KEY not found in environment');
  process.exit(1);
}

console.log('🔑 Stripe secret key found:', stripeSecretKey.substring(0, 10) + '...');

const stripe = new Stripe(stripeSecretKey);

async function testStripe() {
  try {
    console.log('\n📊 Testing Stripe API...\n');

    // Test 1: Retrieve account information
    console.log('1️⃣ Retrieving Stripe account info...');
    const account = await stripe.account.retrieve();
    console.log('✅ Account ID:', account.id);
    console.log('✅ Account email:', account.email || 'N/A');
    console.log('✅ Account type:', account.type);
    console.log('✅ Charges enabled:', account.charges_enabled);
    console.log('✅ Payouts enabled:', account.payouts_enabled);

    // Test 2: List recent customers (limit to 5)
    console.log('\n2️⃣ Listing recent customers...');
    const customers = await stripe.customers.list({ limit: 5 });
    console.log(`✅ Found ${customers.data.length} customers`);
    if (customers.data.length > 0) {
      console.log('   Recent customer:', customers.data[0].email || customers.data[0].id);
    }

    // Test 3: List recent payment intents (limit to 5)
    console.log('\n3️⃣ Listing recent payment intents...');
    const paymentIntents = await stripe.paymentIntents.list({ limit: 5 });
    console.log(`✅ Found ${paymentIntents.data.length} payment intents`);
    if (paymentIntents.data.length > 0) {
      const recent = paymentIntents.data[0];
      console.log(`   Recent payment: ${recent.amount / 100} ${recent.currency.toUpperCase()} - ${recent.status}`);
    }

    // Test 4: List products
    console.log('\n4️⃣ Listing products...');
    const products = await stripe.products.list({ limit: 5 });
    console.log(`✅ Found ${products.data.length} products`);
    if (products.data.length > 0) {
      console.log('   Product:', products.data[0].name);
    }

    console.log('\n✅ All Stripe tests passed!\n');
    return true;
  } catch (error) {
    console.error('\n❌ Stripe test failed:');
    console.error('Error:', error.message);
    if (error.type) {
      console.error('Type:', error.type);
    }
    if (error.code) {
      console.error('Code:', error.code);
    }
    return false;
  }
}

testStripe()
  .then(success => process.exit(success ? 0 : 1))
  .catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
  });
