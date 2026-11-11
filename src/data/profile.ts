// Contenido del perfil / CV. Editar aquí para actualizar /profile.
export const profile = {
  name: "Serlis Maldonado",
  title: "Ingeniero en Sistemas Computacionales · Fundador de Heskala",
  summary:
    "Desarrollo software, automatizaciones e integraciones de inteligencia artificial para empresas. Más de cinco años creando sistemas que ordenan operaciones y ahorran trabajo repetitivo, además de proyectos de diseño y cine documental.",
  email: "serlismaldonado@heskala.com",
  linkedin: "https://www.linkedin.com/in/serlis-maldonado-30316310b/",
  github: "https://github.com/serlismaldonado",
  facts: [
    ["Ubicación", "El Progreso, Yoro, Honduras"],
    ["Experiencia", "5+ años"],
    ["Proyectos", "20+"],
    ["Enfoque", "Software, IA y automatización"],
  ] as [string, string][],
};

export const focus = [
  {
    name: "Heskala",
    role: "Propietario y Lead Developer",
    description:
      "Empresa de software especializada en automatizaciones empresariales, sistemas de operaciones (ERP) e integración de inteligencia artificial.",
    tags: ["Automatización", "ERP", "IA", "n8n", "Software a medida"],
    url: "https://erp.heskala.com",
  },
  {
    name: "Capacitaciones y formación",
    role: "Instructor y consultor",
    description:
      "Capacitaciones en herramientas digitales, IA aplicada a negocios y automatización de procesos, para equipos que quieren adoptar tecnología sin complicarse.",
    tags: ["IA para negocios", "Automatización", "Notion", "Productividad"],
  },
];

export const experience = [
  {
    period: "2020 — Hoy",
    title: "Propietario y Lead Developer",
    company: "Heskala",
    description:
      "Automatizaciones empresariales, desarrollo de sistemas de operaciones e integración de IA.",
    skills: ["TypeScript", "Convex", "React", "n8n", "IA"],
  },
  {
    period: "2021 — Hoy",
    title: "Desarrollador web",
    company: "Independiente",
    description: "Aplicaciones web modernas que resuelven problemas concretos de negocio.",
    skills: ["React", "Next.js", "Astro", "TypeScript"],
  },
  {
    period: "2021 — 2024",
    title: "Profesor de Informática",
    company: "Instituto Notre Dame",
    description: "Diseño web, programación y laboratorio de informática.",
    skills: ["HTML", "JavaScript", "Educación"],
  },
  {
    period: "2019 — 2022",
    title: "Diseñador web y marketing",
    company: "Heskala / ESS Company",
    description: "Diseño web, Facebook Ads, community management y estrategia de contenido.",
    skills: ["Diseño web", "Marketing digital", "Ads"],
  },
  {
    period: "2017 — 2018",
    title: "Profesor de Robótica",
    company: "Luis Landa American School",
    description: "Robótica e informática para estudiantes de 4 a 17 años.",
    skills: ["Robótica", "Programación", "Educación"],
  },
];

export const skills = [
  { category: "Desarrollo", items: ["TypeScript", "React", "Astro", "Next.js", "Convex", "Prisma"] },
  { category: "Automatización", items: ["n8n", "Workflows", "APIs", "Integración de sistemas"] },
  { category: "IA aplicada", items: ["Agentes", "Generación de contenido", "Procesamiento de datos", "Pipelines de IA"] },
  { category: "Diseño", items: ["Arquitectura de software", "Bases de datos", "UX/UI", "Branding"] },
];

export const education = [
  {
    degree: "Ingeniería en Sistemas Computacionales",
    school: "UNAH-VS · Universidad Nacional Autónoma de Honduras, Valle de Sula",
  },
];
