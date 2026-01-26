import Image from "next/image";
import { Github, Linkedin, Mail, MapPin } from "lucide-react";
import SearchGrid from "./components/SearchGrid";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 font-sans">
      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center py-20 px-6 sm:py-32">
        {/* Profile Image */}
        <div className="relative mb-8">
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-zinc-200 dark:border-zinc-800">
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
          <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
            Serlis Maldonado
          </h1>

          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-2">
            Full Stack Developer & System Architect
          </p>

          <div className="flex items-center justify-center gap-2 text-zinc-500 dark:text-zinc-500 mb-6">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">El Progreso, Yoro, Honduras</span>
          </div>

          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-8">
            Desarrollador Full Stack con experiencia en JavaScript/TypeScript,
            React, Node.js y arquitecturas de sistemas. Enfocado en crear
            soluciones escalables y automatizaciones que impulsan negocios.
            Apasionado por la tecnología y el desarrollo de software de calidad.
          </p>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-4">
            <a
              href="https://github.com/serlismaldonado"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com/in/serlismaldonado"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="mailto:serlismaldonado@email.com"
              className="p-3 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </main>

      <SearchGrid />
    </div>
  );
}
