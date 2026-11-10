import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Cuerpo del post en Markdown (viene de Notion). Se renderiza en el servidor, sin JS en el cliente.
const PROSE = `
          text-[17px] text-zinc-300 leading-[1.8]
          [&>*+*]:mt-5
          [&_h1]:text-[36px] [&_h1]:font-bold [&_h1]:text-white [&_h1]:tracking-[-0.025em] [&_h1]:leading-tight [&_h1]:mt-14 [&_h1]:mb-5
          [&_h2]:text-[24px] [&_h2]:font-bold [&_h2]:text-white [&_h2]:tracking-[-0.02em] [&_h2]:leading-tight [&_h2]:mt-12 [&_h2]:mb-4
          [&_h3]:text-[20px] [&_h3]:font-semibold [&_h3]:text-zinc-100 [&_h3]:tracking-[-0.015em] [&_h3]:leading-snug [&_h3]:mt-10 [&_h3]:mb-3
          [&_h4]:text-[17px] [&_h4]:font-semibold [&_h4]:text-zinc-200 [&_h4]:mt-8 [&_h4]:mb-2
          [&_p]:text-zinc-300 [&_p]:leading-[1.8]
          [&_strong]:text-white [&_strong]:font-semibold
          [&_a]:text-white [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-zinc-600 [&_a]:hover:decoration-white [&_a]:transition-colors
          [&_code]:font-mono [&_code]:text-[14px] [&_code]:bg-zinc-900 [&_code]:text-zinc-300 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:border [&_code]:border-zinc-800
          [&_pre]:bg-zinc-900 [&_pre]:border [&_pre]:border-zinc-800 [&_pre]:rounded-xl [&_pre]:px-5 [&_pre]:py-4 [&_pre]:overflow-x-auto [&_pre]:my-6 [&_pre]:text-[14px]
          [&_pre_code]:bg-transparent [&_pre_code]:border-0 [&_pre_code]:p-0 [&_pre_code]:text-zinc-300
          [&_blockquote]:border-l [&_blockquote]:border-zinc-700 [&_blockquote]:pl-5 [&_blockquote]:my-6 [&_blockquote]:text-zinc-500 [&_blockquote]:italic
          [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:my-2
          [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_ol]:my-2
          [&_li]:text-zinc-300 [&_li]:leading-[1.8]
          [&_hr]:border-zinc-800/60 [&_hr]:my-10
          [&_table]:w-full [&_table]:border-collapse [&_table]:my-6 [&_table]:text-[15px]
          [&_th]:border [&_th]:border-zinc-800 [&_th]:px-4 [&_th]:py-2.5 [&_th]:text-left [&_th]:font-medium [&_th]:text-zinc-300 [&_th]:bg-zinc-900/60
          [&_td]:border [&_td]:border-zinc-800 [&_td]:px-4 [&_td]:py-2.5 [&_td]:text-zinc-400
          [&_img]:rounded-xl [&_img]:my-8 [&_img]:w-full
        `;

export default function PostBody({ markdown }: { markdown: string }) {
  return (
    <div className={PROSE}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  );
}
