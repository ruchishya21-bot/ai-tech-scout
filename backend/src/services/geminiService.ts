import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const researchTechnology = async (topic: string) => {
  const prompt = `
You are an expert technology research assistant.

Research this technology topic or comparison:
"${topic}"

Give practical, engineering-focused information that helps a developer decide what to build.

Return ONLY valid JSON in exactly this format:

{
  "summary": "Short executive summary",
  "comparison": "Detailed technical comparison",
  "advantages": "Main advantages",
  "disadvantages": "Main disadvantages",
  "use_cases": "Practical use cases",
  "performance": "Performance, scalability and efficiency considerations",
  "best_for": "Who or what this technology is best suited for",
  "recommendation": "Final recommendation with reasoning"
}

Rules:
- Do not use markdown.
- Do not use code fences.
- Return only JSON.
- Keep every value as a plain string.
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