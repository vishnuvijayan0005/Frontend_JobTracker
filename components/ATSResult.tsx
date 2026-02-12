"use client";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ATSResultProps {
  score: number;
  breakdown: {
    keywordMatch: number;
    skillsAlignment: number;
    experienceMatch: number;
    formatting: number;
  };
  missingKeywords: string[];
  improvements: string[];
}

export default function ATSResult({
  score,
  breakdown,
  missingKeywords,
  improvements,
}: ATSResultProps) {
  const [open, setOpen] = useState(false);

  const scoreColor =
    score < 50 ? "#ef4444" : score < 75 ? "#f59e0b" : "#22c55e";

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-8">

      {/* 🎯 SCORE CARD */}
      <div className="bg-white shadow-lg rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8">
        <div className="w-40 h-40">
          <CircularProgressbar
            value={score}
            text={`${score}%`}
            styles={buildStyles({
              pathColor: scoreColor,
              textColor: "#111827",
              trailColor: "#e5e7eb",
            })}
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-2">ATS Compatibility Score</h2>
          <p className="text-gray-600">
            {score < 50
              ? "Your resume needs significant improvement."
              : score < 75
              ? "Your resume is good but can be optimized."
              : "Excellent! Your resume is highly optimized."}
          </p>
        </div>
      </div>

      {/* 📊 BREAKDOWN */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Score Breakdown</h3>

        <div className="space-y-3">
          {Object.entries(breakdown).map(([key, value]) => (
            <div key={key}>
              <div className="flex justify-between text-sm mb-1 capitalize">
                <span>{key.replace(/([A-Z])/g, " $1")}</span>
                <span>{value}%</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div
                  className="bg-black h-2 rounded-full"
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔍 MISSING KEYWORDS */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Missing Keywords</h3>

        <div className="flex flex-wrap gap-2">
          {missingKeywords.length === 0 ? (
            <p className="text-green-600 text-sm">
              Great! No major keywords missing.
            </p>
          ) : (
            missingKeywords.map((keyword, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-full"
              >
                {keyword}
              </span>
            ))
          )}
        </div>
      </div>

      {/* ✍ IMPROVEMENTS (Accordion) */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center justify-between w-full"
        >
          <h3 className="text-lg font-semibold">Suggested Improvements</h3>
          {open ? <ChevronUp /> : <ChevronDown />}
        </button>

        {open && (
          <ul className="mt-4 space-y-2 text-gray-700 text-sm">
            {improvements.map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        )}
      </div>

      {/* 🚀 PREMIUM CTA */}
      <div className="bg-black text-white rounded-2xl p-6 flex justify-between items-center">
        <div>
          <h4 className="font-semibold text-lg">
            Want a tailored resume for this job?
          </h4>
          <p className="text-sm text-gray-300">
            Unlock AI-powered resume rewriting and optimization.
          </p>
        </div>

        <button className="bg-white text-black px-5 py-2 rounded-lg font-medium">
          Upgrade to Pro
        </button>
      </div>
    </div>
  );
}
