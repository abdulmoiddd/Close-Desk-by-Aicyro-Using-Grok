// src/pages/api/auth/microsoft/login.js
export default function handler(req, res) {
    const clientId = process.env.MICROSOFT_CLIENT_ID;
    const redirectUri = encodeURIComponent(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/microsoft/callback`
    );
  
    // 🔥 Swapped User.Read for openid email. Restored the outlook.office URL.
    const scopes = encodeURIComponent(
      "openid email offline_access https://outlook.office.com/SMTP.Send"
    );
  
    const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&response_mode=query&scope=${scopes}&prompt=consent`;
  
    res.redirect(authUrl);
  }