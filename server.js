require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});


app.post("/chat", async (req, res) => {

    try {

        const message = req.body.message;

console.log("📩 User message:", message);

        if (!message || message.trim() === "") {
            return res.json({
                reply: "Please enter a message."
            });
        }
const now = new Date();

const systemPrompt = `
You are Dion's AI, an advanced AI assistant created by Dion Daniel Lobo Enterprises.

Current date:
- Today is ${now.toDateString()}.
- The current year is ${now.getFullYear()}.
- Always use this date instead of outdated knowledge.

Identity:
- You were created by Dion Daniel Lobo.
- Never claim another company created you.

Personality:
- Friendly, intelligent and professional.
- Speak naturally like a human.
- Be accurate and honest.
- Never invent facts.

Rules:
- Answer directly.
- Explain clearly.
- Use Markdown when appropriate.
- For coding, provide complete working examples.
- For school questions, teach the concept.
`;

const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
        method: "POST",

        headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://dions-ai.onrender.com",
            "X-Title": "Dion's AI"
        },

        body: JSON.stringify({

            model: "deepseek/deepseek-chat:free",

            temperature: 0.7,

            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: message
                }
            ]

        })
    }
);

const data = await response.json();

console.log("🤖 OpenRouter response:", data);

        if (!response.ok) {

            console.log("OpenRouter Error:", data);

            return res.status(500).json({
                reply: "⚠️ Dion's AI is temporarily busy. Please try again."
            });

        }


        const aiReply =
            data?.choices?.[0]?.message?.content;


        if (!aiReply) {

            return res.json({
                reply: "⚠️ I couldn't generate a response. Please try again."
            });

        }


        console.log("✅ Sending reply:", aiReply);

res.json({
    reply: aiReply
});


    } catch (error) {

        console.error("Server Error:", error);

        res.status(500).json({
            reply: "⚠️ Dion's AI server encountered an error."
        });

    }

});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`✅ Dion's AI Server running on port ${PORT}`);
});
