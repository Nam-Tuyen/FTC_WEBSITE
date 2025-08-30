import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_API_KEY })

const CONF = {
  QUESTIONS_DB: process.env.NOTION_DB_QUESTIONS_ID || '',
  REPLIES_DB: process.env.NOTION_DB_REPLIES_ID || '',
  // Property names (override via env if needed)
  P_TITLE: process.env.NOTION_PROP_TITLE || 'Title',
  P_CONTENT: process.env.NOTION_PROP_CONTENT || 'Content',
  P_AUTHOR_NAME: process.env.NOTION_PROP_AUTHOR_NAME || 'AuthorName',
  P_AUTHOR_ID: process.env.NOTION_PROP_AUTHOR_ID || 'AuthorId',
  P_CREATED_AT: process.env.NOTION_PROP_CREATED_AT || 'CreatedAt',
  P_STUDENT_ID: process.env.NOTION_PROP_STUDENT_ID || 'StudentId',
  P_CATEGORY: process.env.NOTION_PROP_CATEGORY || 'Category',
  P_REL_QUESTION: process.env.NOTION_PROP_REL_QUESTION || 'Question',
}

function rt(text: string) {
  return [{ type: 'text', text: { content: text.slice(0, 2000) } }]
}

export async function createNotionQuestion(payload: {
  title: string
  content: string
  authorName: string
  authorId: string
  studentId: string
  category: string
  createdAt?: string
}) {
  if (!CONF.QUESTIONS_DB) throw new Error('Missing NOTION_DB_QUESTIONS_ID')
  const createdAt = payload.createdAt || new Date().toISOString()
  const properties: any = {
    [CONF.P_TITLE]: { title: rt(payload.title) },
    [CONF.P_CONTENT]: { rich_text: rt(payload.content) },
    [CONF.P_AUTHOR_NAME]: { rich_text: rt(payload.authorName) },
    [CONF.P_AUTHOR_ID]: { rich_text: rt(payload.authorId) },
    [CONF.P_CREATED_AT]: { date: { start: createdAt } },
    [CONF.P_STUDENT_ID]: { rich_text: rt(payload.studentId) },
    [CONF.P_CATEGORY]: { rich_text: rt(payload.category) },
  }
  const page = await notion.pages.create({ parent: { database_id: CONF.QUESTIONS_DB }, properties })
  return page.id
}

export async function createNotionReply(payload: {
  questionPageId: string
  content: string
  authorName: string
  authorId: string
  createdAt?: string
}) {
  if (!CONF.REPLIES_DB) throw new Error('Missing NOTION_DB_REPLIES_ID')
  const createdAt = payload.createdAt || new Date().toISOString()
  const properties: any = {
    [CONF.P_REL_QUESTION]: { relation: [{ id: payload.questionPageId }] },
    [CONF.P_CONTENT]: { rich_text: rt(payload.content) },
    [CONF.P_AUTHOR_NAME]: { rich_text: rt(payload.authorName) },
    [CONF.P_AUTHOR_ID]: { rich_text: rt(payload.authorId) },
    [CONF.P_CREATED_AT]: { date: { start: createdAt } },
  }
  const page = await notion.pages.create({ parent: { database_id: CONF.REPLIES_DB }, properties })
  return page.id
}
