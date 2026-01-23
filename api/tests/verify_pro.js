const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

const BASE_URL = 'http://localhost:5000/api';

async function verifyProUsage() {
    try {
        console.log("1. Registering Pro User...");
        const email = `pro_test_${Date.now()}@example.com`;
        const regRes = await axios.post(`${BASE_URL}/users/register`, {
            email,
            plan: 'pro'
        });

        if (!regRes.data.success) throw new Error("Registration failed");

        const apiKey = regRes.data.apiKey;
        console.log(`   User registered. API Key: ${apiKey}`);

        console.log("2. Checking Initial Limit...");
        let limitRes = await axios.get(`${BASE_URL}/check-limit`, {
            headers: { 'x-api-key': apiKey }
        });
        console.log(`   Limit: ${limitRes.data.remaining}, Usage: ${limitRes.data.usage}`);

        if (limitRes.data.usage !== 0) throw new Error("Initial usage should be 0");

        console.log("3. Uploading Image...");
        // Use the existing test.png if available, or create one
        if (!fs.existsSync('test.png')) {
            const buffer = Buffer.from('89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c63000100000500010d0a2d600000000049454e44ae426082', 'hex');
            fs.writeFileSync('test.png', buffer);
        }

        const form = new FormData();
        form.append('image', fs.createReadStream('test.png'));

        await axios.post(`${BASE_URL}/compress`, form, {
            headers: {
                'x-api-key': apiKey,
                ...form.getHeaders()
            }
        });
        console.log("   Compression successful.");

        console.log("4. Checking Limit After Upload...");
        limitRes = await axios.get(`${BASE_URL}/check-limit`, {
            headers: { 'x-api-key': apiKey }
        });
        console.log(`   Limit: ${limitRes.data.remaining}, Usage: ${limitRes.data.usage}`);

        if (limitRes.data.usage !== 1) {
            throw new Error(`Usage should be 1, but got ${limitRes.data.usage}`);
        }

        console.log("✅ VERIFICATION SUCCESSFUL: Pro plan usage tracking works.");

    } catch (error) {
        console.error("❌ VERIFICATION FAILED:", error.message);
        if (error.response) console.error("   API Response:", error.response.data);
    }
}

verifyProUsage();
