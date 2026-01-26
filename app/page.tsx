import Image from "next/image";
import { Github, Linkedin, Mail, MapPin } from "lucide-react";
import SearchGrid from "./components/SearchGrid";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 font-sans">
      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center py-20 px-6 sm:py-24">
        {/* Profile Image */}
        <div className="relative mb-6">
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-zinc-200 dark:border-zinc-800">
            <Image
              src="/profile.jpg"
              alt="Serlis Maldonado"
              width={160}
              height={160}
              className="object-cover w-full h-full"
              priority
            />
          </div>
        </div>

        {/* Profile Info */}
        <div className="text-center max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white mb-2 font-mono">
            serlis Maldonado
          </h1>

          <p className="font-mono text-sm text-zinc-500 dark:text-zinc-400 mb-4">
            Full Stack Developer & System Architect
          </p>

          <div className="flex items-center justify-center gap-2 text-zinc-400 mb-6">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-xs font-mono">El Progreso, Yoro, Honduras</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-3">
            <a
              href="https://github.com/serlismaldonado"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com/in/serlismaldonado"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="mailto:serlismaldonado@email.com"
              className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
      </main>

      <SearchGrid />
    </div>
  );
}
