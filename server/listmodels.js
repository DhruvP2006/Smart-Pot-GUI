const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  const models = await genAI.listModels();
  models.forEach((model) => {
    console.log(`Model: ${model.name}`);
  });
}

listModels();
