import { GoogleGenAI, Type } from "@google/genai";
import { StoryInput, GeneratedStory } from "../types";

// Free tier Gemini model use karne ke liye
const ai = new GoogleGenAI({ apiKey: 'AIzaSyARNyC9AY6CfM8nJsZ_rfxk8xCbdTjHcA0' });

export const generateStory = async (
  input: StoryInput
): Promise<GeneratedStory> => {

  const textModel = 'gemini-2.5-flash-lite'; // Free model

  const textPrompt = `Write a short, magical storybook tale (approx 300 words).
Protagonist: ${input.protagonist}
Setting: ${input.setting}
Theme: ${input.theme}
Tone: ${input.tone}
Provide the output in JSON format with 'title' and 'content' keys.`;

  const textResponse = await ai.models.generateContent({
    model: textModel,
    contents: textPrompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING }
        },
        required: ["title", "content"]
      }
    }
  });

  const storyData = JSON.parse(textResponse.text);

  // Pollinations free API se image URL generate karna
  const promptForImage = encodeURIComponent(
    `A magical storybook cover illustration for a story titled "${storyData.title}", featuring ${input.protagonist} in ${input.setting}, whimsical and colorful style.`
  );
  const coverUrl = `https://pollinations.ai/p/${promptForImage}`;

  return {
    title: storyData.title,
    content: storyData.content,
    coverUrl
  };
};