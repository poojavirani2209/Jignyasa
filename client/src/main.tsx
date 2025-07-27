import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { EmotionTrackingProvider } from "./context/EmotionTracking.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <EmotionTrackingProvider>
      <App />
    </EmotionTrackingProvider>
  </StrictMode>
);
