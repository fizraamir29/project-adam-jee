import assert from 'assert';
import './server.js'; // Start the Express server

// Helper sleep function
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runTests() {
  console.log('\n🚀 Starting integration tests after 3s server warm-up...');
  await sleep(3000); // Wait for MongoDB to connect and server to start listening

  const baseUrl = 'http://localhost:5000/api';
  const testEmail = `testuser_${Date.now()}@gmail.com`;
  const testPassword = 'Password123!';
  const testName = 'Test User';

  let token = '';
  let contactId = '';

  try {
    // 1. Health Check Test
    console.log('🔄 Testing Health Check endpoint...');
    const healthRes = await fetch(`${baseUrl}/health`);
    assert.strictEqual(healthRes.status, 200, 'Health check should return status 200');
    const healthData = await healthRes.json();
    assert.strictEqual(healthData.status, 'OK', 'Health status should be OK');
    console.log('✅ Health Check passed!');

    // 2. User Registration Test
    console.log('\n🔄 Testing User Registration...');
    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: testName, email: testEmail, password: testPassword }),
    });

    if (regRes.status !== 201) {
      const errorText = await regRes.text();
      console.error('Registration failed response:', errorText);
    }

    assert.strictEqual(regRes.status, 201, 'User registration should return status 201');
    const regData = await regRes.json();
    assert.ok(regData.token, 'Registration should return a JWT token');
    assert.strictEqual(regData.email, testEmail, 'Returned email should match registered email');
    console.log('✅ User Registration passed!');

    // 3. User Login Test
    console.log('\n🔄 Testing User Login...');
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: testPassword }),
    });
    assert.strictEqual(loginRes.status, 200, 'User login should return status 200');
    const loginData = await loginRes.json();
    assert.ok(loginData.token, 'Login should return a JWT token');
    token = loginData.token;
    console.log('✅ User Login passed!');

    // 4. User Profile (auth/me) Test
    console.log('\n🔄 Testing Profile Retrieval (auth/me)...');
    const profileRes = await fetch(`${baseUrl}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    assert.strictEqual(profileRes.status, 200, 'Profile retrieval should return status 200');
    const profileData = await profileRes.json();
    assert.strictEqual(profileData.user.email, testEmail, 'Profile email should match logged-in user');
    console.log('✅ Profile Retrieval passed!');

    // 5. Contact Form submission & MongoDB Verification Test
    console.log('\n🔄 Testing Contact Form Submission to MongoDB...');
    const contactRes = await fetch(`${baseUrl}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'John Contact',
        email: 'john.contact@gmail.com',
        phone: '+92 300 1234567',
        subject: 'General Inquiry',
        message: 'Hello, this is a test message to verify database persistence!'
      }),
    });
    assert.strictEqual(contactRes.status, 201, 'Contact submission should return status 201');
    const contactData = await contactRes.json();
    assert.ok(contactData.data._id, 'Contact message should be saved and return MongoDB _id');
    contactId = contactData.data._id;
    console.log('✅ Contact Form Submission passed (message successfully stored in MongoDB)!');

    // 6. Products Catalog List Test
    console.log('\n🔄 Testing Products Retrieval...');
    const productsRes = await fetch(`${baseUrl}/products`);
    assert.strictEqual(productsRes.status, 200, 'Products retrieval should return status 200');
    const productsData = await productsRes.json();
    assert.ok(Array.isArray(productsData.products || productsData.data), 'Products response should contain list of products');
    console.log('✅ Products Retrieval passed!');

    // 7. Secure AI Chatbot Test
    console.log('\n🔄 Testing Chatbot AI Integration & Session persistence...');
    const chatRes = await fetch(`${baseUrl}/chatbot/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'What is the warranty policy?' }),
    });
    assert.strictEqual(chatRes.status, 200, 'Chatbot message should return status 200');
    const chatData = await chatRes.json();
    assert.ok(chatData.sessionId, 'Chatbot message should return session ID');
    assert.ok(chatData.message, 'Chatbot message should return reply content');
    console.log('✅ Secure Chatbot integration passed!');

    console.log('\n🎉 ALL INTEGRATION TESTS PASSED SUCCESSFULLY! 🎉\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ INTEGRATION TEST FAILED:', error.message);
    process.exit(1);
  }
}

runTests();
