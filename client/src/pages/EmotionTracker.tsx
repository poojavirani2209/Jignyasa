import React, { useEffect, useRef, useState } from "react";
import api from "../services/api";
import type { ContentType } from "./GoalSession";

export interface EmotionTrackerProps {
  goalId: string;
  subTopicName: string;
  contentType: ContentType;
  intervalMs?: number;
}

const EmotionTracker: React.FC<EmotionTrackerProps> = ({
  goalId,
  subTopicName,
  contentType,
  intervalMs = 5000,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const startTracking = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        intervalRef.current = setInterval(() => {
          captureScreenshot();
        }, intervalMs) as any;
      } catch (err) {
        console.warn("Webcam access denied:", err);
      }
    };

    const captureScreenshot = async () => {
      const video = videoRef.current;
      if (!video || !video.videoWidth || !video.videoHeight) return;

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg")
      );
      if (!blob) return;

      const formData = new FormData();
      formData.append("screenshot", blob, `screenshot-${Date.now()}.jpg`);
      formData.append("goalId", goalId);
      formData.append("subTopicName", subTopicName);
      formData.append("contentType", contentType);
      formData.append("timestamp", new Date().toISOString());

      try {
        await api.post("/log/emotion", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setToastMessage("Screenshot captured and sent for analysis!");
        setTimeout(() => setToastMessage(null), 2000);
      } catch (err) {
        console.error("Failed to send screenshot:", err);
      }
    };

    startTracking();

    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [goalId, subTopicName, contentType, intervalMs]);

  return (
    <div>
      {/* Video Preview */}
      <video
        ref={videoRef}
        className="bottom-4 w-[200px] left-4 z-5 bg-red-200 border-2"
        autoPlay
        muted
        playsInline
      />
      {/* Toast Notification */}
      {toastMessage && (
        <div className="mt-2 bg-black text-white px-3 py-1 rounded shadow-lg text-sm">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default EmotionTracker;
