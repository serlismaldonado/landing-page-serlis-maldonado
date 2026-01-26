import Image from "next/image";
import { Github, Linkedin, Mail, Settings, LogIn } from "lucide-react";
import SearchGrid from "./components/SearchGrid";
import ContributionGraph from "./components/ContributionGraph";

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

        {/* ASCII Art Style Title */}
        <div className="text-center max-w-2xl mb-6">
          <h1 className="font-mono text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight">
            serlis@dev:~${" "}
            <span className="text-blue-600 dark:text-blue-400">SM</span>
          </h1>
        </div>

        {/* Subtitle */}
        <div className="text-center max-w-lg mb-8">
          <p className="font-mono text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Gracias por visitar mi sitio web, si estás aquí es porque seguro
            necesitas ayuda con tech, AI, o Sistemas. Estás en el lugar
            correcto.
          </p>
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
          <a
            href="/admin"
            className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            title="Admin"
          >
            <Settings className="w-4 h-4" />
          </a>
          <a
            href="/login"
            className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            title="Login"
          >
            <LogIn className="w-4 h-4" />
          </a>
        </div>
      </main>

      <SearchGrid />
      <ContributionGraph />
    </div>
  );
}
