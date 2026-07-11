require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Serve website files
app.use(express.static(path.join(__dirname)));

// Homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});


// Chat endpoint
app.post("/chat", async (req, res) => {

    try {

        const message = req.body.message;

        if (!message) {
            return res.json({
                reply: "Please enter a message."
            });
        }


        // Free AI models (tries them in order)
        const models = [
            "google/gemma-3-4b-it:free",
            "qwen/qwen3-4b:free",
            "meta-llama/llama-3.2-3b-instruct:free"
        ];


        let result = null;


        for (const model of models) {

            console.log("Trying model:", model);


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

                        model: model,

                        messages: [

                            {
                                role: "system",
                                content:
                                "You are Dion's AI, a helpful, friendly, and professional AI assistant created by Dion Daniel Lobo Enterprises."
                            },

                            {
                                role: "user",
                                content: message
                            }

                        ]

                    })

                }
            );


            if (response.ok) {

                result = await response.json();

                console.log("Using model:", model);

                break;

            }


            console.log(
                model,
                "failed:",
                await response.text()
            );

        }



        if (!result) {

            return res.status(503).json({

                reply:
                "⚠️ AI servers are currently busy. Please try again in a few seconds."

            });

        }



        res.json({

            reply:
            result.choices[0].message.content

        });



    } catch (error) {


        console.error(error);


        res.status(500).json({

            reply:
            "⚠️ Dion's AI server error."

        });


    }

});



const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {

    console.log(
        `✅ Dion's AI Server running on port ${PORT}`
    );

});
