import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { LangProvider } from "@/lib/i18n";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LangProvider>
      <App />
    </LangProvider>
  </React.StrictMode>,
);

// Register service worker for PWA / offline core shell
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* noop */
    });
  });
}
