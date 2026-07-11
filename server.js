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

                    model: "openrouter/free",

                    temperature: 0.7,

                    messages: [

                        {
                            role: "system",
                            content: `
You are Dion's AI, a modern intelligent assistant created by Dion Daniel Lobo Enterprises.

Your personality:
- Friendly, professional, and natural.
- Speak like a helpful human assistant.
- Be clear and easy to understand.
- Avoid robotic answers.

Answer rules:
- Give direct answers first.
- Explain step-by-step when needed.
- Use bullet points for lists.
- Use examples when they help.
- For programming questions, provide clean code and explain it.
- For school questions, teach instead of just giving answers.
- If information is uncertain, say that you are unsure.
- Do not make up fake facts.

Your goal is to be useful, accurate, and pleasant to talk with.
`
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
