import { useRouter } from "next/router";
import AicyroChatbot from "@/components/Chatbot/AicyroChatbot";

export default function RootLayout({ children }) {
  const router = useRouter();

  // Check if the current page is the admin dashboard (/lg) or the logs page (/logs)
  const isDashboard = router.pathname === "/lg";
  const isLogsPage = router.pathname === "/logs";

  // Hide the chatbot if on the dashboard OR the logs page
  const showChatbot = !isDashboard && !isLogsPage;

  return (
    <div>
      <main>
        {children}

        {/* Only render the chatbot on public/allowed pages */}
        {showChatbot && <AicyroChatbot />}
      </main>
    </div>
  );
}
