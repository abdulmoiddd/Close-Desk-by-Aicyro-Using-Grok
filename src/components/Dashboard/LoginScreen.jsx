"use client";

import { useState } from "react";
import { ref, get } from "firebase/database";
import { db } from "../../lib/firebase"; // Adjust the path to your firebase config if needed

export default function LoginScreen({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 1. Fetch the "login" array from your Firebase database
      const loginRef = ref(db, "login");
      const snapshot = await get(loginRef);

      if (snapshot.exists()) {
        const loginData = snapshot.val();

        // 2. Search the array for a matching username and password
        // We check "user &&" because your array has a null at index 0
        const matchedUser = loginData.find(
          (user) =>
            user && user.name === username && user.password === password,
        );

        if (matchedUser) {
          // 3. SUCCESS: Save the username so Appearance.jsx and lg.jsx know who is active
          localStorage.setItem("currentUser", matchedUser.name);

          // 4. Trigger the dashboard to load
          onLoginSuccess();
        } else {
          setError("Invalid username or password.");
        }
      } else {
        setError("Error connecting to the authentication server.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("A network error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4 font-sans text-[var(--foreground)] relative overflow-hidden">
      {/* Ambient Background Glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[50vw] h-[50vw] bg-[var(--primary)] opacity-10 blur-[120px] rounded-full mix-blend-screen"></div>
      </div>

      <div className="w-full max-w-md bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10">
        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white shadow-[0_0_20px_var(--lead-glow)] mb-4">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--foreground)]">
            Aicyro Pulse
          </h1>
          <p className="text-[var(--foreground-muted)] text-sm mt-1 font-medium">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="block text-xs font-bold text-[var(--foreground-muted)] uppercase tracking-wider mb-2"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[var(--background)] border border-[var(--border-color)] text-[var(--foreground)] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-all font-medium"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-bold text-[var(--foreground-muted)] uppercase tracking-wider mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[var(--background)] border border-[var(--border-color)] text-[var(--foreground)] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-all font-medium"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Error Message Display */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold px-4 py-3 rounded-xl text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[var(--primary)] text-white font-bold py-3.5 rounded-xl shadow-[0_4px_15px_var(--lead-glow)] hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg
                  className="w-5 h-5 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Authenticating...
              </>
            ) : (
              "Secure Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
