export function escapeHtml(str: string) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

export function formatMessageContent(text: string) {
  if (!text) return ""
  const escaped = escapeHtml(text)
  let out = escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
  const lines = out.split(/\r?\n/)
  let inList = false
  let res = ""
  
  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (line.startsWith("* ")) {
      if (!inList) {
        res += '<ul>'
        inList = true
      }
      res += `<li>${line.slice(2)}</li>`
    } else {
      if (inList) {
        res += "</ul>"
        inList = false
      }
      if (line === "") {
        res += "<br/>"
      } else {
        res += `<p class="mb-1">${line}</p>`
      }
    }
  }
  
  if (inList) res += "</ul>"
  return res
}
