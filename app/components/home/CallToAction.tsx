"use client";

import { Send } from "lucide-react";

export default function CallToAction() {
  const handleEmailSubmit = () => {
    window.location.href = "mailto:serlismaldonado@heskala.com";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEmailSubmit();
    }
  };

  return (
    <div className="max-w-xs mx-auto mb-10">
      <p className="max-w-3xl mx-auto mb-3 font-mono text-xs text-zinc-400 uppercase tracking-wider text-center">
        Contact me in one command
      </p>
      <div
        className="relative group cursor-pointer"
        onClick={handleEmailSubmit}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
      >
        <div className="flex items-center gap-3 px-4 py-2.5 bg-black rounded-lg border border-green-700/30 hover:border-green-600/50 transition-all">
          <span className="font-mono text-sm">
            <span className="text-green-500">$</span>
            <span className="text-zinc-400"> npx </span>
            <span className="text-green-500">contact </span>
            <span className="text-green-500">serlis</span>
            <span className="text-zinc-400"> --now </span>
          </span>
          <div
            className="ml-auto p-1.5 text-zinc-400 hover:text-green-500 transition-colors"
            title="Send email"
          >
            <Send className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
