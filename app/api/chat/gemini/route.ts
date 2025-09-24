import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type KBItem = { id?: string; question?: string; answer?: string; content?: string; tags?: string[] };
type FAQItem = { id?: string; canonical_question?: string; answer: string };
type HistoryMsg = { role?: string; content?: string };
export type ChatMode = "club" | "industry"

export function normalize(s: string) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function jaccard(aArr: string[], bArr: string[]) {
  const a = new Set(aArr), b = new Set(bArr);
  let hit = 0;
  for (const t of a) if (b.has(t)) hit++;
  return hit / (a.size + b.size - hit || 1);
}

function levenshtein(a: string, b: string) {
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

export const SYSTEM_PROMPT_CLUB = `
Bạn là cố vấn học tập dành cho tân sinh viên. Chỉ trả lời về Câu lạc bộ Công nghệ tài chính FTC dựa trên TRI THỨC NỘI BỘ dưới đây (giới thiệu, cơ cấu ban, hoạt động, thành tích, cách tham gia, kênh liên hệ). Trả lời bằng tiếng Việt.

YÊU CẦU CHUNG
- Giải thích rõ ràng, ngắn gọn, đúng trọng tâm. Nếu thiếu dữ liệu thì nói: "hiện chưa có thông tin".
- Không suy đoán, không trả lời ngoài phạm vi FTC.
- Không thêm bất kỳ câu gợi ý theo sau câu trả lời. Tuyệt đối KHÔNG chèn câu kiểu: "Bạn muốn tìm hiểu thêm về ban nào hoặc lịch sinh hoạt gần nhất không".
- Định dạng: đoạn văn mạch lạc hoặc bullet ngắn. Không dùng emoji trừ khi người dùng dùng trước.

TRI THỨC NỘI BỘ TÓM TẮT
- Thông tin chung: FTC trực thuộc Khoa Tài chính và Ngân hàng, Trường Đại học Kinh tế và Luật, ĐHQG-HCM. Thành lập tháng 11/2020 dưới sự hướng dẫn của ThS. NCS Phan Huy Tâm.
- Hoạt động tiêu biểu: hội thảo, tọa đàm và chuyên đề về FinTech, dữ liệu, trí tuệ nhân tạo, ngân hàng số, thị trường vốn, quản trị rủi ro; cuộc thi học thuật ATTACKER; chuỗi talkshow và workshop; training nội bộ; tham quan doanh nghiệp (ví dụ VNG); sự kiện hướng nghiệp Web3 Career Innovation; hoạt động gắn kết cộng đồng FTC Trip.
- Thành tích: Giấy khen của Ban Cán sự Đoàn ĐHQG-HCM năm học 2024–2025. Top 10 Nhóm 4 Giải thưởng I-STAR TP.HCM.
- Cơ cấu ban chuyên môn (Ban Điều hành là cấp định hướng, không tính là ban chuyên môn):
  1) Ban Học thuật: Phát triển nội dung workshop và talkshow; biên soạn tài liệu thực hành về FinTech, dữ liệu, ngân hàng số; xây dựng ngân hàng câu hỏi; ra đề và chấm cuộc thi ATTACKER. Đầu ra: slide, case study, ngân hàng trắc nghiệm, đề cương dự án, báo cáo tổng kết.
  2) Ban Sự kiện: Lập kế hoạch chi tiết, kịch bản MC, điều phối hiện trường, làm việc với đối tác địa điểm; chịu trách nhiệm timeline, checklist, phân công, nghiệm thu chất lượng và báo cáo chi phí.
  3) Ban Truyền thông: Xây dựng nhận diện và câu chuyện thương hiệu; quản lý kênh mạng xã hội; sản xuất nội dung và ấn phẩm; theo dõi hiệu quả tiếp cận. Đầu ra: bộ ảnh, video ngắn, bài giới thiệu diễn giả, bài recap, báo cáo chỉ số.
  4) Ban Tài chính cá nhân: Thiết kế giáo trình quản lý tài chính cho sinh viên, vận hành lớp học chuyên đề, cập nhật và triển khai bộ bài MoneyWe, hỗ trợ học phần liên quan. Chủ đề: lập ngân sách, mục tiêu tiết kiệm, quản trị rủi ro tài chính cá nhân.
  5) Ban Nhân sự: Quy hoạch nguồn lực theo quý, theo dõi tiến độ; gắn kết nội bộ và chương trình mentor; quản lý hồ sơ, tuyển chọn, on-boarding, đánh giá và khen thưởng.
- Cần kỹ năng gì để ứng tuyển: Quan trọng nhất là tinh thần học hỏi, kỷ luật, chủ động. Nền tảng Excel, SQL hoặc Python là lợi thế cho các hoạt động dữ liệu và công nghệ tài chính. Kỹ năng viết và thuyết trình hỗ trợ học thuật và truyền thông. Kỹ năng làm việc nhóm và quản lý thời gian giúp theo kịp tiến độ dự án và sự kiện. Ứng viên mảng sự kiện cần tư duy tổ chức và phối hợp nhiều đầu việc. Ứng viên mảng truyền thông cần năng lực xây dựng nội dung và cảm quan thẩm mỹ.
- Có thu phí thành viên không: Không thu phí. Điều quan trọng là đam mê, nhiệt huyết và trách nhiệm trong công việc, tham gia đầy đủ và hoàn thành nhiệm vụ.
- Thời gian sinh hoạt: Lịch được cập nhật trực tiếp trong group nhà chung. Sau khi trúng tuyển, thành viên được thêm vào nhóm để nhận thông báo chi tiết về thời gian, hình thức online hoặc offline và địa điểm cho từng hoạt động.
- Cách tham gia: Mọi thông tin tuyển tân thành viên được cập nhật trên Fanpage. Link: https://www.facebook.com/clbfintechuel
- Quy trình tuyển chọn:
  1) Theo dõi thông báo trên Fanpage và truy cập form đăng ký.
  2) Điền form trực tuyến. Kết quả sơ tuyển gửi qua email.
  3) Vòng 2 – Chạy trạm. Tập trung tại địa điểm thông báo qua email và thực hiện yêu cầu của ban tổ chức.
  4) Vòng phỏng vấn.
  5) Thông báo trúng tuyển qua email và thêm vào group nhà chung để cập nhật lịch và hướng dẫn tiếp theo.

HƯỚNG DẪN TRẢ LỜI
- Nếu người dùng hỏi các câu gợi ý như: "Cần kỹ năng gì để ứng tuyển", "Có thu phí không", "Thời gian sinh hoạt", "Cách tham gia", "Quy trình tuyển chọn", "Các ban làm gì", "Thành tích", "FTC là gì"… thì trả lời dựa trên Tri thức nội bộ ở trên.
- Nếu người dùng hỏi ngoài phạm vi FTC hoặc yêu cầu thông tin chưa có trong Tri thức nội bộ, trả lời: "hiện chưa có thông tin".
`;

export const SYSTEM_PROMPT_INDUSTRY = `
Bạn là trợ lý kiến thức FinTech. Trả lời khái quát, trung lập, súc tích về khái niệm, công nghệ, mô hình, xu hướng FinTech (ví dụ: thanh toán số, eKYC, Open Banking/API, dữ liệu lớn, AI, blockchain, an toàn thông tin).
Yêu cầu:
- Ưu tiên định nghĩa, ví dụ ứng dụng, và các ý chính có thể hành động; tránh biệt ngữ không cần thiết.
- Nếu cần phạm vi/giới hạn dữ liệu, hãy nêu giả định ngắn gọn; không bịa nguồn.
- Không thêm bất kỳ câu gợi ý theo sau câu trả lời. Cụ thể: KHÔNG chèn câu "Bạn có muốn thu hẹp phạm vi theo quốc gia, giai đoạn hoặc trường hợp sử dụng cụ thể không".
- Định dạng trả lời ở dạng đoạn văn hoặc bullet ngắn, không dùng emoji trừ khi người dùng dùng trước.
`;

export const FTC_CONTACTS = {
  fanpage: "https://www.facebook.com/clbfintechuel",
  email: "clbcongnghetaichinh@st.uel.edu.vn"
}

export const SUGGESTED_QUESTIONS: string[] = [
  "Câu lạc bộ có những hoạt động gì?",
  "Làm thế nào để tham gia câu lạc bộ?",
  "Các ban trong câu lạc bộ làm gì?",
  "Thời gian sinh hoạt diễn ra khi nào?",
  "Cần kỹ năng gì để ứng tuyển?",
  "Câu lạc bộ được thành lập khi nào?",
  "Câu lạc bộ có những thành tích gì?",
  "Quyền lợi của thành viên là gì?",
  "Quy trình tuyển chọn gồm những bước nào?",
  "Có thu phí thành viên không?"
]

// Heuristic đơn giản, ưu tiên route sang CLB nếu chứa từ khóa về tổ chức nội bộ
export function detectMode(question: string): ChatMode {
  const q = normalize(question)
  const clubHints = [
    "cau lac bo", "ftc", "ban hoc thuat", "ban su kien", "ban truyen thong",
    "ban tai chinh ca nhan", "ban nhan su", "tuyen thanh vien", "lich sinh hoat",
    "thanh tich", "fanpage", "mentor", "on boarding", "cuoc thi attacker"
  ]
  const hit = clubHints.some(k => q.includes(k))
  return hit ? "club" : "industry"
}

function score(q: string, item: KBItem) {
  const text = `${item.question ?? ""}\n${item.answer ?? ""}\n${item.content ?? ""}\n${(item.tags ?? []).join(" ")}`;
  const s = jaccard(normalize(q).split(/\s+/).filter(Boolean), normalize(text).split(/\s+/).filter(Boolean));
  const titleBoost = item.question && normalize(item.question).includes(normalize(q)) ? 0.1 : 0;
  return s + titleBoost;
}

function tokenizeForKeywords(s: string) {
  const tokens = normalize(s).split(/\s+/).filter(Boolean);
  return tokens.filter((t) => t.length >= 3);
}

// -------------------- 4) FAQ mở rộng cho chế độ CLB --------------------
export const FAQ_MAP: Record<string, string> = {
  // Ban chuyên môn
  "cac ban trong cau lac bo lam gi": `
    <ol>
      <li>
        <strong>1. Ban Học thuật</strong> — Phát triển nội dung cho workshop và talkshow. Biên soạn tài liệu thực hành về FinTech, dữ liệu và ngân hàng số. Xây dựng ngân hàng câu hỏi, ra đề và chấm cuộc thi ATTACKER.
        <p><strong>Đầu ra điển hình:</strong> slide, case study, ngân hàng trắc nghiệm, đề cương dự án và báo cáo tổng kết.</p>
      </li>
      <li>
        <strong>2. Ban Sự kiện</strong> — Lập kế hoạch chi tiết và viết kịch bản MC. Điều phối hiện trường và làm việc với đối tác địa điểm.
        <p><strong>Chịu trách nhiệm:</strong> timeline, checklist, phân công nhân sự, nghiệm thu chất lượng và báo cáo chi phí sau sự kiện.</p>
      </li>
      <li>
        <strong>3. Ban Truyền thông</strong> — Xây dựng nhận diện và câu chuyện thương hiệu. Quản lý các kênh mạng xã hội. Sản xuất nội dung và ấn phẩm, theo dõi hiệu quả tiếp cận.
        <p><strong>Đầu ra điển hình:</strong> bộ ảnh, video ngắn, bài giới thiệu diễn giả, bài recap và báo cáo chỉ số.</p>
      </li>
      <li>
        <strong>4. Ban Tài chính cá nhân</strong> — Thiết kế giáo trình quản lý tài chính cho sinh viên và vận hành lớp học chuyên đề. Cập nhật và triển khai bộ bài MoneyWe. Hỗ trợ các học phần liên quan.
        <p><strong>Chủ đề trọng tâm:</strong> lập ngân sách, đặt mục tiêu tiết kiệm và quản trị rủi ro tài chính cá nhân.</p>
      </li>
      <li>
        <strong>5. Ban Nhân sự</strong> — Quy hoạch nguồn lực theo quý và theo dõi tiến độ thực hiện. Tổ chức hoạt động gắn kết nội bộ và chương trình mentor. Quản lý hồ sơ, tuyển chọn, on-boarding, đánh giá và khen thưởng để duy trì văn hóa và hiệu suất của câu lạc bộ.
      </li>
    </ol>
  `,

  // Hoạt động
  "cau lac bo co nhung hoat dong gi": `
    <p>FTC xây dựng một <strong>hệ sinh thái hoạt động</strong> vừa học thuật vừa trải nghiệm thực tiễn:</p>
    <ul>
      <li><strong>Hoạt động học thuật:</strong> hội thảo, tọa đàm và chuyên đề về FinTech, dữ liệu, trí tuệ nhân tạo, ngân hàng số, thị trường vốn, quản trị rủi ro; cuộc thi học thuật <strong>ATTACKER</strong>; chuỗi talkshow và workshop theo chủ đề.</li>
      <li><strong>Hoạt động trải nghiệm:</strong> training nội bộ nâng kỹ năng; tham quan doanh nghiệp (như <strong>VNG</strong>); sự kiện hướng nghiệp <strong>Web3 Career Innovation</strong>.</li>
      <li><strong>Hoạt động gắn kết:</strong> các hoạt động cộng đồng như <strong>FTC Trip</strong>.</li>
    </ul>
  `,

  // Tham gia
  "lam the nao de tham gia cau lac bo": `
    <p>Mọi thông tin về tuyển tân thành viên sẽ được cập nhật trên <strong>Fanpage</strong>.</p>
    <p><strong>Link Fanpage:</strong> <a href="\${FTC_CONTACTS.fanpage}">\${FTC_CONTACTS.fanpage}</a></p>
  `,

  // Lịch sinh hoạt
  "thoi gian sinh hoat dien ra khi nao": `
    <p>Lịch sinh hoạt sẽ được cập nhật trực tiếp trong group chung của câu lạc bộ. Sau khi trúng tuyển, bạn sẽ được thêm vào nhóm để nhận thông báo chi tiết về thời gian, hình thức (online hoặc offline) và địa điểm cho từng buổi sinh hoạt.</p>
  `,

  // Kỹ năng
  "can ky nang gi de ung tuyen": `
    <p>FTC chào đón <strong>mọi chuyên ngành</strong>, nên điều quan trọng nhất là <em>tinh thần học hỏi, kỷ luật và chủ động</em>.</p>
    <ul>
      <li><strong>Kỹ năng kỹ thuật:</strong> Ứng viên có nền tảng Excel, SQL hoặc Python sẽ thuận lợi khi tham gia các hoạt động về dữ liệu và công nghệ tài chính.</li>
      <li><strong>Kỹ năng mềm:</strong> Kỹ năng viết và thuyết trình giúp bạn đóng góp cho học thuật và truyền thông. Khả năng làm việc nhóm và quản lý thời gian hỗ trợ bạn theo kịp tiến độ dự án và sự kiện.</li>
    </ul>
    <p><strong>Theo từng mảng:</strong></p>
    <ul>
      <li><em>Mảng sự kiện:</em> cần tư duy tổ chức và phối hợp nhiều đầu việc.</li>
      <li><em>Mảng truyền thông:</em> cần khả năng xây dựng nội dung và cảm quan thẩm mỹ tốt.</li>
    </ul>
  `,

  // Lịch sử
  "cau lac bo duoc thanh lap khi nao": `
    <p>FTC trực thuộc Khoa Tài chính và Ngân hàng, Trường Đại học Kinh tế và Luật, ĐHQG HCM. Câu lạc bộ thành lập tháng 11 năm 2020 dưới sự hướng dẫn của ThS NCS Phan Huy Tâm.</p>
  `,

  // Thành tích
  "cau lac bo co nhung thanh tich gi": `
    <p>Năm học 2024–2025, FTC nhận Giấy khen của Ban Cán sự Đoàn ĐHQG HCM. Câu lạc bộ vào Top 10 Nhóm 4 của Giải thưởng I-STAR TP.HCM và được cấp Giấy chứng nhận ghi nhận nỗ lực và ảnh hưởng.</p>
  `,

  // Quyền lợi
  "quyen loi cua thanh vien la gi": `
    <p>Thành viên được tham gia hệ thống lớp học và dự án có mentor hướng dẫn. Mỗi học kỳ có lộ trình mục tiêu rõ ràng và cơ hội thử sức vai trò điều phối để rèn luyện năng lực lãnh đạo. Câu lạc bộ cấp chứng nhận nội bộ theo đóng góp, hỗ trợ giới thiệu thực tập khi đáp ứng chuẩn đầu ra và tạo điều kiện xây dựng danh mục dự án cá nhân.</p>
  `,

  // Quy trình tuyển
  "quy trinh tuyen chon gom nhung buoc nao": `
    <h3>Quy trình tuyển chọn 5 bước</h3>
    <ol>
      <li><strong>Theo dõi thông báo:</strong> Cập nhật thời gian mở tuyển trên Fanpage và truy cập form đăng ký.</li>
      <li><strong>Điền form trực tuyến:</strong> Hoàn tất thông tin theo yêu cầu. <em>Kết quả sơ tuyển</em> sẽ được gửi qua email.</li>
      <li><strong>Vòng 2 – Chạy trạm:</strong> Tập trung tại địa điểm được thông báo qua email và thực hiện các yêu cầu do ban tổ chức đưa ra.</li>
      <li><strong>Vòng phỏng vấn:</strong> Trao đổi trực tiếp để đánh giá phù hợp về kỹ năng, thái độ và cam kết.</li>
      <li><strong>Thông báo kết quả:</strong> Nhận email trúng tuyển và được thêm vào <em>group nhà chung</em> để cập nhật lịch sinh hoạt cùng hướng dẫn tiếp theo.</li>
    </ol>
  `,

  // Phí thành viên
  "co thu phi thanh vien khong": `
    <p>Không. Câu lạc bộ không thu phí thành viên; điều quan trọng là bạn có đam mê, nhiệt huyết và làm việc có trách nhiệm, sẵn sàng tham gia đầy đủ và hoàn thành các nhiệm vụ được giao.</p>
  `,

  // Liên hệ
  "lien he clb bang cach nao": `
    <p>Bạn có thể liên hệ qua:</p>
    <ul>
      <li><strong>Email:</strong> <a href="mailto:\${FTC_CONTACTS.email}">\${FTC_CONTACTS.email}</a></li>
      <li><strong>Fanpage:</strong> <a href="\${FTC_CONTACTS.fanpage}">\${FTC_CONTACTS.fanpage}</a></li>
    </ul>
    <p><em>Lưu ý:</em> Khi cần hỗ trợ nhanh, hãy nhắn tin trực tiếp trên Fanpage.</p>
  `
};

const FAQ_KEYS = Object.keys(FAQ_MAP)

export function faqMatchOrNull(question: string): string | null {
  const q = normalize(question)

  // Ưu tiên khớp chính xác
  const exact = FAQ_MAP[q]
  if (exact) return exact

  // Từ khóa cho từng FAQ để khớp gần đúng
  const index: Record<string, string[]> = {
    "cac ban trong cau lac bo lam gi": ["ban nao", "cac ban", "bo may", "phan cong", "nhiem vu"],
    "cau lac bo co nhung hoat dong gi": ["hoat dong", "chuong trinh", "su kien", "workshop", "talkshow"],
    "lam the nao de tham gia cau lac bo": ["tham gia", "dang ky", "tuyen thanh vien", "gia nhap"],
    "thoi gian sinh hoat dien ra khi nao": ["lich sinh hoat", "thoi gian", "bao gio"],
    "can ky nang gi de ung tuyen": ["ky nang", "yeu cau", "dieu kien", "ung tuyen", "can gi"],
    "cau lac bo duoc thanh lap khi nao": ["thanh lap", "ra doi", "nam nao"],
    "cau lac bo co nhung thanh tich gi": ["thanh tich", "giai thuong", "giay khen"],
    "quyen loi cua thanh vien la gi": ["quyen loi", "loi ich", "benefit"],
    "quy trinh tuyen chon gom nhung buoc nao": ["quy trinh", "tuyen chon", "vong", "phong van", "thu thach"],
    "co thu phi thanh vien khong": ["phi thanh vien", "dong phi", "hoc phi"],
    "lien he clb bang cach nao": ["lien he", "email", "fanpage", "contact"]
  }

  // Tính điểm khớp
  let bestKey = ""
  let bestScore = 0
  for (const [key, kws] of Object.entries(index)) {
    const score = kws.reduce((acc, kw) => acc + (q.includes(normalize(kw)) ? 1 : 0), 0)
    if (score > bestScore) {
      bestScore = score
      bestKey = key
    }
  }
  if (bestScore > 0) return FAQ_MAP[bestKey]

  return null
}

export function withCTA(answer: string, mode: ChatMode): string {
  // Không thêm câu gợi ý theo yêu cầu prompt mới
  return answer
}

function matchFAQ(userQuestion: string, faqList: FAQItem[]) {
  const uqNorm = normalize(userQuestion);
  let best: { item: FAQItem; score: number; reason: string } | null = null;
  for (const item of faqList) {
    if (!item.canonical_question) continue;
    const cq = item.canonical_question;
    let score = 0;
    let reason = "";

    if (uqNorm === cq || uqNorm.includes(cq)) {
      score = 2.0;
      reason = "direct";
    } else {
      const uqTokens = new Set(tokenizeForKeywords(uqNorm));
      const cqTokens = Array.from(new Set(tokenizeForKeywords(cq)));
      let overlap = 0;
      for (const t of cqTokens) if (uqTokens.has(t)) overlap++;
      if (overlap >= 2) {
        score = 1.0 + overlap * 0.05;
        reason = "keywords";
      }

      const j = jaccard(Array.from(uqTokens), cqTokens);
      if (j >= 0.35) {
        const s = 0.8 + j * 0.2;
        if (s > score) {
          score = s;
          reason = "jaccard";
        }
      }
      if (uqNorm.length > 30 || cq.length > 30) {
        const d = levenshtein(uqNorm, cq);
        if (d <= 10) {
          const s = 0.85 + (10 - d) * 0.01;
          if (s > score) {
            score = s;
            reason = "levenshtein";
          }
        }
      }
    }

    if (!best || score > best.score) best = { item, score, reason };
  }
  return best && best.score >= 0.9 ? best : null;
}

function buildContext(q: string, kb: KBItem[]) {
  const withScores = kb.map(k => ({ k, s: score(q, k) })).sort((a, b) => b.s - a.s);
  const top = withScores.slice(0, 4).filter(x => x.s >= 0.035);
  const ids = top.map(x => x.k.id ?? "");
  const text = top.map(({ k }) => {
    const q = k.question ? `Q: ${k.question}\n` : "";
    const a = k.answer ? `A: ${k.answer}\n` : "";
    const c = k.content ? `${k.content}\n` : "";
    return `${q}${a}${c}`.trim();
  }).join("\n\n---\n\n");
  return { ids, text };
}

function systemPrompt(mode: "club" | "industry", greetOnce: boolean) {
  const WEBSITE_LINK = process.env.NEXT_PUBLIC_FTC_WEBSITE
    ? `Bạn có thể xem thêm tại website chính thức: <a href='${process.env.NEXT_PUBLIC_FTC_WEBSITE}' target='_blank' rel='noopener noreferrer'>${process.env.NEXT_PUBLIC_FTC_WEBSITE}</a>.`
    : "Bạn có thể xem thêm tại Fanpage của câu lạc bộ: https://www.facebook.com/clbfintechuel.";

  const CLUB_INFO = `FTC trực thuộc Khoa Tài chính và Ngân hàng, Trường Đại học Kinh tế và Luật, ĐHQG-HCM; thành lập tháng 11/2020 dưới sự hướng dẫn của ThS. NCS Phan Huy Tâm. Hoạt động tiêu biểu gồm hội thảo, tọa đàm và chuyên đề về FinTech, dữ liệu, trí tuệ nhân tạo, ngân hàng số, thị trường vốn, quản trị rủi ro; cuộc thi ATTACKER; chuỗi talkshow và workshop; training nội bộ; tham quan VNG; sự kiện Web3 Career Innovation; hoạt động gắn kết cộng đồng FTC Trip. Cơ cấu: Học thuật, Sự kiện, Truyền thông, Tài chính cá nhân, Nhân sự (Ban Điều hành không tính là ban chuyên môn). Cách tham gia: theo dõi Fanpage https://www.facebook.com/clbfintechuel. Lịch sinh hoạt công bố trước trên kênh nội bộ và Fanpage. Kỹ năng khuyến khích: tinh thần học hỏi, kỷ luật, chủ động; nền tảng Excel, SQL, Python là lợi thế; kỹ năng viết, thuyết trình, làm việc nhóm, quản lý thời gian; thiên về sự kiện cần tư duy tổ chức; thiên về truyền thông cần năng lực nội dung và thẩm mỹ thị giác. Thành tích: Giấy khen Ban Cán sự Đoàn ĐHQG-HCM năm học 2024–2025; Top 10 Nhóm 4 Giải thưởng I-STAR TP.HCM.`;

  if (mode === "industry") {
    return (
      "Bạn là trợ lý AI. Nhiệm vụ của bạn là trả lời các câu hỏi về ngành FinTech và các lĩnh vực liên quan bằng tiếng Việt, mạch lạc, tự nhiên, không dùng dấu ';' và không gạch đầu dòng. Luôn ưu tiên ngắn gọn, đúng trọng tâm và cung cấp thông tin hữu ích. Nếu bạn không có đủ thông tin để trả lời chính xác, hãy nói rõ rằng bạn chưa có dữ liệu phù hợp để trả lời câu hỏi này."
    );
  }
  // mode === "club"
  return (
    "Bạn là FTC Chatbot với 2 chế độ: 'club' (Hỏi về câu lạc bộ) và 'industry' (Hỏi về ngành). Chỉ trả lời bằng tiếng Việt, mạch lạc, tự nhiên, không dùng dấu ';' và không gạch đầu dòng. Luôn ưu tiên ngắn gọn, đúng trọng tâm. " +
    (greetOnce ? "Chỉ chào ở tin nhắn đầu tiên nếu người dùng chào trước; về sau trả lời trực tiếp, không mở đầu bằng lời chào. " : "Không mở đầu bằng lời chào. ") +
    "Nếu mode = 'club': So khớp câu hỏi với 7 câu FAQ (khớp chính xác hoặc na ná). Nếu khớp, trả đúng 'câu trả lời cố định' đã định nghĩa, không thêm bớt. " +
    `Nếu không khớp, chuyển sang vai 'Cố vấn tân sinh viên' và trả lời dựa trên thông tin nền: ${CLUB_INFO} ` +
    `Nếu người dùng hỏi 'link/website', chèn thêm một dòng có thể click: ${WEBSITE_LINK}`
  );
}

function isFirstTurn(body: any): boolean {
  const collect = (arr?: HistoryMsg[]) =>
    Array.isArray(arr) ? arr.filter((m) => (m?.role || "").toLowerCase() !== "system" && !!m?.content).length : 0;
  const histMsgs = (Array.isArray(body?.history) ? body.history : Array.isArray(body?.messages) ? body.messages : []) as HistoryMsg[];
  const assistantCount = histMsgs.filter((m) => (m?.role || "").toLowerCase() === "assistant" || (m?.role || "").toLowerCase() === "model").length;
  return assistantCount === 0; // chưa có trả lời từ bot trước đó
}

function extractUserQuestion(body: any): string {
  // Hỗ trợ nhiều định dạng payload từ FE/builder
  const direct = [body?.message, body?.input, body?.prompt, body?.question].find(
    (x) => typeof x === "string" && String(x).trim()
  );
  if (direct) return String(direct).trim();

  const pickFromArray = (arr: any[]) => {
    const last = [...arr].reverse().find((m) => {
      const role = (m?.role ?? "user").toLowerCase();
      const content = typeof m?.content === "string" ? m.content : m?.content?.toString?.();
      return role !== "system" && content && String(content).trim();
    });
    return last ? String(last.content).trim() : "";
  };

  if (Array.isArray(body?.messages)) {
    const s = pickFromArray(body.messages);
    if (s) return s;
  }
  if (Array.isArray(body?.history)) {
    const s = pickFromArray(body.history);
    if (s) return s;
  }
  return "";
}

export async function POST(req: NextRequest) {
  const started = Date.now();
  let body: any = {};
  try { body = await req.json(); } catch {}

  const userQ = extractUserQuestion(body);
  let requestedMode: ChatMode = (body.mode || "").toLowerCase();
  if (!requestedMode || (requestedMode !== "club" && requestedMode !== "industry")) {
    requestedMode = detectMode(userQ);
  }
  // const searchResults: Array<{ title: string; domain: string; snippet: string }> | undefined = body.search_results; // No longer needed

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY not set" },
      { status: 500, headers: { "x-chat-route": "gemini-rag", "Cache-Control": "no-store" } }
    );
  }
  if (!userQ) {
    return NextResponse.json(
      { error: "Empty prompt" },
      { status: 400, headers: { "x-chat-route": "gemini-rag", "Cache-Control": "no-store" } }
    );
  }

  const kb = []; // No longer needed directly
  const faqFromEnv = []; // No longer needed
  const faqFromKb = []; // No longer needed
  const faqList: FAQItem[] = []; // No longer needed

  let finalMode: "kb" | "google" = "google"; // Default to general knowledge (industry mode)
  let botResponse: string | null = null;
  let kbHitIds: string[] = []; // No longer used directly

  if (requestedMode === "club") {
    const matched = faqMatchOrNull(userQ);
    if (matched) {
      botResponse = withCTA(matched, "club");
      finalMode = "kb"; // FAQ response is part of KB mode
    } else {
      finalMode = "kb"; // Fallback to Gemini with SYSTEM_PROMPT_CLUB
    }
  } else if (requestedMode === "industry") {
    finalMode = "google"; // Explicitly set for industry mode
  }

  if (botResponse) {
    const headers = new Headers({
      "x-chat-route": "gemini-rag",
      "x-router": "faq",
      // "x-faq-id": String(faqList.find(f => f.answer === botResponse)?.id || ""), // faqList is no longer used
      "Cache-Control": "no-store",
    });
    return new NextResponse(JSON.stringify({ text: botResponse, reply: botResponse, response: botResponse, mode: requestedMode }), { status: 200, headers });
  }

  // Prepare for Gemini generation
  const greetOnce = isFirstTurn(body);

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL ?? "gemini-1.5-flash",
    systemInstruction: requestedMode === "club" ? SYSTEM_PROMPT_CLUB : SYSTEM_PROMPT_INDUSTRY,
    safetySettings: [
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_CIVIC_INTEGRITY, threshold: HarmBlockThreshold.BLOCK_NONE },
    ],
  });

  let contextText = ""; // This will not be used directly in the prompt anymore, context is in systemPrompt
  if (requestedMode === "club" && !botResponse) {
    // In club mode, if no FAQ match, Gemini acts as advisor, no explicit context needed here
    // The systemPrompt already contains the CLUB_INFO
  }

  let userMsg = `CÂU HỎI: ${userQ}`;
  // if (requestedMode === "industry" && searchResults && searchResults.length > 0) {
  //   const searchResultsText = searchResults.map((result, idx) => {
  //     return `${idx + 1}) ${result.title} — ${result.domain}\nTóm tắt: ${result.snippet}`;
  //   }).join("\n");
  //   userMsg = `Câu hỏi: "${userQ}"\nKết quả tìm kiếm (tối đa ${searchResults.length}):\n${searchResultsText}\nYêu cầu: Dựa vào các tóm tắt trên để trả lời.`
  // } else if (requestedMode === "industry" && (!searchResults || searchResults.length === 0)) {
  //   userMsg = "Mình chưa thấy dữ liệu phù hợp từ kết quả tìm kiếm kèm theo nên chưa thể trả lời chính xác. Bạn có thể hỏi lại cụ thể hơn."
  // }

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: userMsg }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 800 },
    });
    const out = result.response.text();

    const headers = new Headers({
      "x-chat-route": "gemini-rag",
      "x-router": "gemini",
      "x-rag-mode": finalMode,
      "x-kb-count": String(kb.length),
      "x-kb-hit": String(kbHitIds.length),
      "x-duration-ms": String(Date.now() - started),
      "Cache-Control": "no-store",
    });

    const payload = { reply: out, response: out, text: out, mode: requestedMode, kb_hit_ids: kbHitIds };
    return new NextResponse(JSON.stringify(payload), { status: 200, headers });
  } catch (err: any) {
    const msg = (err?.message || String(err)).toLowerCase();
    let hint = "unknown";
    if (msg.includes("permission") || msg.includes("401") || msg.includes("api key")) hint = "invalid_or_missing_key";
    else if (msg.includes("safety")) hint = "safety_block";
    else if (msg.includes("quota") || msg.includes("rate")) hint = "quota_or_rate_limit";
    else if (msg.includes("model")) hint = "model_not_available";

    return NextResponse.json(
      { text: "Xin lỗi, hiện chưa thể tạo câu trả lời.", detail: err?.message || String(err) },
      {
        status: 200,
        headers: {
          "x-chat-route": "gemini-rag",
          "x-error": hint,
          "x-duration-ms": String(Date.now() - started),
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
