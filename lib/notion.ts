import { Client } from '@notionhq/client'
import { serverEnv } from './env'

export const notion = new Client({
  auth: serverEnv('NOTION_API_KEY'),
})

export const NOTION_DATABASE_ID = serverEnv('NOTION_DATABASE_ID')!
