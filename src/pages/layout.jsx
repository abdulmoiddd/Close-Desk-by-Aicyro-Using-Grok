import { useRouter } from "next/router";
import AicyroChatbot from "@/components/Chatbot/AicyroChatbot";

export default function RootLayout({ children }) {
  const router = useRouter();

  // Check if the current page is the admin dashboard (/lg)
  const isDashboard = router.pathname === "/lg";

  return (
    <div>
      <main>
        {children}

        {/* Only render the chatbot if we are NOT on the dashboard */}
        {!isDashboard && <AicyroChatbot />}
      </main>
    </div>
  );
}
