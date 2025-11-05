import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
axios.defaults.withCredentials = true;

export async function askAiApi(context, prompt) {
  try {
    const response = await axios.post("/gen-ai/ask", {
      selectedText: context,
      userQuestion: prompt,
    });
    if (response.data.error) {
      return response.data.error;
    }
    return response.data.answer;
  } catch (error) {
    console.error("Error asking AI:", error);
    return "Error in communicating with AI";
  }
}

export async function editAiApi(context, prompt) {
  try {
    const response = await axios.post("/gen-ai/edit", {
      selectedText: context,
      userInstruction: prompt,
    });
    if (response.data.error) {
      return response.data.error;
    }
    return response.data.modified_text;
  } catch (error) {
    console.error("Error editing AI:", error);
    return "Error in communicating with AI";
  }
}

export async function generateAiApi(prompt) {
  try {
    const response = await axios.post("/gen-ai/generate", {
      userPrompt: prompt,
    });
    if (response.data.error) {
      return response.data.error;
    }
    return response.data.content;
  } catch (error) {
    console.error("Error generating AI:", error);
    return "Error in communicating with AI";
  }
}

export async function getIceServers() {
  try {
    const response = await axios.get("/ice");
    return response.data;
  } catch (error) {
    console.log("Error fetching ICE servers:", error);
    return null;
  }
}
