const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

async function testUpload() {
    try {
        console.log("Creating dummy image...");
        // Create a simple dummy file (just text, but we'll call it .png to pass mime check if server only checks extension initially, 
        // BUT server checks magic bytes. So I need a real image or the test passes if it fails magic bytes.)
        // Actually, I can't easily generate a real image with just node without libraries.
        // I'll assume there is a test image or I'll try to just hit the endpoint and see the response flow.

        // Wait! process_engine checks magic bytes. 
        // I will upload 'api/test.png' if it exists, or look for an image.

        // Let's create a minimal valid PNG
        const pngSignature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
        const header = Buffer.alloc(200); // minimal junk
        const fileContent = Buffer.concat([pngSignature, header]);
        fs.writeFileSync('test_image.png', fileContent);

        const form = new FormData();
        form.append('image', fs.createReadStream('test_image.png'));

        console.log("Uploading image to http://localhost:5000/api/compress...");
        const response = await axios.post('http://localhost:5000/api/compress', form, {
            headers: {
                ...form.getHeaders()
            },
            responseType: 'arraybuffer' // Expect binary
        });

        console.log("Response Status:", response.status);
        console.log("Response Headers:", response.headers);
        console.log("Response Size:", response.data.length);

        if (response.status === 200) {
            console.log("SUCCESS: Image compressed and returned.");
        } else {
            console.log("FAILURE: Unexpected status code.");
        }

    } catch (error) {
        if (error.response) {
            console.error("API Error Status:", error.response.status);
            console.error("API Error Data:", error.response.data.toString());
        } else {
            console.error("Network/Client Error:", error.message);
        }
    }
}

testUpload();
