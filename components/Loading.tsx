"use client";
import React from "react";

interface LoadingProps {
  size?: number; // size in px
  color?: string; // Tailwind color, e.g., "sky-500"
  text?: string; // optional loading text
}

const Loading: React.FC<LoadingProps> = ({
  size = 16,
  color = "sky-500",
  text = "Loading...",
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div
        className={`border-4 border-${color} border-t-transparent border-b-transparent rounded-full animate-spin`}
        style={{ width: `${size}px`, height: `${size}px` }}
      ></div>
      {text && <p className="text-gray-600 text-lg animate-pulse">{text}</p>}
    </div>
  );
};

export default Loading;
