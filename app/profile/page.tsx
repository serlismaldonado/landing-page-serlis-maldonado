"use client";

import {
  Briefcase,
  GraduationCap,
  Code,
  Cpu,
  Zap,
  Building2,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

const experiences = [
  {
    title: "Propietario & Lead Developer",
    company: "Heskala",
    type: "Empresa propia",
    period: "2020 - Presente",
    description:
      "Empresa de software especializada en automatizaciones empresariales, desarrollo de sistemas de operaciones e integración de IA.",
    skills: ["n8n", "TypeScript", "Convex", "React", "IA"],
    current: true,
  },
  {
    title: "Desarrollador Web",
    company: "Profesional Independiente",
    type: "Freelance",
    period: "2021 - Presente",
    description:
      "Desarrollo de proyectos que resuelven problemas esenciales para empresas. Enfoque en aplicaciones web modernas.",
    skills: ["React.js", "Next.js", "TypeScript"],
    current: true,
  },
  {
    title: "Profesor de Informática",
    company: "Instituto Notre Dame",
    type: "Jornada parcial",
    period: "2021 - Presente",
    description:
      "Enseñanza de Diseño Web, Programación y Laboratorio de Informática.",
    skills: ["HTML5", "JavaScript", "Educación"],
    current: true,
  },
  {
    title: "Diseñador Web & Marketing",
    company: "Heskala / ESS Company",
    type: "Profesional",
    period: "2019 - 2022",
    description:
      "Diseño web, Facebook Ads, Community Management y estrategia de contenido para redes sociales.",
    skills: ["Diseño Web", "Marketing Digital", "Ads"],
    current: false,
  },
  {
    title: "Profesor de Robótica",
    company: "Luis Landa American School",
    type: "Jornada completa",
    period: "2017 - 2018",
    description: "Enseñanza de Robótica e Informática a estudiantes de 4-17 años.",
    skills: ["Robótica", "Educación", "Programación"],
    current: false,
  },
];

const skills = [
  { category: "Automatización", items: ["n8n", "Workflows", "APIs", "Integración de sistemas"] },
  { category: "Desarrollo", items: ["TypeScript", "React", "Next.js", "Convex", "Prisma"] },
  { category: "IA Aplicada", items: ["Generación de contenido", "Procesamiento de datos", "Pipelines de IA"] },
  { category: "Diseño", items: ["Arquitectura de software", "Bases de datos", "UX/UI"] },
];

export default function ProfilePage() {
  return (
    <div className="min-h-[100dvh] bg-white dark:bg-zinc-950 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-500 transition-colors font-mono text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>cd ..</span>
          </Link>
          <span className="font-mono text-xs text-zinc-400 dark:text-zinc-600">
            ~/profile/serlis.md
          </span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8">
            {/* Terminal Header */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-zinc-500 dark:text-zinc-500 text-sm font-mono">
                whoami
              </span>
            </div>

            {/* Profile Info */}
            <div className="space-y-4">
              <div className="font-mono">
                <span className="text-green-600 dark:text-green-500">$</span>
                <span className="text-zinc-600 dark:text-zinc-400"> cat </span>
                <span className="text-green-600 dark:text-green-500">profile.json</span>
              </div>

              <div className="font-mono text-sm sm:text-base pl-4 border-l-2 border-green-600/30 dark:border-green-500/30">
                <p className="text-zinc-900 dark:text-white text-xl sm:text-2xl font-semibold mb-2">
                  Serlis Maldonado
                </p>
                <p className="text-green-600 dark:text-green-500 mb-4">
                  Ing. en Sistemas Computacionales | UNAH-VS
                </p>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Automation Specialist & Systems Designer con enfoque en desarrollo de software,
                  automatizaciones empresariales e integración de IA. +5 años creando soluciones
                  tecnológicas que optimizan operaciones.
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                <div className="text-center p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800/50">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-500">5+</div>
                  <div className="text-xs text-zinc-500 font-mono">years_exp</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800/50">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-500">20+</div>
                  <div className="text-xs text-zinc-500 font-mono">projects</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800/50">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-500">IA</div>
                  <div className="text-xs text-zinc-500 font-mono">specialist</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800/50">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-500">n8n</div>
                  <div className="text-xs text-zinc-500 font-mono">automation</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Current Focus */}
      <section className="py-12 px-6 bg-zinc-50 dark:bg-zinc-900/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-mono text-lg sm:text-xl text-zinc-900 dark:text-white mb-2">
              <span className="text-green-600 dark:text-green-500">$</span> cat current_focus.txt
            </h2>
          </div>

          <div className="bg-white dark:bg-zinc-900/50 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                <Building2 className="w-6 h-6 text-green-600 dark:text-green-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-zinc-900 dark:text-white mb-1">
                  Heskala
                </h3>
                <p className="text-sm text-green-600 dark:text-green-500 font-mono mb-3">
                  Propietario & Lead Developer
                </p>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  Empresa de software especializada en automatizaciones empresariales,
                  desarrollo de sistemas de operaciones, e integración de inteligencia artificial.
                  Creamos soluciones que optimizan procesos y transforman la manera en que las
                  empresas operan.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {["Automatización", "ERP", "IA", "n8n", "Software a medida"].map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs font-mono rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-mono text-lg sm:text-xl text-zinc-900 dark:text-white mb-2">
              <span className="text-green-600 dark:text-green-500">$</span> git log --experience
            </h2>
            <p className="font-mono text-sm text-zinc-500">Trayectoria profesional</p>
          </div>

          <div className="space-y-4">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className={`relative pl-6 pb-6 border-l-2 ${
                  exp.current
                    ? "border-green-600/50 dark:border-green-500/50"
                    : "border-zinc-200 dark:border-zinc-800"
                }`}
              >
                {/* Timeline dot */}
                <div
                  className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${
                    exp.current
                      ? "bg-green-600 dark:bg-green-500 border-white dark:border-zinc-950"
                      : "bg-zinc-300 dark:bg-zinc-700 border-white dark:border-zinc-950"
                  }`}
                />

                <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 ml-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                        {exp.title}
                        {exp.current && (
                          <span className="px-2 py-0.5 text-xs font-mono rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-500">
                            actual
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-zinc-500 font-mono">
                        {exp.company} · {exp.type}
                      </p>
                    </div>
                    <span className="text-xs font-mono text-zinc-400 whitespace-nowrap">
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                    {exp.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {exp.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 text-xs font-mono rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="py-12 px-6 bg-zinc-50 dark:bg-zinc-900/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-mono text-lg sm:text-xl text-zinc-900 dark:text-white mb-2">
              <span className="text-green-600 dark:text-green-500">$</span> ls skills/
            </h2>
            <p className="font-mono text-sm text-zinc-500">Stack tecnológico</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {skills.map((skillGroup) => (
              <div
                key={skillGroup.category}
                className="bg-white dark:bg-zinc-900/50 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  {skillGroup.category === "Automatización" && (
                    <Zap className="w-4 h-4 text-green-600 dark:text-green-500" />
                  )}
                  {skillGroup.category === "Desarrollo" && (
                    <Code className="w-4 h-4 text-green-600 dark:text-green-500" />
                  )}
                  {skillGroup.category === "IA Aplicada" && (
                    <Cpu className="w-4 h-4 text-green-600 dark:text-green-500" />
                  )}
                  {skillGroup.category === "Diseño" && (
                    <Briefcase className="w-4 h-4 text-green-600 dark:text-green-500" />
                  )}
                  <h3 className="font-mono text-sm font-semibold text-zinc-900 dark:text-white">
                    {skillGroup.category}/
                  </h3>
                </div>
                <div className="space-y-1">
                  {skillGroup.items.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 font-mono"
                    >
                      <ChevronRight className="w-3 h-3 text-green-600 dark:text-green-500" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-mono text-lg sm:text-xl text-zinc-900 dark:text-white mb-2">
              <span className="text-green-600 dark:text-green-500">$</span> cat education.txt
            </h2>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                <GraduationCap className="w-6 h-6 text-green-600 dark:text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-white">
                  Ingeniería en Sistemas Computacionales
                </h3>
                <p className="text-sm text-green-600 dark:text-green-500 font-mono">
                  UNAH-VS
                </p>
                <p className="text-sm text-zinc-500 mt-1">
                  Universidad Nacional Autónoma de Honduras - Valle de Sula
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-zinc-50 dark:bg-zinc-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <div className="font-mono text-sm text-zinc-500 mb-4">
            <span className="text-green-600 dark:text-green-500">$</span> ./contact --ready
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-white mb-4">
            Listo para colaborar
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6 max-w-md mx-auto">
            Si buscas automatizar procesos, desarrollar software o integrar IA en tu negocio,
            hablemos.
          </p>
          <Link
            href="mailto:serlismaldonado@heskala.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-mono text-sm rounded-lg transition-colors"
          >
            <span>npx contact serlis --now</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/"
            className="font-mono text-sm text-zinc-500 hover:text-green-600 dark:hover:text-green-500 transition-colors"
          >
            <span className="text-green-600 dark:text-green-500">$</span> cd ~/home
          </Link>
          <span className="font-mono text-xs text-zinc-400">
            El Progreso, Yoro, Honduras
          </span>
        </div>
      </footer>
    </div>
  );
}
