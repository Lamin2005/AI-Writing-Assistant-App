import { GoogleGenAI } from "@google/genai";
import { FeatureId, GenerationRequest, ToneType } from "../types";

// Helper to construct the system instruction based on feature
const getSystemInstruction = (feature: FeatureId, tone?: ToneType): string => {
  switch (feature) {
    case FeatureId.TRANSLATE:
      return "You are a professional translator fluent in English and Burmese. Detect the language of the input. If it is Burmese, translate it to natural, high-quality English. If it is English, translate it to natural, high-quality Burmese.";
    case FeatureId.GRAMMAR:
      return "You are an expert editor. Check the provided text for grammar, spelling, and punctuation errors. Return the corrected text directly. If the text is perfect, return it as is but formatted nicely.";
    case FeatureId.SIMPLIFY:
      return "You are a communication specialist. Rewrite the provided text to be simpler, clearer, and easier to understand, suitable for a general audience (Grade 8 reading level).";
    case FeatureId.EXPAND:
      return "You are a creative writer. Expand the provided short text or bullet points into a detailed, well-structured paragraph that flows naturally while maintaining the original meaning.";
    case FeatureId.TONE:
      return `You are a tone adjustment expert. Rewrite the provided text to have a ${tone || 'Professional'} tone. Keep the core meaning but change the vocabulary and sentence structure to match the requested tone.`;
    case FeatureId.GENERATE:
      return "You are a content generator. Generate comprehensive content based on the provided topic or keywords. Use markdown formatting for headings and lists.";
    case FeatureId.SUMMARY:
      return "You are a summarization expert. Create a concise summary of the provided text, capturing the key points and main ideas. Use bullet points if appropriate.";
    default:
      return "You are a helpful AI writing assistant.";
  }
};

export const generateContent = async (
  request: GenerationRequest
): Promise<string> => {
  // API Key must be configured in environment variables (e.g. Vercel env vars)
  // as process.env.API_KEY
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    throw new Error("API Key is missing. Please configure 'API_KEY' in your environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // Select model based on complexity. 
  // Using gemini-2.5-flash for speed on most tasks, 
  // could switch to pro for complex generation if needed.
  const modelId = 'gemini-2.5-flash';

  const systemInstruction = getSystemInstruction(request.feature, request.tone);

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: request.text,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7, // Balance between creativity and accuracy
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response generated from AI.");
    }

    return resultText;

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    let errorMessage = "An error occurred while generating content.";
    if (error.message) {
        errorMessage = `Error: ${error.message}`;
    }
    throw new Error(errorMessage);
  }
};