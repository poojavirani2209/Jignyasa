import React, { createContext, useContext, useState, useEffect } from "react";

interface EmotionTrackingContextProps {
  isTracking: boolean;
  setIsTracking: (enabled: boolean) => void;
}

const EmotionTrackingContext = createContext<EmotionTrackingContextProps | null>(null);

export const EmotionTrackingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTracking, setIsTracking] = useState<boolean>(() => {
    const stored = localStorage.getItem("emotionTracking");
    return stored === "true";
  });

  useEffect(() => {
    localStorage.setItem("emotionTracking", String(isTracking));
  }, [isTracking]);

  return (
    <EmotionTrackingContext.Provider value={{ isTracking, setIsTracking }}>
      {children}
    </EmotionTrackingContext.Provider>
  );
};

export const useEmotionTracking = () => {
  const ctx = useContext(EmotionTrackingContext);
  if (!ctx) throw new Error("useEmotionTracking must be used inside EmotionTrackingProvider");
  return ctx;
};
