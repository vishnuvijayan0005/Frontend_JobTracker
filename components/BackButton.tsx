"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  label?: string;
}

export default function BackButton({ label = "Back" }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="
        group inline-flex items-center gap-2
        rounded-full px-3 py-1.5
        text-sm font-medium
        text-gray-700
        bg-white/60 backdrop-blur
        shadow-sm
        hover:bg-white hover:shadow-md
        transition-all duration-200
        active:scale-95
      "
    >
      <ArrowLeft
        size={16}
        className="
          text-gray-600
          transition-transform duration-200
          group-hover:-translate-x-1
        "
      />
      <span className="leading-none">{label}</span>
    </button>
  );
}
