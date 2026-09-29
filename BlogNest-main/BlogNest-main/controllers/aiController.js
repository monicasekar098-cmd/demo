const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function generateBlog(req, res) {

    try {

        const { topic } = req.body;

        if (!topic) {
            return res.status(400).json({
                success: false,
                message: "Topic is required"
            });
        }

        const prompt = `
Write a high-quality blog post about "${topic}".

Give the response in this format:

Title:
A suitable blog title

Content:
A detailed blog article with introduction,
main points and conclusion.

Use simple, clear English.
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

        console.error("Gemini Error:", error);

        res.status(500).json({
            success: false,
            message: "Gemini AI generation failed",
            error: error.message
        });
    }
}

module.exports = {
    generateBlog
};