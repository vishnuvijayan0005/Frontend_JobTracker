"use client";

import { useEffect, useState } from "react";

interface SmallAutoBannerProps {
  images: string[];
  interval?: number;
}

export default function SmallAutoBanner({
  images,
  interval = 3500,
}: SmallAutoBannerProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // ✅ Prevent crash if images empty
  if (!images || images.length === 0) return null;

  useEffect(() => {
    if (paused) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [paused, images.length, interval]);

  return (
    <div
      className="w-full flex justify-center my-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative w-full max-w-[900px] overflow-hidden rounded-xl shadow-md bg-black/5">
        {/* Slides */}
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Promotional banner ${i + 1}`}
              draggable={false}
              className="w-full flex-shrink-0 object-cover"
              style={{ aspectRatio: "900 / 300" }}
            />
          ))}
        </div>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                i === index ? "bg-white scale-110" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
