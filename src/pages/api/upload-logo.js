// import fs from "fs";
// import path from "path";

// // Increase the body parser limit since images can be large
// export const config = {
//   api: {
//     bodyParser: {
//       sizeLimit: "5mb",
//     },
//   },
// };

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Method Not Allowed" });
//   }

//   try {
//     const { image } = req.body;

//     if (!image) {
//       return res.status(400).json({ message: "No image provided" });
//     }

//     // Strip the base64 metadata (e.g., "data:image/png;base64,")
//     const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

//     // Convert base64 to buffer
//     const buffer = Buffer.from(base64Data, "base64");

//     // Define the path to the public folder
//     const filePath = path.join(process.cwd(), "public", "icon.png");

//     // Write the file
//     fs.writeFileSync(filePath, buffer);

//     return res
//       .status(200)
//       .json({ success: true, message: "Logo updated successfully" });
//   } catch (error) {
//     console.error("Error saving logo:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// }

// src/pages/api/openai-token.js
import { getMasterRuleBook } from "../../lib/ruleBook"; // Adjust path if necessary

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  try {
    // 1. Fetch Master Rule Book for VOICE mode
    const { instructions } = await getMasterRuleBook("voice");

    // 2. OpenAI GA Session Configuration
    const sessionConfig = {
      session: {
        type: "realtime",
        prompt: {
          id: "pmpt_6a7367d873788195bf7a4e09952104ef0d096b48f283d3cf",
          version: "3",
        },
        instructions: instructions,
        audio: {
          input: {
            format: { type: "audio/pcm", rate: 24000 },
            transcription: { model: "whisper-1" },
            noise_reduction: { type: "far_field" },
            turn_detection: {
              type: "server_vad",
              threshold: 0.5,
              prefix_padding_ms: 300,
              silence_duration_ms: 210,
              idle_timeout_ms: null,
            },
          },
          output: {
            format: { type: "audio/pcm", rate: 24000 },
            voice: "ash", // Pre-configured default per user preference
          },
        },
        output_modalities: ["audio"],
        tools: [],
        max_output_tokens: "inf",
        reasoning: { effort: "low" },
      },
    };

    const response = await fetch(
      "https://api.openai.com/v1/realtime/client_secrets",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sessionConfig),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI API Error:", data);
      return res
        .status(response.status)
        .json({ error: data.error?.message || "OpenAI API Error" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Token generation failed:", error);
    res.status(500).json({ error: "Failed to generate session token" });
  }
}
