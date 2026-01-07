const axios = require('axios');

async function testSignupFlow() {
    console.log('='.repeat(60));
    console.log('TESTING COMPLETE SIGNUP FLOW');
    console.log('='.repeat(60));

    const testEmail = `test_${Date.now()}@example.com`;

    try {
        console.log('\n1. Testing user registration...');
        console.log(`   Email: ${testEmail}`);

        const response = await axios.post('http://localhost:5000/api/users/register', {
            email: testEmail,
            plan: 'free'
        });

        console.log('   ✅ Registration successful!');
        console.log('   Response:', JSON.stringify(response.data, null, 2));

        if (response.data.success && response.data.apiKey) {
            console.log('\n2. Testing profile retrieval...');

            const profileResponse = await axios.get('http://localhost:5000/api/users/profile', {
                headers: {
                    'x-api-key': response.data.apiKey
                }
            });

            console.log('   ✅ Profile retrieved successfully!');
            console.log('   Profile:', JSON.stringify(profileResponse.data, null, 2));

            console.log('\n3. Testing limit check...');

            const limitResponse = await axios.get('http://localhost:5000/api/check-limit', {
                headers: {
                    'x-api-key': response.data.apiKey
                }
            });

            console.log('   ✅ Limit check successful!');
            console.log('   Limits:', JSON.stringify(limitResponse.data, null, 2));
        }

        console.log('\n' + '='.repeat(60));
        console.log('✅ ALL TESTS PASSED!');
        console.log('='.repeat(60));
        console.log('\n📧 Check the API server console for email mock output.');
        console.log('🌐 Open test-email-preview.html in browser to see email design.');

    } catch (error) {
        console.error('\n❌ TEST FAILED!');
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', error.response.data);
        } else {
            console.error('   Error:', error.message);
        }
    }
}

testSignupFlow();
