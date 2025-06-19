const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { OpenAI } = require("openai");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// ✅ Use OpenAI SDK v4 format
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or "gpt-4" if available to you
      messages: [{ role: "user", content: message }],
    });

    res.json({ reply: chatCompletion.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI API error:", error.message);
    res.status(500).json({ error: "Failed to get response from ChatGPT API" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
