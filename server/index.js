
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { fileURLToPath } from "url";

dotenv.config({
  path: fileURLToPath(new URL("./.env", import.meta.url)),
});

const app = express();
const PORT = 5000;

if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is missing from server/.env");
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.use(cors());
app.use(express.json());

// Check whether the backend is running.
app.get("/", (req, res) => {
  res.status(200).json({
    message: "MediGuide AI backend is running!",
  });
});

// Detect possible emergencies using common warning phrases.
// This is a basic safety check, not a medical diagnosis.
function detectEmergency(question) {
  const text = question.toLowerCase();

  const emergencyPatterns = [
    /\b(severe|crushing|intense|sudden)\s+(chest\s+)?pain\b/,
    /\bchest pain\b/,
    /\b(chest pressure|chest tightness)\b/,
    /\b(can't|cannot|unable to|difficulty|trouble)\s+breathe\b/,
    /\b(shortness of breath|severe breathing difficulty)\b/,
    /\b(face drooping|sudden weakness on one side)\b/,
    /\b(signs of a stroke|possible stroke)\b/,
    /\b(unconscious|not waking up|unresponsive)\b/,
    /\b(severe allergic reaction|anaphylaxis)\b/,
    /\b(overdose|poisoning)\b/,
    /\b(uncontrolled bleeding|bleeding won't stop)\b/,
    /\b(seizure lasting|first seizure)\b/,
  ];

  return emergencyPatterns.some((pattern) => pattern.test(text));
}

const emergencyAnswer = `
Your symptoms could indicate a medical emergency.

• Call your local emergency number immediately or ask someone nearby to call.
• Do not drive yourself if you may be experiencing a medical emergency.
• Follow the emergency dispatcher's instructions and seek professional help now.

Do not wait for an online response to get emergency care.
`.trim();

// Handle health questions.
app.post("/api/ask", async (req, res) => {
  const { question } = req.body;

  if (typeof question !== "string" || !question.trim()) {
    return res.status(400).json({
      error: "Please enter a health question.",
    });
  }

  if (question.trim().length > 1000) {
    return res.status(400).json({
      error: "Please keep your question under 1000 characters.",
    });
  }

  const cleanQuestion = question.trim();

  // Respond immediately to common emergency warning phrases.
  if (detectEmergency(cleanQuestion)) {
    console.log("Possible emergency detected. Returning safety guidance.");

    return res.status(200).json({
      answer: emergencyAnswer,
      emergency: true,
    });
  }

  const startTime = Date.now();
  let timeoutId;

  console.log("\nNew MediGuide AI question received.");

  try {
    const timeout = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error("Gemini request timed out after 20 seconds."));
      }, 20000);
    });

    const request = ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: cleanQuestion,
      config: {
        systemInstruction: `
You are MediGuide AI, a friendly general health education assistant.

Rules:
- Answer health questions directly in simple English.
- Give 3 to 5 short bullet points when appropriate.
- Keep answers under 100 words.
- Use complete sentences.
- Avoid repetition and unnecessary introductions.
- Do not add a general disclaimer at the end of every answer.
  The website already displays a health education disclaimer.
- Never diagnose a medical condition or prescribe medicines.
- Recommend a qualified healthcare professional for personal
  medical concerns, persistent symptoms, or worsening symptoms.
- For possible emergencies, advise immediate emergency medical care.
- If a question is unrelated to health, politely explain your purpose.
- Never claim to replace a doctor.
        `,
        temperature: 0.2,
        maxOutputTokens: 300,
      },
    });

    const response = await Promise.race([request, timeout]);

    clearTimeout(timeoutId);

    console.log(
      `Gemini response time: ${Date.now() - startTime} ms`
    );

    const answer = response.text;

    if (!answer || !answer.trim()) {
      return res.status(502).json({
        error: "The AI returned an empty answer. Please try again.",
      });
    }

    console.log("MediGuide AI answer generated successfully.");

    return res.status(200).json({
      answer: answer.trim(),
      emergency: false,
    });
  } catch (error) {
    console.error(
      `Gemini request failed after ${Date.now() - startTime} ms:`,
      error.message
    );

    return res.status(504).json({
      error:
        "MediGuide AI is taking too long to respond. Please try again shortly.",
    });
  } finally {
    clearTimeout(timeoutId);
  }
});

app.listen(PORT, () => {
  console.log(
    `MediGuide AI backend is running at http://localhost:${PORT}`
  );
});
