import type { MDXComponents } from 'mdx/types'
import Image from 'next/image'
import Link from 'next/link'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="font-mono text-3xl font-bold mt-10 mb-4 text-white">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-mono text-xl font-semibold mt-8 mb-3 text-zinc-100">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-mono text-lg font-semibold mt-6 mb-2 text-zinc-200">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="font-mono text-sm text-zinc-400 leading-relaxed mb-4">
        {children}
      </p>
    ),
    a: ({ href, children }) => (
      <Link
        href={href!}
        className="text-green-500 hover:text-green-400 underline underline-offset-2 transition-colors"
      >
        {children}
      </Link>
    ),
    ul: ({ children }) => (
      <ul className="font-mono text-sm text-zinc-400 list-disc list-inside mb-4 space-y-1">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="font-mono text-sm text-zinc-400 list-decimal list-inside mb-4 space-y-1">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-green-500 pl-4 my-4 text-zinc-500 italic font-mono text-sm">
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className="bg-zinc-800 text-green-400 font-mono text-xs px-1.5 py-0.5 rounded">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 overflow-x-auto my-4 font-mono text-sm text-zinc-300">
        {children}
      </pre>
    ),
    img: ({ src, alt }) => (
      <Image
        src={src!}
        alt={alt ?? ''}
        width={800}
        height={400}
        className="rounded-lg my-4 w-full object-cover"
      />
    ),
    hr: () => <hr className="border-zinc-800 my-8" />,
    table: ({ children }) => (
      <div className="overflow-x-auto my-4">
        <table className="w-full font-mono text-sm text-zinc-400 border-collapse">
          {children}
        </table>
      </div>
    ),
    th: ({ children }) => (
      <th className="border border-zinc-800 px-4 py-2 text-left text-zinc-300 bg-zinc-900">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border border-zinc-800 px-4 py-2">{children}</td>
    ),
    ...components,
  }
}
