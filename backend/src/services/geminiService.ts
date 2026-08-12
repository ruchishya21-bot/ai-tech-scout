import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const researchTechnology = async (topic: string) => {
  const prompt = `
You are an expert technology research assistant.

Research this technology topic:

"${topic}"

Provide practical, accurate and useful engineering intelligence.

Return ONLY valid JSON in exactly this format:

{
  "summary": "Short executive summary",
  "comparison": "Detailed technical comparison and important trade-offs",
  "advantages": "Main advantages",
  "disadvantages": "Main disadvantages",
  "recommendation": "Final recommendation explaining when and why to choose it",
  "use_cases": "Important real-world use cases",
  "performance": "Performance, scalability and efficiency considerations",
  "best_for": "Who or what type of project this technology is best suited for"
}

Rules:
- Return ONLY JSON.
- Do not use Markdown.
- Do not use code fences.
- Do not add text before or after the JSON.
- Keep every field as a useful string.
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