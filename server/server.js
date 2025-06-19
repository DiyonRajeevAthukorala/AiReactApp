const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Initialize Gemini with latest config
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" }); // ✅ Latest model
    const result = await model.generateContent(message);
    const reply = result.response.text();
    res.json({ reply });
  } catch (error) {
    console.error("Gemini API error:", error.message);
    res.status(500).json({ error: "Gemini API error" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
