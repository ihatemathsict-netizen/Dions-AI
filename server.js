const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {

    try {

        const message = req.body.message;

        const response = await fetch(
            "http://localhost:11434/api/generate",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama3.2:3b",
                    prompt: message,
                    stream: false
                })
            }
        );


        const data = await response.json();

        console.log("AI:", data.response);

        res.json({
            reply: data.response
        });


    } catch(error) {

        console.log(error);

        res.status(500).json({
            reply: "AI server error"
        });

    }

});


app.listen(3000, () => {
    console.log("Dion's AI server running on port 3000");
});