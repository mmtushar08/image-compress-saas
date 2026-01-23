const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const API_URL = 'http://localhost:5001/api';
const USERS_DB_PATH = path.join(__dirname, '../api/data/users.json');
const TEST_IMAGE_PATH = path.join(__dirname, '../test.png');

// Utility to create a delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runE2ETest() {
    console.log('='.repeat(80));
    console.log('🚀 STARTING END-TO-END FLOW TEST');
    console.log('='.repeat(80));

    const testEmail = `e2e_test_${Date.now()}@example.com`;
    let apiKey = '';
    let userId = '';

    try {
        // --- STEP 1: REGISTRATION ---
        console.log('\n📝 1. Testing Registration...');
        console.log(`   User: ${testEmail}`);

        const registerRes = await axios.post(`${API_URL}/users/register`, {
            email: testEmail,
            plan: 'free' // Starting with free plan
        });

        if (registerRes.data.success) {
            console.log('   ✅ Registration request successful');
        } else {
            throw new Error(`Registration failed: ${JSON.stringify(registerRes.data)}`);
        }

        // --- STEP 2: MAGIC LINK RETRIEVAL (DB Access) ---
        console.log('\n🔗 2. Retrieving Magic Link Token (Direct DB Access)...');

        // Wait a moment for any async ops (though SQLite is usually sync)
        await delay(500);

        // Require better-sqlite3 from the API's node_modules
        const Database = require('../api/node_modules/better-sqlite3');
        const DB_PATH = path.join(__dirname, '../api/data/users.db');

        if (!fs.existsSync(DB_PATH)) {
            throw new Error(`Database not found at ${DB_PATH}`);
        }

        const db = new Database(DB_PATH, { fileMustExist: true });

        // Retry logic for DB visibility in case of WAL lag (unlikely but safe)
        let magicToken = null;
        for (let i = 0; i < 5; i++) {
            const row = db.prepare('SELECT id, magicToken FROM users WHERE email = ?').get(testEmail);
            if (row && row.magicToken) {
                magicToken = row.magicToken;
                userId = row.id;
                break;
            }
            await delay(500);
        }

        if (!magicToken) {
            throw new Error('User not found or magic token missing in DB');
        }

        console.log('   ✅ Found user in DB');
        console.log(`   🔑 Magic Token: ${magicToken.substring(0, 15)}...`);

        // --- STEP 3: AUTHENTICATION ---
        console.log('\n🔐 3. Verifying Token & Logging In...');

        const verifyRes = await axios.get(`${API_URL}/users/verify-token`, {
            params: {
                token: magicToken,
                email: testEmail
            }
        });

        if (verifyRes.data.success && verifyRes.data.apiKey) {
            apiKey = verifyRes.data.apiKey;
            console.log('   ✅ Login successful');
            console.log(`   🎫 API Key received: ${apiKey.substring(0, 10)}...`);
        } else {
            throw new Error(`Verification failed: ${JSON.stringify(verifyRes.data)}`);
        }

        // --- STEP 4: CHECK PROFILE & LIMITS ---
        console.log('\n👤 4. Checking Profile & Limits...');

        const profileRes = await axios.get(`${API_URL}/users/profile`, {
            headers: { 'x-api-key': apiKey }
        });

        console.log(`   Plan: ${profileRes.data.plan}`);
        console.log(`   Credits: ${profileRes.data.usage}/${profileRes.data.total}`);
        console.log('   ✅ Profile access confirmed');

        // --- STEP 5: SIMULATE PLAN UPGRADE (Optional / Context dependent) ---
        // For now, we stick to free plan features for the basic flow test
        // If we needed to test Pro, we'd need to mock a payment webhook here.

        // --- STEP 6: IMAGE COMPRESSION ---
        console.log('\n🖼️  5. Testing Image Compression...');

        if (!fs.existsSync(TEST_IMAGE_PATH)) {
            // Create a dummy image if not exists
            const { createCanvas } = require('canvas'); // Might not exist, fallback to warning
            console.warn(`   ⚠️ Test image not found at ${TEST_IMAGE_PATH}. Skipping compression test.`);
            // In a real scenario, we might want to generate a small png or require it.
        } else {
            const formData = new FormData();
            formData.append('image', fs.createReadStream(TEST_IMAGE_PATH));

            console.log(`   POSTing to ${API_URL}/compress...`);

            // NOTE: Adjusting headers for FormData with axios is tricky, form-data lib handles it
            const compressRes = await axios.post(`${API_URL}/compress`, formData, {
                headers: {
                    'x-api-key': apiKey,
                    ...formData.getHeaders()
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
                responseType: 'arraybuffer' // Expect binary
            });

            if (compressRes.status === 200 || compressRes.status === 201) {
                console.log(`   ✅ Compression success (${compressRes.status} Created/OK)`);
                const originalSize = compressRes.headers['x-original-size'];
                const compressedSize = compressRes.headers['x-compressed-size'];
                const saved = compressRes.headers['x-saved-percent'];

                console.log(`   📂 Original: ${originalSize || 'N/A'}`);
                console.log(`   📉 Compressed: ${compressedSize || 'N/A'}`);
                console.log(`   💾 Saved: ${saved || 'N/A'}%`);
            } else {
                throw new Error(`Compression failed with status: ${compressRes.status}`);
            }
        }

        console.log('\n' + '='.repeat(80));
        console.log('✅ ALL SYSTEMS GO - E2E TEST PASSED');
        console.log('='.repeat(80));

    } catch (error) {
        console.error('\n❌ TEST FAILED');
        if (error.response) {
            console.error(`   Status: ${error.response.status}`);
            console.error(`   Data:`, JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(`   Error Message: ${error.message}`);
            console.error(`   Error Code: ${error.code}`);
            if (error.config) {
                console.error(`   URL: ${error.config.url}`);
                console.error(`   Method: ${error.config.method}`);
            }
            console.error(`   Stack: ${error.stack}`);
        }
        process.exit(1);
    }
}

runE2ETest();
