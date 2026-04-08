export const dynamic = "force-dynamic";

import SearchGrid from "./components/SearchGrid";
import ContributionGraph from "./components/ContributionGraph";
import CallToAction from "./components/home/CallToAction";
import TerminalAnimated from "./components/home/AnimatedTerminal";
import ContactLinks from "./components/home/ContactLinks";
import ProjectCoversBackground from "./components/home/ProjectCoversBackground";

export default function Home() {
  const chevronDown = `▼ ▼ ▼`;
  return (
    <div className="bg-zinc-950 font-sans">
      <div className="relative">
      {/* Hero Section */}
      <main className="relative flex flex-col lg:flex-row items-center justify-center min-h-[100dvh] px-6 gap-8 lg:gap-12 overflow-hidden">
        <ProjectCoversBackground />
        
        <div className="relative z-10">
          {/* Terminal Animation with integrated message */}
          <div className="w-full max-w-2xl lg:max-w-lg xl:max-w-xl">
            <TerminalAnimated />
          </div>

          {/* Call to Action */}
          <div className="w-full max-w-md lg:max-w-sm xl:max-w-md gap-2 flex flex-col">
            <div className="font-mono text-sm leading-tight whitespace-pre flex justify-center">
              {chevronDown}
            </div>
            <CallToAction />
          </div>
        </div>
      </main>
      </div>

      <div>

      {/* Projects Section */}
      <div className="py-16 px-6 bg-gradient-to-b from-zinc-950/40 to-zinc-950/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-mono text-xl sm:text-2xl text-zinc-900 dark:text-white mb-4">
              <span className="text-green-600 dark:text-green-500">$</span> ls
              -la proyectos/
            </h2>
            <p className="font-mono text-sm text-zinc-500 max-w-2xl mx-auto">
              Explora mis proyectos y contribuciones técnicas
            </p>
          </div>
          <SearchGrid />
        </div>
      </div>

      {/* Contributions Section */}
      <div className="py-16 px-6 bg-gradient-to-b from-zinc-900/30 to-zinc-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-mono text-xl sm:text-2xl text-zinc-900 dark:text-white mb-4">
              <span className="text-green-600 dark:text-green-500">$</span> git
              log --oneline
            </h2>
            <p className="font-mono text-sm text-zinc-500 max-w-2xl mx-auto">
              Mi actividad y contribuciones recientes
            </p>
          </div>
          <ContributionGraph />
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 px-6 bg-gradient-to-b from-zinc-950/30 to-zinc-950/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-mono text-xl sm:text-2xl text-zinc-900 dark:text-white mb-4">
              <span className="text-green-600 dark:text-green-500">$</span>{" "}
              ./connect.sh
            </h2>
            <p className="font-mono text-sm text-zinc-500 max-w-2xl mx-auto mb-8">
              Conéctate conmigo a través de estos canales
            </p>
            <ContactLinks />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
