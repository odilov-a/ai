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

async function testThis() {
  const response = await getGeminiResponse(
    "hello, how are you doing today?"
  );
  console.log(response);
}

testThis();
