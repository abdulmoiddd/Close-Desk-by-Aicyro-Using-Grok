import { ref, get } from "firebase/database";
import { db } from "../../lib/firebase"; // Adjust this relative path based on your folder structure

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  try {
    const loginRef = ref(db, "login");
    const snapshot = await get(loginRef);

    if (snapshot.exists()) {
      const users = snapshot.val();

      // Iterate through the "1", "2" keys to find a match
      const isValidUser = Object.values(users).some(
        (user) => user.name === username && user.password === password,
      );

      if (isValidUser) {
        return res.status(200).json({ success: true });
      } else {
        return res.status(401).json({ error: "Invalid credentials" });
      }
    } else {
      return res.status(500).json({ error: "Auth database not found" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
