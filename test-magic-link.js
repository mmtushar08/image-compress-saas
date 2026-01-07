const axios = require('axios');

console.log('='.repeat(70));
console.log('TESTING MAGIC LINK AUTHENTICATION FLOW');
console.log('='.repeat(70));

async function testMagicLinkFlow() {
    const testEmail = `test_${Date.now()}@example.com`;

    try {
        // Step 1: Register user
        console.log('\n📝 Step 1: Registering user...');
        console.log(`   Email: ${testEmail}`);

        const registerResponse = await axios.post('http://localhost:5000/api/users/register', {
            email: testEmail,
            plan: 'free'
        });

        console.log('   ✅ Registration successful!');
        console.log('   Response:', JSON.stringify(registerResponse.data, null, 2));

        // Verify that API key is NOT returned
        if (registerResponse.data.apiKey) {
            console.log('   ❌ ERROR: API key should NOT be returned!');
            console.log('   Users must verify email first.');
            return;
        }

        console.log('   ✅ Correct: No API key returned (must verify email)');

        // Step 2: Simulate checking email
        console.log('\n📧 Step 2: Check API console for magic link...');
        console.log('   In production, user would receive email with link like:');
        console.log('   http://localhost:5173/auth?token=XXXXX&email=' + encodeURIComponent(testEmail));

        // Step 3: Read the user data to get the magic token
        console.log('\n🔍 Step 3: Simulating magic link click...');
        const fs = require('fs');
        const path = require('path');
        const usersPath = path.join(__dirname, 'api/data/users.json');
        const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
        const user = users.find(u => u.email === testEmail);

        if (!user || !user.magicToken) {
            console.log('   ❌ ERROR: User or magic token not found');
            return;
        }

        console.log('   Magic token generated:', user.magicToken.substring(0, 20) + '...');

        // Step 4: Verify the token
        console.log('\n🔐 Step 4: Verifying magic link token...');
        const verifyResponse = await axios.get('http://localhost:5000/api/users/verify-token', {
            params: {
                token: user.magicToken,
                email: testEmail
            }
        });

        console.log('   ✅ Token verified successfully!');
        console.log('   User data:', JSON.stringify(verifyResponse.data, null, 2));

        // Verify API key is NOW returned
        if (!verifyResponse.data.apiKey) {
            console.log('   ❌ ERROR: API key should be returned after verification!');
            return;
        }

        console.log('   ✅ API key received:', verifyResponse.data.apiKey);

        // Step 5: Test accessing profile with API key
        console.log('\n👤 Step 5: Testing dashboard access...');
        const profileResponse = await axios.get('http://localhost:5000/api/users/profile', {
            headers: {
                'x-api-key': verifyResponse.data.apiKey
            }
        });

        console.log('   ✅ Dashboard accessible!');
        console.log('   Profile:', JSON.stringify(profileResponse.data, null, 2));

        // Summary
        console.log('\n' + '='.repeat(70));
        console.log('✅ MAGIC LINK FLOW TEST PASSED!');
        console.log('='.repeat(70));
        console.log('\nFlow Summary:');
        console.log('1. ✅ User registered (no API key given)');
        console.log('2. ✅ Magic link generated and stored');
        console.log('3. ✅ Token verified successfully');
        console.log('4. ✅ API key returned after verification');
        console.log('5. ✅ Dashboard accessible with API key');
        console.log('\n🎉 The magic link authentication is working correctly!');
        console.log('   Users CANNOT access API keys without email verification.');

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

testMagicLinkFlow();
