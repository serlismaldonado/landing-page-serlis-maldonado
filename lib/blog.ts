import fs from 'node:fs/promises'
import path from 'node:path'

export type PostMetadata = {
  title: string
  description: string
  date: string
  tags?: string[]
  author?: string
}

export type Post = {
  slug: string
  metadata: PostMetadata
}

const POSTS_DIR = path.join(process.cwd(), 'content/blog')

export async function getAllPosts(): Promise<Post[]> {
  const files = await fs.readdir(POSTS_DIR)

  const posts = await Promise.all(
    files
      .filter((f) => f.endsWith('.mdx'))
      .map(async (file) => {
        const slug = file.replace(/\.mdx$/, '')
        const { metadata } = (await import(`@/content/blog/${slug}.mdx`)) as {
          metadata: PostMetadata
        }
        return { slug, metadata }
      })
  )

  return posts.sort(
    (a, b) =>
      new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
  )
}

export async function getPost(slug: string) {
  const { default: Component, metadata } = (await import(
    `@/content/blog/${slug}.mdx`
  )) as {
    default: React.ComponentType
    metadata: PostMetadata
  }
  return { Component, metadata }
}
