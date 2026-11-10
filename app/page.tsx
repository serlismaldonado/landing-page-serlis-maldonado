export const dynamic = "force-dynamic";

import SearchGrid from "./components/SearchGrid";
import ContributionGraph from "./components/ContributionGraph";
import ContactLinks from "./components/home/ContactLinks";
import Hero from "./components/home/Hero";
import { BlogSection } from "./components/home/BlogSection";

export default function Home() {
  return (
    <div className="bg-zinc-950 font-sans">
      <Hero />

      <div>

      {/* Projects Section */}
      <div className="py-16 px-6 bg-gradient-to-b from-zinc-950/40 to-zinc-950/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-mono text-xl sm:text-2xl text-zinc-900 dark:text-white mb-4">
              Proyectos
            </h2>
            <p className="font-mono text-sm text-zinc-500 max-w-2xl mx-auto">
              Explora mis proyectos y contribuciones técnicas
            </p>
          </div>
          <SearchGrid />
        </div>
      </div>

      {/* Blog Section */}
      <BlogSection />

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
