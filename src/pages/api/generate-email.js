// src/pages/api/generate-email.js
import { withApiLogger } from "../../lib/apiMiddleware";
import { executeIntegrationWithTrace } from "../../lib/integrationTracer";

async function handler(req, res, apiLogger) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { name, business_type, time } = req.body;
  
  const WEBHOOK_URL = process.env.MAKE_COM_EMAIL_WEBHOOK_URL;
  const SECRET_TOKEN = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_URL) {
    return res.status(500).json({ error: "Email Integration not configured" });
  }

  // 1. Define the Integration parameters
  const integrationConfig = {
    integration_name: "Make.com_Email_Automation",
    operation: "Trigger_Confirmation_Email",
    retryOptions: { maxAttempts: 3, delayMs: 2000 } // Will try up to 3 times if Make.com drops it
  };

  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SECRET_TOKEN}` // The tracer will automatically hide this in logs!
    },
    body: JSON.stringify({ name, business_type, time })
  };

  try {
    // 2. Execute the third-party call through the Tracer
    const result = await executeIntegrationWithTrace(
      apiLogger, 
      integrationConfig, 
      WEBHOOK_URL, 
      fetchOptions
    );

    // If we make it here, the webhook succeeded (even if it took 2 retries to do it!)
    return res.status(200).json({ 
      success: true, 
      messageId: result.id || "webhook_accepted",
      subject: result.generated_subject,
      body: result.generated_body
    });

  } catch (error) {
    // We don't need to apiLogger.error() here, because executeIntegrationWithTrace
    // already logged the exact external failure perfectly!
    return res.status(502).json({ error: "Failed to dispatch email via external provider." });
  }
}

export default withApiLogger(handler, "Generate-Email-API");