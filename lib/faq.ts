// /lib/club-faq.ts
export type ClubFaqItem = {
  patterns: string[]; // cụm từ khóa (không dấu, chữ thường)
  answer: string;     // trả lời (tiếng Việt, thân thiện)
};

export const CONTACT_EMAIL = 'clbcongnghetaichinh@st.uel.edu.vn';
export const FANPAGE_URL   = 'https://www.facebook.com/clbfintechuel';

export function normalizeVi(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    // Cho phép 1 số ký tự phổ biến trong câu hỏi
    .replace(/[^a-z0-9\s?.,:;!@#$\/+()_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const faq: ClubFaqItem[] = [
  // 1) Giới thiệu CLB
  {
    patterns: [
      'gioi thieu', 'clb la gi', 'cau lac bo la gi', 've clb',
      'ftc la gi', 'clb cong nghe tai chinh', 'fintech club uel'
    ],
    answer:
`👋 **CLB Công nghệ – Tài chính (FTC)** là cộng đồng sinh viên UEL yêu thích công nghệ tài chính.
FTC thành lập 11/2020, trực thuộc Khoa Tài chính – Ngân hàng.
Bọn mình tổ chức hội thảo, thực hành, dự án thực tế, nhóm nghiên cứu, giờ lập trình,
liên kết doanh nghiệp và tham quan đơn vị để bạn *học sâu – làm thật – kết nối rộng*.`,
  },

  // 2) Cách tham gia / quy trình
  {
    patterns: ['tham gia', 'dang ky', 'ung tuyen', 'cach tham gia', 'quy trinh tham gia'],
    answer:
`📝 **Cách tham gia**:
1) Điền đơn đăng ký ở trang *Ứng tuyển*;
2) Chọn ban phù hợp (Học thuật, Sự kiện, Truyền thông, Tài chính cá nhân, Nhân sự);
3) Phỏng vấn ngắn;
4) Buổi làm quen & bắt đầu hoạt động.
Yêu cầu: nhiệt huyết và tinh thần học hỏi – sẽ có người hướng dẫn từ đầu.`,
  },

  // 3) Cơ cấu ban trong CLB
  {
    patterns: ['cac ban', 'ban trong clb', 'phong ban', 'co cau ban', 'ban hoc thuat', 'ban su kien', 'ban truyen thong', 'ban tai chinh ca nhan', 'ban nhan su'],
    answer:
`🏷️ **Cơ cấu ban**
• *Học thuật*: nội dung Fintech, dữ liệu, SQL, phân tích, thuật toán.
• *Sự kiện*: ý tưởng, kịch bản, vận hành chương trình, báo cáo.
• *Truyền thông*: quản trị kênh, viết nội dung, thiết kế, ảnh/video.
• *Tài chính cá nhân*: MoneyWe, chủ đề tài chính cá nhân ứng dụng công nghệ.
• *Nhân sự*: nội quy, văn hóa, tuyển – phân công – đánh giá, minh bạch quỹ.`,
  },

  // 4) Lịch sinh hoạt
  {
    patterns: ['lich sinh hoat', 'thoi gian sinh hoat', 'lich hop', 'lich clb'],
    answer:
`🗓️ **Lịch sinh hoạt**: định kỳ ~2 tuần/lần & theo kế hoạch từng chương trình.
Thông báo chi tiết trên fanpage và website trước sự kiện ≥7 ngày.`,
  },

  // 5) Chi phí
  {
    patterns: ['chi phi', 'phi thanh vien', 'phi tham gia', 'dong phi'],
    answer:
`💳 **Chi phí**: không thu phí thành viên bắt buộc.
Một số chuyên đề có thể thu mức phí nhỏ để bù chi phí;
thành viên tích cực thường được ưu tiên miễn/giảm.`,
  },

  // 6) Hướng dẫn – đồng hành
  {
    patterns: ['mentoring', 'huong dan', 'co van', 'dong hanh', 'nguoi huong dan'],
    answer:
`🧭 **Hướng dẫn – đồng hành**: chương trình mentor theo nhóm kỹ năng (dữ liệu, sản phẩm số, truyền thông).
Mở đăng ký đầu mỗi học kỳ, tập trung *cầm tay chỉ việc* cho thành viên mới.`,
  },

  // 7) Dự án thực tế
  {
    patterns: ['du an thuc te', 'project', 'hop tac', 'san pham', 'lam thuc te'],
    answer:
`💡 **Dự án thực tế**: tham gia xây công cụ phân tích, dashboard dữ liệu, sản phẩm số nhỏ,
thực hành giao dịch theo thuật toán (kèm nguyên tắc quản trị rủi ro).
Cơ hội xây hồ sơ năng lực, được giới thiệu thực tập.`,
  },

  // 8) Cơ hội thực tập
  {
    patterns: ['thuc tap', 'co hoi thuc tap', 'tuyen dung', 'gioi thieu thuc tap'],
    answer:
`🎯 **Thực tập**: CLB kết nối doanh nghiệp công nghệ – tài chính.
Thành viên có sản phẩm/dự án & đóng góp nổi bật sẽ được ưu tiên giới thiệu.`,
  },

  // 9) Liên hệ
  {
    patterns: ['lien he', 'hotline', 'email', 'facebook', 'fanpage'],
    answer:
`📮 **Liên hệ**:
• Email: ${CONTACT_EMAIL}
• Fanpage: ${FANPAGE_URL}
Bạn có thể nhắn trực tiếp fanpage “FTC – Câu lạc bộ Công nghệ – Tài chính UEL” hoặc dùng email trên.`,
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
`Xin chào! Tôi là **FTC AI Assistant**.

Tôi có thể giúp bạn:
• Trả lời câu hỏi về câu lạc bộ
• Giải thích khái niệm Fintech
• Hướng dẫn tham gia hoạt động
• Tìm thông tin trên website

📮 Liên hệ: ${CONTACT_EMAIL}
📘 Fanpage: ${FANPAGE_URL}`
  );
}

export function getBotFallbackAnswer(raw: string) {
  return (
`Mình đã nhận câu hỏi: "${raw}". Hiện chưa có thông tin chi tiết trong FAQ.

Bạn có thể:
• Gửi mail: ${CONTACT_EMAIL}
• Nhắn fanpage: ${FANPAGE_URL}
• Thử đặt câu hỏi khác về thành viên, lịch sinh hoạt, học thuật, sự kiện, truyền thông, tài chính cá nhân, nhân sự…`
  );
}
