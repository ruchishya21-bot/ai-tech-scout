import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const researchTechnology = async (topic: string) => {
  const prompt = `
You are an expert technology research assistant.

Research this topic:

"${topic}"

Provide a clear and useful analysis.

Return ONLY valid JSON in this exact format:

{
  "summary": "Short summary",
  "comparison": "Detailed comparison",
  "advantages": "Main advantages",
  "disadvantages": "Main disadvantages",
  "recommendation": "Final recommendation"
}

Do not use markdown.
Do not wrap the JSON in code fences.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  const text = response.text;

  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  const cleanText = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(cleanText);
  } catch {
    throw new Error(
      `Gemini returned invalid JSON: ${cleanText.substring(0, 500)}`
    );
  }
};