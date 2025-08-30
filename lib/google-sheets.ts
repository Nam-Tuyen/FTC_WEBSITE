import { google, sheets_v4 } from 'googleapis'

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

type ServiceAccount = {
  client_email: string
  private_key: string
}

function loadServiceAccount(): ServiceAccount {
  const b64 = process.env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64
  const keyFile = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE
  if (b64) {
    const json = Buffer.from(b64, 'base64').toString('utf-8')
    const parsed = JSON.parse(json)
    return { client_email: parsed.client_email, private_key: parsed.private_key }
  }
  if (keyFile) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const parsed = require(keyFile)
    return { client_email: parsed.client_email, private_key: parsed.private_key }
  }
  const client_email = process.env.GOOGLE_CLIENT_EMAIL
  const private_key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  if (!client_email || !private_key) {
    throw new Error('Google Service Account credentials are not configured')
  }
  return { client_email, private_key }
}

export async function getSheetsClient() {
  const { client_email, private_key } = loadServiceAccount()
  const auth = new google.auth.JWT({ email: client_email, key: private_key, scopes: SCOPES })
  const sheets = google.sheets({ version: 'v4', auth })
  return sheets
}

export async function ensureDailySheet(sheets: sheets_v4.Sheets, spreadsheetId: string, title: string) {
  const meta = await sheets.spreadsheets.get({ spreadsheetId })
  const exists = meta.data.sheets?.some((s) => s.properties?.title === title)
  if (!exists) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests: [{ addSheet: { properties: { title } } }] },
    })
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${title}!A1:G1`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [[
          'Timestamp',
          'MSSV',
          'Tên',
          'Tiêu đề',
          'Nội dung',
          'Chủ đề',
          'ID Câu hỏi',
        ]],
      },
    })
  }
}

export async function appendForumQuestion(params: {
  spreadsheetId: string
  sheetTitle: string
  timestamp: string
  studentId: string
  name: string
  title: string
  content: string
  category: string
  questionId: string
}) {
  const sheets = await getSheetsClient()
  await ensureDailySheet(sheets, params.spreadsheetId, params.sheetTitle)
  await sheets.spreadsheets.values.append({
    spreadsheetId: params.spreadsheetId,
    range: `${params.sheetTitle}!A:G`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [[
        params.timestamp,
        params.studentId,
        params.name,
        params.title,
        params.content,
        params.category,
        params.questionId,
      ]],
    },
  })
}
