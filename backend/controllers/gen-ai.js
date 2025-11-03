import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { getAskPrompt, getEditPrompt, getGeneratePrompt } from "../util.js";
import { config } from "dotenv";
config({
  quiet: true,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction: `
    You are a document assistant integrated inside a collaborative editor. 
    You must only help users with tasks related to the provided document text.
    Answer if user queries on topic related to the document text.
    If the user asks something unrelated to the text, always respond with:
    "This question is not related to the selected document text."
    Never answer general knowledge questions or perform tasks outside this scope.
    This is for the ask or edit options only. If user asks to generate content unrelated to the document text then do it.
    But if the user asks to do some general tasks or computation work outside the context of content generation then respond with:
    "This task is outside the scope of document assistance."
    `,
});

const editSchema = {
  type: SchemaType.OBJECT,
  properties: {
    modified_text: {
      type: SchemaType.STRING,
    },
    error: {
      type: SchemaType.STRING,
    },
  },
};

const askSchema = {
  type: SchemaType.OBJECT,
  properties: {
    answer: {
      type: SchemaType.STRING,
    },
    error: {
      type: SchemaType.STRING,
    },
  },
};

const contentSchema = {
  type: SchemaType.OBJECT,
  properties: {
    content: {
      type: SchemaType.STRING,
    },
    error: {
      type: SchemaType.STRING,
    },
  },
};

export async function generateEdit(req, res) {
  try {
    const { selectedText, userInstruction } = req.body;
    if (!selectedText || !userInstruction) {
      return res
        .status(400)
        .json({ error: "SelectedText and Instruction are required" });
    }

    const prompt = getEditPrompt(selectedText, userInstruction);

    const response = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: editSchema,
      },
    });

    let result = response.response.text();
    result = JSON.parse(result);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error generating edit:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error in generating content" });
  }
}

export async function generateExplanation(req, res) {
  try {
    const { selectedText, userQuestion } = req.body;
    if (!selectedText || !userQuestion) {
      return res
        .status(400)
        .json({ error: "Question and context are required" });
    }
    const prompt = getAskPrompt(selectedText, userQuestion);
    const response = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: askSchema,
      },
    });
    let result = response.response.text();
    result = JSON.parse(result);
    res.status(200).json(result);
  } catch (error) {
    console.log("Error generating explanation:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error in generating content" });
  }
}

export async function generateContent(req, res) {
  try {
    const { userPrompt } = req.body;
    if (!userPrompt) {
      return res.status(400).json({ error: "User prompt is required" });
    }
    const prompt = getGeneratePrompt(userPrompt);
    const response = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: contentSchema,
      },
    });

    let result = response.response.text();
    result = JSON.parse(result);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error generating content:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error in generating content" });
  }
}
