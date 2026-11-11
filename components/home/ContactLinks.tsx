import { Github, Linkedin, Mail, User } from "lucide-react";

// compact: iconos pequeños para el pie de la home.
export default function ContactLinks({ compact = false }: { compact?: boolean }) {
  const link = compact
    ? "p-2 rounded-md text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
    : "p-3 rounded-lg bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-green-500 transition-colors";
  const icon = compact ? "w-4 h-4" : "w-5 h-5";
  return (
    <div className={compact ? "flex items-center gap-1" : "flex items-center justify-center gap-4 mt-4"}>
      <a
        href="/profile"
        className={link}
        title="Perfil"
      >
        <User className={icon} />
      </a>
      <a
        href="https://github.com/serlismaldonado"
        target="_blank"
        rel="noopener noreferrer"
        className={link}
        title="GitHub"
      >
        <Github className={icon} />
      </a>
      <a
        href="https://www.linkedin.com/in/serlis-maldonado-30316310b/"
        target="_blank"
        rel="noopener noreferrer"
        className={link}
        title="LinkedIn"
      >
        <Linkedin className={icon} />
      </a>
      <a
        href="mailto:serlismaldonado@heskala.com"
        className={link}
        title="Email"
      >
        <Mail className={icon} />
      </a>
    </div>
  );
}
