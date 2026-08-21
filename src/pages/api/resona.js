export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const apiKey =
      process.env.NEXT_PUBLIC_RESONANCE_API_KEY || process.env.RESONA_API_KEY;
    const agentId = process.env.RESONA_AGENT_ID;

    if (!apiKey || !agentId) {
      console.error(
        "Missing Resona Credentials. Check your .env.local for API Key and Agent ID.",
      );
      return res.status(400).json({
        error: "Missing API Key or Agent ID in environment variables.",
      });
    }

    // The verified correct endpoint for Resona sessions
    const response = await fetch("https://resona.dev/api/v1/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        agent_id: agentId,
        transport: "webrtc",
        codec: "pcm16",
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[Resona API Error] Status: ${response.status} -`, errText);
      return res.status(response.status).json({ error: errText });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ error: "Failed to create voice session" });
  }
}
