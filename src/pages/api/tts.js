// src/pages/api/tts.js
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import { Readable } from "stream";

const polly = new PollyClient({
  region: process.env.CUSTOM_AWS_REGION,
  credentials: {
    accessKeyId: process.env.CUSTOM_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.CUSTOM_AWS_SECRET_ACCESS_KEY,
  },
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { text, voiceId = "Joanna" } = req.body;

    // --- FIX: VOICE ID MAPPING ---
    // AWS Polly does not support OpenAI's "ash" voice.
    // We map it to a fallback AWS Polly voice so the test audio doesn't crash.
    let safeVoiceId = voiceId;
    if (safeVoiceId.toLowerCase() === "ash") {
      safeVoiceId = "Matthew"; // Safe fallback for the dashboard preview
    }

    const command = new SynthesizeSpeechCommand({
      Engine: "neural",
      LanguageCode: "en-US",
      OutputFormat: "mp3",
      Text: text,
      VoiceId: safeVoiceId, // MUST be a valid AWS voice
    });

    const response = await polly.send(command);

    res.setHeader("Content-Type", "audio/mpeg");

    // Safely pipe the AWS SDK v3 stream to the Next.js response
    if (response.AudioStream instanceof Readable) {
      response.AudioStream.pipe(res);
    } else {
      const stream = Readable.from(response.AudioStream);
      stream.pipe(res);
    }
  } catch (error) {
    console.error("AWS Polly Error:", error);
    res.status(500).json({ error: "Text-to-Speech failed" });
  }
}
