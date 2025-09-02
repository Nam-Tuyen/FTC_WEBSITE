// /app/api/chat/gemini/route.ts
const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';


export const runtime = 'nodejs';


function buildPrompt(user: string, domain?: string) {
// Hướng AI trả lời bằng tiếng Việt, ngắn gọn, đúng ngữ cảnh CLB
return (
`Bạn là trợ lý AI cho Câu lạc bộ Công nghệ – Tài chính (FTC) – UEL.\n\nNgữ cảnh: người hỏi là sinh viên/quan tâm Fintech. Trả lời súc tích, tiếng Việt, có cấu trúc gọn (gạch đầu dòng khi phù hợp), ưu tiên hướng dẫn thực hành.\nNếu câu hỏi mang tính chuyên môn ${domain ? `(${domain})` : ''}, hãy giải thích khái niệm và đưa ví dụ gần gũi, tránh phóng đại rủi ro/lợi ích.\nKhông bịa đặt thông tin nội bộ. Nếu thiếu dữ liệu, nói rõ và đề xuất cách tìm hiểu tiếp.\n\nCâu hỏi người dùng: ${user}`
);
}


export async function POST(req: Request) {
try {
const { prompt, history } = await req.json();
const faqHit = matchClubFaq(prompt);


// 1) Nếu khớp FAQ, trả lời ngay không gọi Gemini
if (faqHit) {
return NextResponse.json({ text: faqHit }, { status: 200 });
}


// 2) Đánh giá có cần route sang miền chuyên ngành không
const { yes, domain } = shouldRouteToIndustry(prompt || '');


// 3) Nếu không cần chuyên môn, có thể trả về fallback thân thiện
if (!yes) {
return NextResponse.json({ text: getBotFallbackAnswer(prompt) }, { status: 200 });
}


// 4) Gọi Gemini cho câu hỏi chuyên ngành
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
// Không có API key: trả fallback mềm
return NextResponse.json({ text: getBotFallbackAnswer(prompt) }, { status: 200 });
}


const systemPrompt = buildPrompt(prompt, domain);


const r = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
contents: [
{
role: 'user',
parts: [{ text: systemPrompt }],
},
],
generationConfig: {
temperature: 0.4,
topK: 32,
topP: 0.95,
maxOutputTokens: 1024,
},
safetySettings: [
{ category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
],
}),
});


if (!r.ok) {
const errText = await r.text().catch(() => '');
console.error('Gemini error', r.status, errText);
return NextResponse.json({ text: getBotFallbackAnswer(prompt) }, { status: 200 });
}


const data = await r.json();
const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';


if (!text) {
return NextResponse.json({ text: getBotFallbackAnswer(prompt) }, { status: 200 });
}


return NextResponse.json({ text }, { status: 200 });
} catch (e) {
console.error('API error', e);
return NextResponse.json({ text: 'Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau.' }, { status: 200 });
}
}
