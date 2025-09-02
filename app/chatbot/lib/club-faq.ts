// /lib/club-faq.ts
// 8) Cơ hội thực tập
{
patterns: ['thuc tap', 'co hoi thuc tap', 'tuyen dung', 'gioi thieu thuc tap'],
answer:
`🎯 **Thực tập**: CLB kết nối doanh nghiệp công nghệ – tài chính.\nThành viên có sản phẩm/dự án & đóng góp nổi bật sẽ được ưu tiên giới thiệu.`,
},


// 9) Liên hệ
{
patterns: ['lien he', 'hotline', 'email', 'facebook', 'fanpage'],
answer:
`📮 **Liên hệ**:\n• Email: ${CONTACT_EMAIL}\n• Fanpage: ${FANPAGE_URL}\nBạn có thể nhắn trực tiếp fanpage “FTC – Câu lạc bộ Công nghệ – Tài chính UEL” hoặc dùng email trên.`,
},
];


function scoreMatch(queryNorm: string, pattern: string) {
if (queryNorm.includes(pattern)) return 100;
const words = pattern.split(' ').filter(Boolean);
let hit = 0;
words.forEach((w) => {
if (queryNorm.includes(w)) hit += 1;
});
return Math.round((hit / Math.max(words.length, 1)) * 80);
}


export function matchClubFaq(userText: string): string | null {
const q = normalizeVi(userText);
let best = { idx: -1, score: 0 };
faq.forEach((item, i) => {
let s = 0;
item.patterns.forEach((p) => (s = Math.max(s, scoreMatch(q, p))));
if (s > best.score) best = { idx: i, score: s };
});
// ngưỡng mềm để nhận diện ý gần đúng
if (best.idx >= 0 && best.score >= 45) return faq[best.idx].answer;
return null;
}


export type IndustryDomain = 'fintech' | 'blockchain' | 'banking' | 'payments' | 'economics' | 'other';


const industryKeywords = [
'fintech', 'blockchain', 'smart contract', 'defi', 'dex', 'staking', 'yield',
'stablecoin', 'cbdc', 'on chain', 'off chain', 'wallet', 'kyc', 'aml',
'onramp', 'offramp', 'token', 'nft',
'ngan hang', 'banking', 'bank', 'core banking', 'open banking', 'payments', 'thanh toan',
'qr', 'pci dss', 'iso 20022', 'swift gpi', 'risk', 'fraud', 'chong gian lan',
'loan', 'tin dung', 'lai suat', 'interchange',
'machine learning', 'ai', 'ml', 'nlp', 'detect', 'churn', 'recommendation',
'chung khoan', 'chi so', 'trai phieu', 'trai phieu doanh nghiep', 'crypto', 'bitcoin', 'eth',
];


export function shouldRouteToIndustry(question: string): { yes: boolean; domain?: IndustryDomain } {
const q = normalizeVi(question);
const yes = industryKeywords.some((kw) => q.includes(normalizeVi(kw)));
let domain: IndustryDomain = 'other';
if (q.includes('blockchain') || q.includes('defi') || q.includes('smart contract') || q.includes('crypto')) domain = 'blockchain';
else if (q.includes('fintech')) domain = 'fintech';
else if (q.includes('ngan hang') || q.includes('bank')) domain = 'banking';
else if (q.includes('thanh toan') || q.includes('payments') || q.includes('qr')) domain = 'payments';
return { yes, domain };
}


export function getDefaultWelcomeMessage() {
return (
`Xin chào! Tôi là **FTC AI Assistant**.\n\nTôi có thể giúp bạn:\n• Trả lời câu hỏi về câu lạc bộ\n• Giải thích khái niệm Fintech\n• Hướng dẫn tham gia hoạt động\n• Tìm thông tin trên website\n\n📮 Liên hệ: ${CONTACT_EMAIL}\n📘 Fanpage: ${FANPAGE_URL}`
);
}


export function getBotFallbackAnswer(raw: string) {
return (
`Mình đã nhận câu hỏi: "${raw}". Hiện chưa có thông tin chi tiết trong FAQ.\n\nBạn có thể:\n• Gửi mail: ${CONTACT_EMAIL}\n• Nhắn fanpage: ${FANPAGE_URL}\n• Thử đặt câu hỏi khác về thành viên, lịch sinh hoạt, học thuật, sự kiện, truyền thông, tài chính cá nhân, nhân sự…`
);
}
