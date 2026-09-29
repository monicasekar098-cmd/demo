const express = require("express");

const router = express.Router();


// GENERATE BLOG
router.post("/generate-blog", async (req, res) => {

    try {

        const { GoogleGenAI } = require("@google/genai");

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });

        const topic = req.body.topic;

        if (!topic) {
            return res.status(400).json({
                success: false,
                message: "Topic is required"
            });
        }

        const prompt = `
Write a high-quality blog post about "${topic}".

Give:
1. A clear title
2. Introduction
3. Main points
4. Conclusion

Use simple and clear English.
`;

        const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: prompt
        });

        res.json({
            success: true,
            topic: topic,
            result: response.text
        });

    } catch (error) {

        console.error("Gemini Generate Error:", error);

        res.status(500).json({
            success: false,
            message: "Gemini generation failed",
            error: error.message
        });

    }

});


// SUMMARIZE BLOG
router.post("/summarize", async (req, res) => {

    try {

        const { GoogleGenAI } = require("@google/genai");

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });

        const content = req.body.content;

        if (!content) {
            return res.status(400).json({
                success: false,
                message: "Content is required"
            });
        }

        const prompt = `
Summarize the following blog in 3 to 5 simple sentences.

Blog:

${content}
`;

        const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: prompt
        });

        res.json({
            success: true,
            summary: response.text
        });

    } catch (error) {

        console.error("Gemini Summarize Error:", error);

        res.status(500).json({
            success: false,
            message: "Summarization failed",
            error: error.message
        });

    }

});


module.exports = router;