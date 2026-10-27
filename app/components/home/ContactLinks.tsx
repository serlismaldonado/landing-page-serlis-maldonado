"use client";

import { Github, Linkedin, LogIn, Mail, Settings, User } from "lucide-react";

export default function ContactLinks() {
  return (
    <div className="flex items-center justify-center gap-4 mt-4">
      <a
        href="/profile"
        className="p-3 rounded-lg bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-green-500 transition-colors"
        title="Perfil"
      >
        <User className="w-5 h-5" />
      </a>
      <a
        href="https://github.com/serlismaldonado"
        target="_blank"
        rel="noopener noreferrer"
        className="p-3 rounded-lg bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-green-500 transition-colors"
        title="GitHub"
      >
        <Github className="w-5 h-5" />
      </a>
      <a
        href="https://www.linkedin.com/in/serlis-maldonado-30316310b/"
        target="_blank"
        rel="noopener noreferrer"
        className="p-3 rounded-lg bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-green-500 transition-colors"
        title="LinkedIn"
      >
        <Linkedin className="w-5 h-5" />
      </a>
      <a
        href="mailto:serlismaldonado@email.com"
        className="p-3 rounded-lg bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-green-500 transition-colors"
        title="Email"
      >
        <Mail className="w-5 h-5" />
      </a>
      <a
        href="/admin"
        className="p-3 rounded-lg bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-green-500 transition-colors"
        title="Admin"
      >
        <Settings className="w-5 h-5" />
      </a>
      <a
        href="/login"
        className="p-3 rounded-lg bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-green-500 transition-colors"
        title="Login"
      >
        <LogIn className="w-5 h-5" />
      </a>
    </div>
  );
}
