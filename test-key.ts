import { GoogleGenAI } from "@google/genai";

// Unset conflicting environment variables
delete process.env.GOOGLE_API_KEY;
delete process.env.GEMINI_API_KEY;

// Your new API key
const apiKey = "AIzaSyBFgz_67qAzOHw_nVReCpLre80UYOLqvBo";

async function testKey() {
    console.log("Testing your new API Key...");
    try {
        const client = new GoogleGenAI({ apiKey });
        const response = await client.models.generateContent({
            model: 'gemini-2.0-flash-exp',
            contents: [{ role: 'user', parts: [{ text: 'Say hello!' }] }]
        });
        console.log("✅ API Key is VALID!");
        console.log("Response:", response.response.text());
    } catch (error: any) {
        console.error("❌ API Key test FAILED.");
        console.error("Error:", error.message);
    }
}

testKey();
