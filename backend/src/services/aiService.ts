import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not configured");
}

const ai = new GoogleGenAI({
  apiKey,
});

export interface ResearchResult {
  summary: string;
  comparison: string;
  advantages: string;
  disadvantages: string;
  recommendation: string;
}

export const generateResearch = async (
  topic: string
): Promise<ResearchResult> => {
  const prompt = `
You are an expert technology research assistant.

Research the following technology topic:

"${topic}"

Provide a clear, useful analysis for a software developer.

Return your answer using EXACTLY these five sections:

SUMMARY:
Give a concise overview of the topic.

COMPARISON:
If the topic compares technologies, compare them directly.
If it does not compare technologies, explain the important alternatives or related technologies.

ADVANTAGES:
List the major advantages.

DISADVANTAGES:
List the major disadvantages.

RECOMMENDATION:
Give a practical recommendation about when a developer should use the technology or which option to choose.

Keep the response factual, developer-friendly, and easy to understand.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const text = response.text;

  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  return parseResearchResponse(text);
};

const parseResearchResponse = (text: string): ResearchResult => {
  const getSection = (section: string, nextSection?: string) => {
    const start = text.indexOf(`${section}:`);

    if (start === -1) {
      return "";
    }

    const contentStart = start + `${section}:`.length;

    const end = nextSection
      ? text.indexOf(`${nextSection}:`, contentStart)
      : text.length;

    return text
      .slice(contentStart, end === -1 ? text.length : end)
      .trim();
  };

  return {
    summary: getSection("SUMMARY", "COMPARISON"),
    comparison: getSection("COMPARISON", "ADVANTAGES"),
    advantages: getSection("ADVANTAGES", "DISADVANTAGES"),
    disadvantages: getSection("DISADVANTAGES", "RECOMMENDATION"),
    recommendation: getSection("RECOMMENDATION"),
  };
};