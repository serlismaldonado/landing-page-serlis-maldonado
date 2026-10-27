import { notion, NOTION_DATABASE_ID } from './notion'
import { NotionToMarkdown } from 'notion-to-md'
import type {
  PageObjectResponse,
  RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints'

export type PostMetadata = {
  title: string
  description: string
  date: string
  tags?: string[]
  author?: string
  coverImage?: string
}

export type Post = {
  slug: string
  metadata: PostMetadata
}

const n2m = new NotionToMarkdown({ notionClient: notion })

function extractText(richText: RichTextItemResponse[]): string {
  return richText.map((t) => t.plain_text).join('')
}

function pageToPost(page: PageObjectResponse): Post {
  const props = page.properties

  const titleProp = props['Title'] ?? props['Name']
  const title =
    titleProp?.type === 'title' ? extractText(titleProp.title) : 'Sin título'

  const descProp = props['Description']
  const description =
    descProp?.type === 'rich_text' ? extractText(descProp.rich_text) : ''

  const slugProp = props['Slug']
  const slug =
    slugProp?.type === 'rich_text'
      ? extractText(slugProp.rich_text)
      : page.id.replace(/-/g, '')

  const dateProp = props['Date']
  const date =
    dateProp?.type === 'date' && dateProp.date
      ? dateProp.date.start
      : page.created_time.slice(0, 10)

  const tagsProp = props['Tags']
  const tags =
    tagsProp?.type === 'multi_select'
      ? tagsProp.multi_select.map((t) => t.name)
      : []

  const authorProp = props['Author']
  const author =
    authorProp?.type === 'rich_text'
      ? extractText(authorProp.rich_text)
      : undefined

  const cover = page.cover
  const coverImage =
    cover?.type === 'external'
      ? cover.external.url
      : cover?.type === 'file'
        ? cover.file.url
        : undefined

  return { slug, metadata: { title, description, date, tags, author, coverImage } }
}

export async function getAllPosts(): Promise<Post[]> {
  const response = await notion.databases.query({
    database_id: NOTION_DATABASE_ID,
    filter: {
      property: 'Published',
      checkbox: { equals: true },
    },
    sorts: [{ property: 'Date', direction: 'descending' }],
  })

  return (response.results as PageObjectResponse[]).map(pageToPost)
}

export async function getPost(slug: string): Promise<{ markdown: string; metadata: PostMetadata }> {
  const response = await notion.databases.query({
    database_id: NOTION_DATABASE_ID,
    filter: {
      and: [
        { property: 'Published', checkbox: { equals: true } },
        { property: 'Slug', rich_text: { equals: slug } },
      ],
    },
  })

  const page = response.results[0] as PageObjectResponse | undefined
  if (!page) throw new Error(`Post not found: ${slug}`)

  const { slug: _slug, metadata } = pageToPost(page)
  const mdBlocks = await n2m.pageToMarkdown(page.id)
  const markdown = n2m.toMarkdownString(mdBlocks).parent

  return { markdown, metadata }
}
