"use client";
import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";

export default function FaceRecorder() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // For rendering to user
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null); // For recording

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const [isRecording, setIsRecording] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      ]);
      startVideo();
    };
    loadModels();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    });
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      if (
        videoRef.current &&
        canvasRef.current &&
        faceapi.nets.faceLandmark68Net.params
      ) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const offscreenCanvas = offscreenCanvasRef.current;

        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks();

        const displaySize = {
          width: video.videoWidth,
          height: video.videoHeight,
        };

        [canvas, offscreenCanvas].forEach((c) => {
          if (c) {
            c.width = displaySize.width;
            c.height = displaySize.height;
            const ctx = c.getContext("2d");
            if (ctx) {
              ctx.clearRect(0, 0, c.width, c.height);
              ctx.drawImage(video, 0, 0, c.width, c.height); // Draw video
              const resized = faceapi.resizeResults(detections, displaySize);
              faceapi.draw.drawFaceLandmarks(c, resized); // Draw dots
            }
          }
        });
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const startRecording = () => {
    const canvas = offscreenCanvasRef.current;
    if (!canvas) return;

    const stream = canvas.captureStream();
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    recordedChunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        recordedChunksRef.current.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, {
        type: "video/webm",
      });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);

      // Optional: store as base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        localStorage.setItem("face-recorded-video", base64data);
      };
      reader.readAsDataURL(blob);
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Hidden video and offscreen canvas */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="hidden"
        width={640}
        height={480}
      />
      <canvas
        ref={offscreenCanvasRef}
        className="hidden"
        width={640}
        height={480}
      />

      {/* Display canvas with face tracking */}
      <canvas
        ref={canvasRef}
        className="rounded-xl"
        width={640}
        height={480}
      />

      <div className="flex gap-4 mt-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="px-4 py-2 bg-green-600 text-white rounded-lg cursor-pointer"
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Stop Recording
          </button>
        )}
        {downloadUrl && (
          <a
            href={downloadUrl}
            download="face-recording.webm"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Download Video
          </a>
        )}
      </div>
    </div>
  );
}
