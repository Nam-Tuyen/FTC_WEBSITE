const API_URL = process.env.NEXT_PUBLIC_FORUM_API_URL || '/api/forum';
const TOKEN = process.env.NEXT_PUBLIC_FORUM_API_TOKEN || 'ftc-2025-secret';

export async function callAPI<T = any>(action: string, body: any): Promise<T> {
  const payload = {
    function: action,
    body: TOKEN ? { ...body, token: TOKEN } : body,
  };

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    redirect: "follow",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} - ${text}`);
  }
  return res.json();
}
