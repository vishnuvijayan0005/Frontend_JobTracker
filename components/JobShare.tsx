"use client";

import {
  FacebookShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  EmailShareButton,
  FacebookIcon,
  WhatsappIcon,
  TelegramIcon,
  EmailIcon,
} from "react-share";

import { useEffect, useState } from "react";
import { Link2 } from "lucide-react";

interface JobShareProps {
  title: string;
  company: string;
}

export default function JobShare({ title, company }: JobShareProps) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
         const id = window.location.pathname.split("/").pop();
    setUrl(`${window.location.origin}/nonuser/onejob/${id}`);
    }
  }, []);

  if (!url) return null;

  const shareTitle = `${title} at ${company}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold mb-3">Share this job</h3>

      <div className="flex items-center gap-3 flex-wrap">
        <FacebookShareButton url={url} title={shareTitle}>
          <FacebookIcon size={40} round />
        </FacebookShareButton>

        <WhatsappShareButton
          url={url}
          title={shareTitle}
          separator=" - "
        >
          <WhatsappIcon size={40} round />
        </WhatsappShareButton>

        <TelegramShareButton
          url={url}
          title={shareTitle}
        >
          <TelegramIcon size={40} round />
        </TelegramShareButton>

        <EmailShareButton
          url={url}
          subject={shareTitle}
          body={`Check out this job: ${url}`}
        >
          <EmailIcon size={40} round />
        </EmailShareButton>

        {/* Copy Link Button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 h-10 rounded-full bg-gray-200 hover:bg-gray-300 transition text-sm font-medium"
        >
          <Link2 size={16} />
          {copied ? "Copied!" : "Copy Link"}
        </button>
      </div>
    </div>
  );
}
