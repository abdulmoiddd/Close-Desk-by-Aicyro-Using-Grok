import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const { name, business_type, time } = req.body;
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "OpenAI API Key missing" });
    }

    const openai = new OpenAI({ apiKey });

    const systemPrompt = {
      role: "system",
      content: `You are an expert sales assistant for Aicyro. Your job is to write a highly personalized, warm, and brief confirmation email for a booked demo/audit.
      
Force strict raw JSON output:
{
  "subject": "The email subject line",
  "body": "The email body in plain text. Acknowledge their business type, confirm the meeting time, and express excitement to show them how Aicyro can capture more leads."
}`,
    };

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        systemPrompt,
        {
          role: "user",
          content: `Lead Name: ${name || "There"}\nBusiness Type: ${business_type || "Your Business"}\nBooked Time: ${time}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 250,
    });

    const aiResponse = JSON.parse(completion.choices[0].message.content);
    return res.status(200).json(aiResponse);
  } catch (error) {
    console.error("Email Generation Error:", error);
    return res.status(500).json({ error: "Failed to generate email" });
  }
}
