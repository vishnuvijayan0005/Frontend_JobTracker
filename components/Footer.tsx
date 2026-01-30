import { Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-blue-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-6 md:flex md:justify-between md:items-center">
        {/* Left: Branding */}
        <div className="mb-4 md:mb-0">
          <h2 className="text-lg font-bold text-gray-900">JobTracker</h2>
          <p className="text-sm text-gray-500 mt-1">
            Find jobs, manage applications, and track company postings.
          </p>
        </div>

        {/* Center: Links */}
        <div className="flex flex-wrap gap-4 mb-4 md:mb-0">
          <a href="/about" className="text-sm text-gray-600 hover:text-sky-600 transition">
            About
          </a>
          <a href="/contact" className="text-sm text-gray-600 hover:text-sky-600 transition">
            Contact
          </a>
          <a href="/terms" className="text-sm text-gray-600 hover:text-sky-600 transition">
            Terms
          </a>
          <a href="/privacy" className="text-sm text-gray-600 hover:text-sky-600 transition">
            Privacy
          </a>
        </div>

       
       
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-200">
        <p className="text-xs text-gray-400 text-center py-3">
          &copy; {new Date().getFullYear()} JobTracker. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
