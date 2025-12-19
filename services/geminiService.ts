
import { GoogleGenAI, Type } from "@google/genai";
import { StoryInput, GeneratedStory } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateStory = async (input: StoryInput): Promise<GeneratedStory> => {
  const textModel = 'gemini-3-flash-preview';
  const imageModel = 'gemini-2.5-flash-image';

  // 1. Generate Story Text
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

  // 2. Generate Cover Image
  const imagePrompt = `A beautiful, magical storybook cover illustration for a story titled "${storyData.title}". 
    The style should be high-quality digital painting, whimsical, with golden ornate borders, 
    rich purple and pink hues, and cinematic lighting. Centered around ${input.protagonist} in a ${input.setting}.`;

  const imageResponse = await ai.models.generateContent({
    model: imageModel,
    contents: { parts: [{ text: imagePrompt }] },
    config: {
      imageConfig: { aspectRatio: "3:4" }
    }
  });

  let coverUrl = `https://picsum.photos/seed/${encodeURIComponent(storyData.title)}/600/800`;
  for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      coverUrl = `data:image/png;base64,${part.inlineData.data}`;
      break;
    }
  }

  return {
    title: storyData.title,
    content: storyData.content,
    coverUrl
  };
};
