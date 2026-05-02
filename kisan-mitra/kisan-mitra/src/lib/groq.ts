import Groq from "groq-sdk";

const groqClient = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY || "",
  dangerouslyAllowBrowser: true
});

export async function askGroq(query: string, lang: string): Promise<string | null> {
  try {
    const prompt = lang === "kn"
      ? `ನೀವು ಭಾರತದ ಕೃಷಿ ಯೋಜನೆ ತಜ್ಞ. ಕನ್ನಡದಲ್ಲಿ 2-3 ವಾಕ್ಯದಲ್ಲಿ ಉತ್ತರಿಸಿ.\nಪ್ರಶ್ನೆ: ${query}`
      : `You are an Indian government scheme assistant. Answer in 2-3 simple sentences in English.\nQuestion: ${query}`;

    const completion = await groqClient.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      max_tokens: 200,
    });
    
    return completion.choices[0]?.message?.content || null;
  } catch (err) {
    console.error("Groq error:", err);
    return null;
  }
}
