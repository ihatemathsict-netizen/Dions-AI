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

        if (!message) {
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

                    // OpenRouter automatically chooses an available free model
                    model: "openrouter/free",

                    messages: [
                        {
                            role: "system",
                            content:
                            "You are Dion's AI, a helpful, friendly and professional AI assistant created by Dion Daniel Lobo Enterprises."
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


        if (!response.ok) {

            console.log(data);

            return res.status(500).json({
                reply: "⚠️ AI provider error. Try again shortly."
            });

        }


        res.json({
            reply: data.choices[0].message.content
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            reply: "⚠️ Dion's AI server error."
        });

    }

});



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`✅ Dion's AI Server running on port ${PORT}`);
});
