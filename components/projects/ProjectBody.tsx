import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";

// Texto del proyecto en Markdown, con tipografía de lectura. Se renderiza en el servidor.
// El primer párrafo hace de entradilla (más grande), como en un caso de estudio.
const PROSE = [
  "text-[17px] leading-[1.75] text-zinc-300",
  "[&>p]:mb-5 [&>p:first-child]:mb-7 [&>p:first-child]:text-[22px] [&>p:first-child]:leading-[1.5] [&>p:first-child]:text-zinc-100",
  "[&_strong]:font-semibold [&_strong]:text-white",
  "[&_a]:text-white [&_a]:underline [&_a]:decoration-zinc-600 [&_a]:underline-offset-4 hover:[&_a]:decoration-[#D8E64A]",
  "[&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-1.5",
  "[&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:text-[22px] [&_h2]:font-semibold [&_h2]:text-white",
  "[&_h3]:mb-2 [&_h3]:mt-8 [&_h3]:text-[18px] [&_h3]:font-semibold [&_h3]:text-white",
  "[&_code]:rounded [&_code]:bg-zinc-900 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[14px]",
].join(" ");

export default function ProjectBody({ markdown }: { markdown: string }) {
  return (
    <div className={PROSE}>
      <ReactMarkdown remarkPlugins={[remarkBreaks]}>{markdown}</ReactMarkdown>
    </div>
  );
}
