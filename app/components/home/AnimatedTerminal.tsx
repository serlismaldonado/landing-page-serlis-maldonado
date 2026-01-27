"use client";

import { useEffect, useState } from "react";

export default function TerminalAnimated() {
  const words = ["Automatizaciones", "AI", "Aplicaciones", "Tools"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    const currentWord = words[currentWordIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing mode
        if (currentText.length < currentWord.length) {
          setCurrentText(currentWord.substring(0, currentText.length + 1));
          setTypingSpeed(100);
        } else {
          // Word completed, wait then start deleting
          setTimeout(() => setIsDeleting(true), 1500);
          setTypingSpeed(100);
        }
      } else {
        // Deleting mode
        if (currentText.length > 0) {
          setCurrentText(currentWord.substring(0, currentText.length - 1));
          setTypingSpeed(50);
        } else {
          // Word deleted, move to next word
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
          setTypingSpeed(500);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, typingSpeed, words]);

  const asciiArt = `██  ██  ░░

██  ░░  ░░

░░  ░░  ░░`;

  return (
    <div className="max-w-2xl mb-8">
      <div className="font-mono text-sm sm:text-base text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-950 rounded-lg px-4 py-4 border border-zinc-200 dark:border-zinc-800">
        {/* Terminal Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-zinc-500 dark:text-zinc-500 text-sm">
            serlis@heskala: ~/software
          </span>
        </div>

        {/* Terminal Content - Left Aligned */}
        <div className="space-y-4">
          {/* ASCII Art Command */}
          <div className="flex justify-center p-4">
            <div className="font-mono text-xs text-green-600 dark:text-green-500 whitespace-pre leading-tight text-center">
              {asciiArt}
            </div>
          </div>

          <div className="text-zinc-400 dark:text-zinc-600 text-xs overflow-hidden">
            <div className="border-t border-dashed border-zinc-400 dark:border-zinc-600 w-full max-w-2xl mx-auto"></div>
          </div>

          {/* Main Services Command */}

          {/* Skills Animation */}
          <div>
            <span className="text-green-600 dark:text-green-500">$</span>
            <span className="text-zinc-600 dark:text-zinc-400"> cat </span>
            <span className="text-green-600 dark:text-green-500">
              services.txt
            </span>
            <span className="text-zinc-600 dark:text-zinc-400"> | grep </span>
            <span className="text-green-600 dark:text-green-500">
              {currentText}
            </span>
            <span className="inline-block w-2 h-1 ml-1 bg-green-600 dark:bg-green-500 animate-pulse"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
