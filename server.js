const express = require("express");
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config();
const apiKey = process.env.GOOGLE_API_KEY;

const modelConfig = {
  model: "gemini-1.5-pro-latest",
  temperature: 0.8,
  maxTokens: 64,
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
  ],
};

const app = express();
app.use(express.json());
async function getGeminiResponse(userMessage) {
  const generativeAI = new GoogleGenerativeAI(apiKey);
  const model = generativeAI.getGenerativeModel(modelConfig);
  try {
    const result = await model.generateContent(userMessage);
    const response = result?.response?.text();
    return response || "No response received.";
  } catch (error) {
    console.error("Error generating response:", error);
    return "An error occurred while generating the response.";
  }
}

app.get("/", (req, res) => {
  return res.send("Hello, welcome to the Gemini API.");
});

app.post("/generate", async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).send("Message is required.");
  }
  const response = await getGeminiResponse(message);
  return res.send({ data: response });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
