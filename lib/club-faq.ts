// /lib/club-faq.ts

// ===== Types & Constants =====
export type ClubFaqItem = {
  patterns: string[]; // cụm từ khóa (không dấu, chữ thường)
  answer: string;     // trả lời (tiếng Việt, thân thiện)
};

export type IndustryDomain =
  | 'fintech'
  | 'blockchain'
  | 'banking'
  | 'payments'
  | 'economics'
  | 'other';

export const CONTACT_EMAIL = 'clbcongnghetaichinh@st.uel.edu.vn';
export const FANPAGE_URL = 'https://www.facebook.com/clbfintechuel';

// ===== Utils =====
export function normalizeVi(s: string) {
  return (s ?? "").replace(/\uFFFD/g, "").normalize("NFC").trim();
}

function scoreMatch(queryNorm: string, pattern: string) {
  if (queryNorm.includes(pattern)) return 100;
  const words = pattern.split(' ').filter(Boolean);
  let hit = 0;
  for (const w of words) {
    if (queryNorm.includes(w)) hit += 1;
  }
  return Math.round((hit / Math.max(words.length, 1)) * 80);
}

// ===== Club-related Detection =====
const clubKeywords = [
  'clb', 'cau lac bo', 'ftc', 'fintech club', 'uel', 'ung tuyen', 'tham gia',
  'hoat dong', 'sinh hoat', 'ban', 'mentor', 'thuc tap', 'tuyen dung',
  'su kien', 'chuong trinh', 'lien he', 'fanpage', 'email', 'moneywe'
];

export function isClubRelated(question: string): boolean {
  const q = toKey(question);
  return clubKeywords.some((kw) => q.includes(toKey(kw)));
}

// ===== FAQ Dataset (đã gộp & m�� rộng pattern) =====
const faq: ClubFaqItem[] = [
  // 1) Giới thiệu CLB
  {
    patterns: [
      'gioi thieu', 'clb la gi', 'cau lac bo la gi', 've clb',
      'ftc la gi', 'clb cong nghe tai chinh', 'fintech club uel',
      'clb ftc', 'thong tin clb', 'clb uel'
    ],
    answer:
`👋 **CLB Công nghệ – Tài chính (FTC)** là cộng đồng sinh viên UEL yêu thích công nghệ tài chính.
FTC thành lập 11/2020, trực thuộc Khoa Tài chính – Ngân hàng.
Bọn mình tổ chức hội thảo, thực hành, dự án thực tế, nhóm nghiên cứu, giờ lập trình,
liên kết doanh nghiệp và tham quan đơn vị để bạn *học sâu – làm thật – kết nối rộng*.`,
  },

  // 2) Hoạt động tiêu biểu
  {
    patterns: ['hoat dong', 'su kien', 'chuong trinh', 'workshop', 'seminar', 'hackathon', 'activity', 'event'],
    answer:
`🎯 **Hoạt động tiêu biểu**:
• Workshop/Seminar: Blockchain, Data, AI ứng dụng trong tài chính
• Hackathon/Mini-hack: xây sản phẩm trong thời gian ngắn
• Dự án thực tế: làm sản phẩm/dashboards, collab doanh nghiệp
• Mentoring: kèm cặp theo nhóm kỹ năng
• Networking/Company tour: kết nối chuyên gia & doanh nghiệp`,
  },

  // 3) Cách tham gia / quy trình
  {
    patterns: ['tham gia', 'gia nhap', 'dang ky', 'apply', 'ung tuyen', 'cach tham gia', 'quy trinh tham gia', 'join'],
    answer:
    `📝 **Cách tham gia**:
1) Theo dõi Fanpage và Instagram của FTC để cập nhật thời điểm mở đơn tuyển và hướng dẫn chi tiết (link sẽ được cập nhật trên các kênh chính thức).
2) Điền đơn đăng ký ở trang *Ứng tuyển* khi có đợt tuyển;
3) Chọn ban phù hợp (Học thuật, Sự kiện, Truyền thông, Tài chính cá nhân, Nhân sự);
4) Phỏng vấn ngắn; 5) Buổi làm quen & bắt đầu hoạt động.

Lưu ý về lịch sinh hoạt: lịch sẽ được sắp xếp theo trưởng ban và phó ban của ban bạn tham gia; thông báo chi tiết sẽ được gửi trong group nhà chung để khảo sát và thống nhất thời gian.

Yêu cầu: nhiệt huyết và tinh thần học hỏi – sẽ có người hướng dẫn từ đầu.

Nếu có nội dung nào chưa rõ hoặc cần thêm thông tin, vui lòng liên hệ Câu lạc bộ qua Fanpage chính thức để được giải đáp: ${FANPAGE_URL}`,
  },

  // 4) Cơ cấu ban trong CLB
  {
    patterns: ['cac ban', 'ban trong clb', 'phong ban', 'co cau ban', 'ban hoc thuat', 'ban su kien', 'ban truyen thong', 'ban tai chinh ca nhan', 'ban nhan su', 'team'],
    answer:
`🏷️ **Cơ cấu ban**
• *Học thuật*: nội dung Fintech, dữ liệu, SQL, phân tích, thuật toán.
• *Sự kiện*: ý tưởng, kịch bản, vận hành chương trình, báo cáo.
• *Truyền thông*: quản trị kênh, viết nội dung, thiết kế, ảnh/video.
• *Tài chính cá nhân*: MoneyWe, chủ đề tài chính cá nhân ứng dụng công nghệ.
• *Nhân sự*: nội quy, văn hóa, tuyển – phân công – đánh giá, minh bạch quỹ.`,
  },

  // 5) Lịch sinh hoạt
  {
    patterns: ['lich sinh hoat', 'thoi gian sinh hoat', 'lich hop', 'lich clb', 'schedule', 'sinh hoat'],
    answer:
`🗓️ **Lịch sinh hoạt**: định kỳ ~2 tuần/lần & theo kế hoạch từng chương trình.
Thông báo chi tiết trên fanpage và website trước sự kiện ≥7 ngày.`,
  },

  // 6) Chi phí
  {
    patterns: ['chi phi', 'phi thanh vien', 'phi tham gia', 'dong phi', 'phi', 'cost', 'money', 'gia'],
    answer:
`💳 **Chi phí**: không thu phí thành viên bắt buộc.
Một số chuyên đề có thể thu mức phí nhỏ để bù chi phí;
thành viên tích cực thường được ưu tiên miễn/giảm.`,
  },

  // 7) Kỹ năng / yêu cầu
  {
    patterns: ['ky nang', 'skill', 'yeu cau', 'requirement', 'can ky nang gi', 'co can kinh nghiem khong'],
    answer:
`🧩 **Kỹ năng/Yêu cầu**:
• Không bắt buộc kinh nghiệm trước
• Đam mê công nghệ & tài chính, sẵn sàng học hỏi
• Kỹ năng cơ bản: làm việc nhóm, thuyết trình, Office
• Ưu tiên (nhưng không bắt buộc): Python/JS, phân tích dữ liệu`,
  },

  // 8) Hướng dẫn – đồng hành (Mentoring)
  {
    patterns: ['mentoring', 'huong dan', 'co van', 'dong hanh', 'nguoi huong dan', 'mentor'],
    answer:
`🧭 **Mentoring**: chương trình mentor theo nhóm kỹ năng (dữ liệu, sản phẩm số, truyền thông).
Mở đăng ký đầu mỗi học kỳ, tập trung *cầm tay chỉ việc* cho thành viên mới.`,
  },

  // 9) Dự án thực tế
  {
    patterns: ['du an thuc te', 'project', 'hop tac', 'san pham', 'lam thuc te'],
    answer:
`💡 **Dự án thực tế**: tham gia xây công cụ phân tích, dashboard dữ liệu, sản phẩm số nhỏ,
thực hành giao dịch theo thuật toán (kèm nguyên tắc quản trị rủi ro).
Cơ hội xây hồ sơ năng lực, được giới thiệu thực tập.`,
  },

  // 10) Cơ hội thực tập
  {
    patterns: ['thuc tap', 'co hoi thuc tap', 'tuyen dung', 'gioi thieu thuc tap', 'internship', 'career'],
    answer:
`🎯 **Thực tập**: CLB kết nối doanh nghiệp công nghệ – tài chính.
Thành viên có sản phẩm/dự án & đóng góp nổi bật sẽ được ưu tiên giới thiệu.`,
  },

  // 11) Liên hệ
  {
    patterns: ['lien he', 'hotline', 'email', 'facebook', 'fanpage', 'contact', 'phone'],
    answer:
`📮 **Liên hệ**:
• Email: ${CONTACT_EMAIL}
• Fanpage: ${FANPAGE_URL}
Bạn có thể nhắn trực tiếp fanpage “FTC – Câu lạc bộ Công nghệ – Tài chính UEL” hoặc dùng email trên.`,
  },
];

// ===== FAQ Matcher =====
export function matchClubFaq(userText: string): string | null {
  const q = toKey(userText);
  let best = { idx: -1, score: 0 };
  faq.forEach((item, i) => {
    let s = 0;
    for (const p of item.patterns) {
      s = Math.max(s, scoreMatch(q, p));
    }
    if (s > best.score) best = { idx: i, score: s };
  });
  // ngưỡng mềm để nhận diện ý gần đúng
  if (best.idx >= 0 && best.score >= 45) return faq[best.idx].answer;
  return null;
}

// ===== Industry Router (LLM topics) =====
const industryKeywords = [
  // core (giữ từ bộ cũ)
  'fintech', 'blockchain', 'smart contract', 'defi', 'dex', 'staking', 'yield',
  'stablecoin', 'cbdc', 'on chain', 'off chain', 'wallet', 'kyc', 'aml',
  'onramp', 'offramp', 'token', 'nft',
  'ngan hang', 'banking', 'bank', 'core banking', 'open banking', 'payments', 'thanh toan',
  'qr', 'pci dss', 'iso 20022', 'swift gpi', 'risk', 'fraud', 'chong gian lan',
  'loan', 'tin dung', 'lai suat', 'interchange',
  'machine learning', 'ai', 'ml', 'nlp', 'detect', 'churn', 'recommendation',
  'chung khoan', 'chi so', 'trai phieu', 'trai phieu doanh nghiep', 'crypto', 'bitcoin', 'eth',
  // mở rộng (từ bộ thứ hai)
  'ethereum', 'web3', 'dao', 'yield farming', 'forex', 'portfolio', 'investment', 'dau tu', 'market', 'stock', 'bond', 'roi',
];

export function shouldRouteToIndustry(question: string): { yes: boolean; domain?: IndustryDomain } {
  const q = toKey(question);

  // Có chứa bất kỳ keyword nào?
  const yes = industryKeywords.some((kw) => q.includes(normalizeVi(kw)));
  if (!yes) return { yes: false };

  // Suy đoán domain
  let domain: IndustryDomain = 'other';
  if (q.includes('blockchain') || q.includes('defi') || q.includes('smart contract') || q.includes('crypto') || q.includes('web3') || q.includes('nft')) {
    domain = 'blockchain';
  } else if (q.includes('fintech')) {
    domain = 'fintech';
  } else if (q.includes('ngan hang') || q.includes('bank') || q.includes('core banking') || q.includes('open banking')) {
    domain = 'banking';
  } else if (q.includes('thanh toan') || q.includes('payments') || q.includes('qr') || q.includes('iso 20022') || q.includes('swift gpi') || q.includes('interchange')) {
    domain = 'payments';
  } else if (q.includes('dau tu') || q.includes('investment') || q.includes('portfolio') || q.includes('stock') || q.includes('bond') || q.includes('forex') || q.includes('market') || q.includes('roi')) {
    domain = 'economics';
  } else {
    domain = 'other';
  }

  return { yes, domain };
}

// ===== Bot Messages =====
export function getDefaultWelcomeMessage() {
  return (
`Xin chào! Tôi là FTC AI Assistant.

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
  const q = toKey(raw);
  const isGreeting = ['xin chao', 'chao', 'hello', 'hi'].some((g) => q.includes(g));
  const isThanks = ['cam on', 'thank', 'thanks', 'merci'].some((t) => q.includes(t));

  if (isGreeting) {
    return 'Xin chào! Tôi là trợ lý AI của FTC. Tôi có thể giúp bạn tìm hiểu về câu lạc bộ và các kiến thức Fintech. Bạn muốn hỏi gì?';
  }
  if (isThanks) {
    return 'Rất vui được giúp đỡ bạn! Nếu có thêm câu hỏi nào khác, đừng ngần ngại hỏi nhé. Chúc bạn một ngày tốt lành! 😊';
  }

  return (
`Mình đã nhận câu hỏi: "${raw}". Hiện chưa có thông tin chi tiết trong FAQ.

Bạn có thể:
• Gửi mail: ${CONTACT_EMAIL}
• Nhắn fanpage: ${FANPAGE_URL}
• Thử đặt câu hỏi khác về thành viên, lịch sinh hoạt, học thuật, sự kiện, truyền thông, tài chính cá nhân, nhân sự…`
  );
}

// ====== APPEND BELOW (lib/club-faq.ts) ======
/** Chuẩn hóa key tìm kiếm: bỏ dấu, thường hóa, giữ chữ & số, khoảng trắng đơn */
export function toKey(s: string) {
  return (s ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Trả về block ngữ cảnh gọn dựa trên dữ liệu CLB sẵn có trong file này */
export function buildClubContextBlock(userQuestion: string) {
  const norm = (s: string) => (s ?? '').replace(/\uFFFD/g, '').normalize('NFC').trim();

  const quickFacts: string[] = [
    'FTC trực thuộc Khoa Tài chính – Ng��n hàng, UEL',
    'Thành lập 11/2020',
  ];

  const meta = [
    'CLB Công nghệ – Tài chính (FTC) – trực thuộc Khoa Tài chính – Ngân hàng, UEL.',
    'Tầm nhìn: Học sâu – làm thật – kết nối rộng trong FinTech.',
    'Sứ mệnh: Xây cộng đồng sinh viên yêu công nghệ tài chính, thực chiến dự án, gắn kết doanh nghiệp.',
    `Liên hệ: ${CONTACT_EMAIL}; Fanpage: ${FANPAGE_URL}`,
  ].map(norm);

  const activities = [
    '• Workshop/Seminar Fintech, Blockchain, Data (theo học kỳ)',
    '• Mini-hack/Hackathon (xây MVP 24–48h)',
    '• Dự án nội bộ & hợp tác doanh nghiệp (dashboard, chatbot, RAG, dữ liệu)',
    '• Mentoring & sinh hoạt chuyên môn',
  ];

  // (Đơn giản) Nếu lib đã có matchClubFaq trả về string, chèn 1 QA liên quan
  let faqLines: string[] = [];
  try {
    const hit = matchClubFaq(userQuestion);
    if (typeof hit === 'string' && hit.trim()) {
      faqLines = ['FAQ liên quan:', norm(hit.trim())];
    }
  } catch {}

  const hint = 'Nếu câu hỏi nói về CLB, trả lời dựa trên block ngữ cảnh này; thiếu dữ liệu thì nói chưa có, đừng bịa.';

  return [
    '# NGỮ CẢNH CLB',
    hint,
    ...quickFacts.map(norm),
    ...meta,
    ...(faqLines.length ? faqLines : []),
    'Hoạt động tiêu biểu:',
    ...activities,
  ].join('\n');
}
