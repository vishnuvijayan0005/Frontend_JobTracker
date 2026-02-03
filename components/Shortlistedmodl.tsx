"use client";

import { X, Calendar, Clock, Video, MapPin } from "lucide-react";
import { useState } from "react";

interface ScheduleInterviewModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: {
    date: string;
    time: string;
    mode: "online" | "offline";
    location?: string;
    meetingLink?: string;
    notes?: string;
  }) => void;
  loading?: boolean;
}

export default function ScheduleInterviewModal({
  open,
  onClose,
  onConfirm,
  loading = false,
}: ScheduleInterviewModalProps) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [mode, setMode] = useState<"online" | "offline">("online");
  const [location, setLocation] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [notes, setNotes] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4">Schedule Interview</h2>

        <div className="space-y-4">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />

          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />

          <div className="flex gap-3">
            <button
              onClick={() => setMode("online")}
              className={`flex-1 px-4 py-2 rounded-lg border ${
                mode === "online" ? "bg-blue-600 text-white" : ""
              }`}
            >
              <Video size={16} className="inline mr-2" />
              Online
            </button>

            <button
              onClick={() => setMode("offline")}
              className={`flex-1 px-4 py-2 rounded-lg border ${
                mode === "offline" ? "bg-blue-600 text-white" : ""
              }`}
            >
              <MapPin size={16} className="inline mr-2" />
              Offline
            </button>
          </div>

          {mode === "online" && (
            <input
              type="url"
              placeholder="Meeting link"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          )}

          {mode === "offline" && (
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          )}

          <textarea
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={() =>
              onConfirm({
                date,
                time,
                mode,
                location: mode === "offline" ? location : undefined,
                meetingLink: mode === "online" ? meetingLink : undefined,
                notes,
              })
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
}
