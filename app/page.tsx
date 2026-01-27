"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Github, Linkedin, Mail, Settings, LogIn, Send } from "lucide-react";
import SearchGrid from "./components/SearchGrid";
import ContributionGraph from "./components/ContributionGraph";

export default function Home() {
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

  const handleEmailSubmit = () => {
    window.location.href = "mailto:serlismaldonado@heskala.com";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEmailSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 font-sans">
      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center py-20 px-6 sm:py-24">
        {/* ASCII Art Style Title */}
        <div className="text-center max-w-2xl mb-4">
          <h1 className="font-mono text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight">
            serlis@dev:~${" "}
            <span className="text-green-600 dark:text-green-500">SM</span>
          </h1>
        </div>

        {/* Main Message - Increased prominence */}
        <div className="text-center max-w-2xl mb-6">
          <p className="font-mono text-base sm:text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed">
            <span className="text-green-600 dark:text-green-500">Programo</span>
            , <span className="text-green-600 dark:text-green-500">diseño</span>{" "}
            y{" "}
            <span className="text-green-600 dark:text-green-500">
              automatizo
            </span>{" "}
            soluciones de sistemas. Encárgate de lo demás (
            <span className="text-green-600 dark:text-green-500">
              de pagarme XD
            </span>
            ).
          </p>
        </div>

        {/* Animated Terminal Text - Reduced visual weight */}
        <div className="text-center max-w-lg mb-8">
          <div className="font-mono text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg px-3 py-2 inline-block border border-zinc-200 dark:border-zinc-800">
            <span className="text-green-600 dark:text-green-500">$</span>
            <span className="text-zinc-500 dark:text-zinc-500"> cat </span>
            <span className="text-green-600 dark:text-green-500">
              specialties.txt
            </span>
            <span className="text-zinc-500 dark:text-zinc-500"> | grep </span>
            <span className="text-green-600 dark:text-green-500">
              {currentText}
            </span>
            <span className="inline-block w-1 h-4 ml-1 bg-green-600 dark:bg-green-500 animate-pulse"></span>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <a
            href="https://github.com/serlismaldonado"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-green-600 dark:hover:text-green-500 transition-colors"
            title="GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="https://linkedin.com/in/serlismaldonado"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-green-600 dark:hover:text-green-500 transition-colors"
            title="LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href="mailto:serlismaldonado@email.com"
            className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-green-600 dark:hover:text-green-500 transition-colors"
            title="Email"
          >
            <Mail className="w-5 h-5" />
          </a>
          <a
            href="/admin"
            className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-green-600 dark:hover:text-green-500 transition-colors"
            title="Admin"
          >
            <Settings className="w-5 h-5" />
          </a>
          <a
            href="/login"
            className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-green-600 dark:hover:text-green-500 transition-colors"
            title="Login"
          >
            <LogIn className="w-5 h-5" />
          </a>
        </div>

        <p className="max-w-3xl mx-auto mb-3 font-mono text-xs text-zinc-400 uppercase tracking-wider text-center">
          Contact me in one command
        </p>

        {/* Email Input */}
        <div className="max-w-xs mx-auto mb-10">
          <div className="relative group">
            <div className="flex items-center gap-3 px-4 py-2.5 bg-zinc-100 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
              <span className="font-mono text-sm">
                <span className="text-green-600 dark:text-green-500">$</span>
                <span className="text-zinc-600 dark:text-zinc-400"> npx </span>
                <span className="text-green-600 dark:text-green-500">
                  contact{" "}
                </span>
                <span className="text-green-600 dark:text-green-500">
                  serlis
                </span>
                <span className="text-zinc-600 dark:text-zinc-400">
                  {" "}
                  --now{" "}
                </span>
              </span>
              <button
                onClick={handleEmailSubmit}
                className="ml-auto p-1.5 text-zinc-400 hover:text-green-600 dark:hover:text-green-500 transition-colors"
                title="Send email"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-2 font-mono text-xs text-zinc-400 text-center">
              Press Enter or click the send icon to open your email client
            </div>
          </div>
        </div>
      </main>

      <SearchGrid />
      <ContributionGraph />
    </div>
  );
}
