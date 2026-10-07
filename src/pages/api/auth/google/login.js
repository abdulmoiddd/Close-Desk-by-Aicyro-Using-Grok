// src/pages/api/auth/google/login.js
export default function handler(req, res) {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = encodeURIComponent(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/google/callback`
    );
  
    const scope = encodeURIComponent(
      "https://mail.google.com/ https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile"
    );
  
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
  
    res.redirect(authUrl);
  }