require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Serve all static files (index.html, logo.png, css, js, etc.)
app.use(express.static(path.join(__dirname)));

// Homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Chat endpoint
app.post("/chat", async (req, res) => {

    try {

        const message = req.body.message;

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
                    model: "meta-llama/llama-3.2-3b-instruct:free",
                    messages: [
                        {
                            role: "system",
                            content: "You are Dion's AI, a helpful, friendly, and professional AI assistant created by Dion Daniel Lobo Enterprises."
                        },
                        {
                            role: "user",
                            content: message
                        }
                    ]
                })
            }
        );

        if (!response.ok) {
            const error = await response.text();
            console.error(error);

            return res.status(500).json({
                reply: "⚠️ AI Server Error"
            });
        }

        const data = await response.json();

        res.json({
            reply: data.choices[0].message.content
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            reply: "⚠️ AI Server Error"
        });

    }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`✅ Dion's AI Server running on port ${PORT}`);
});
