// src/pages/_app.jsx
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import "@/styles/globals.css";
import RootLayout from "./layout";
import ThemeProvider from "../components/ThemeProvider";
import CookieConsentBanner from "../components/Essential/CookieConsentBanner";
import { trackVisit } from "../lib/activityTracker";
import Popupform from "@/components/Form/PopupModel";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Track the landing page view exactly once
    if (router.isReady) {
      trackVisit(router.pathname);
    }

    // Track subsequent navigations
    const handleRouteChange = (url) => trackVisit(url);
    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.isReady, router.pathname]);

  return (
    <ThemeProvider>
      <RootLayout>
        <Component {...pageProps} />
        {/* <Popupform /> */}
        <CookieConsentBanner />
      </RootLayout>
    </ThemeProvider>
  );
}
