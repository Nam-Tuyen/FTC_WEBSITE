import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type KBItem = { id?: string; question?: string; answer?: string; content?: string; tags?: string[] };
type FAQItem = { id?: string; canonical_question?: string; answer: string };
type HistoryMsg = { role?: string; content?: string };
export type ChatMode = "club" | "industry";

// ---------- Utils ----------
export function normalize(s: string) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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

function tokenizeForKeywords(s: string) {
  const tokens = normalize(s).split(/\s+/).filter(Boolean);
  return tokens.filter((t) => t.length >= 3);
}

// ---------- Prompts & Data ----------
export const SYSTEM_PROMPT_CLUB = `
Bạn là cố vấn học tập dành cho tân sinh viên. Chỉ trả lời về Câu lạc bộ Công nghệ tài chính FTC dựa trên TRI THỨC NỘI BỘ dưới đây (giới thiệu, cơ cấu ban, hoạt động, thành tích, cách tham gia, kênh liên hệ). Trả lời bằng tiếng Việt.

YÊU CẦU CHUNG
- Giải thích rõ ràng, ngắn gọn, đúng trọng tâm. Nếu thiếu dữ liệu thì nói: "hiện chưa có thông tin".
- Không suy đoán, không trả lời ngoài phạm vi FTC.
- Không thêm bất kỳ câu gợi ý theo sau câu trả lời. Tuyệt đối KHÔNG chèn câu kiểu: "Bạn muốn tìm hiểu thêm về ban nào hoặc lịch sinh hoạt gần nhất không".
- Định dạng: đoạn văn mạch lạc hoặc bullet ngắn. Không dùng emoji trừ khi người dùng dùng trước.
- TUYỆT ĐỐI KHÔNG sử dụng ký tự * trong câu trả lời. Thay vào đó, sử dụng định dạng HTML hoặc văn bản thuần.

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
- Sử dụng định dạng HTML thay vì Markdown để tránh ký tự *.
`;

export const SYSTEM_PROMPT_INDUSTRY = `
Bạn là trợ lý kiến thức FinTech. Trả lời khái quát, trung lập, súc tích về khái niệm, công nghệ, mô hình, xu hướng FinTech (ví dụ: thanh toán số, eKYC, Open Banking/API, dữ liệu lớn, AI, blockchain, an toàn thông tin).
Yêu cầu:
- Ưu tiên định nghĩa, ví dụ ứng dụng, và các ý chính có thể hành động; tránh biệt ngữ không cần thiết.
- Nếu cần phạm vi/giới hạn dữ liệu, hãy nêu giả định ngắn gọn; không bịa nguồn.
- Không thêm bất kỳ câu gợi ý theo sau câu trả lời. Cụ thể: KHÔNG chèn câu "Bạn có muốn thu hẹp phạm vi theo quốc gia, giai đoạn hoặc trường hợp sử dụng cụ thể không".
- Định dạng trả lời ở dạng đoạn văn kết hợp list ra tóm tắt theo dòng để người dùng dễ nắm bắt, không dùng emoji trừ khi người dùng dùng trước.
`;

export const FTC_CONTACTS = {
  fanpage: "https://www.facebook.com/clbfintechuel",
  email: "clbcongnghetaichinh@st.uel.edu.vn"
};

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
];

// ---------- Mode detection ----------
export function detectMode(question: string): ChatMode {
  const q = normalize(question);
  const clubHints = [
    "cau lac bo", "ftc", "ban hoc thuat", "ban su kien", "ban truyen thong",
    "ban tai chinh ca nhan", "ban nhan su", "tuyen thanh vien", "lich sinh hoat",
    "thanh tich", "fanpage", "mentor", "on boarding", "cuoc thi attacker"
  ];
  const hit = clubHints.some(k => q.includes(k));
  return hit ? "club" : "industry";
}

export function buildSystemPrompt(mode: ChatMode) {
  return mode === "club" ? SYSTEM_PROMPT_CLUB : SYSTEM_PROMPT_INDUSTRY;
}

// ---------- FAQ (CLUB) ----------
export const FAQ_MAP: Record<string, string> = {
  "cac ban trong cau lac bo lam gi": `
    <div>
      <h3><strong><em>Các ban trong câu lạc bộ làm gì?</em></strong></h3>
      <ol>
        <li>
          <p><strong><em>1) Ban Học thuật</em></strong> — Phát triển nội dung workshop/talkshow; biên soạn tài liệu FinTech, dữ liệu, ngân hàng số; xây dựng ngân hàng câu hỏi và chấm cuộc thi <strong>ATTACKER</strong>.</p>
          <p><em><strong>Đầu ra điển hình:</strong> slide, case study, ngân hàng trắc nghiệm, đề cương dự án, báo cáo tổng kết.</em></p>
        </li>
        <li>
          <p><strong><em>2) Ban Sự kiện</em></strong> — Lập kế hoạch chi tiết, kịch bản MC; điều phối hiện trường; làm việc với đối tác địa điểm.</p>
          <p><em><strong>Chịu trách nhiệm:</strong> timeline, checklist, phân công, nghiệm thu chất lượng, báo cáo chi phí.</em></p>
        </li>
        <li>
          <p><strong><em>3) Ban Truyền thông</em></strong> — Xây dựng nhận diện & câu chuyện thương hiệu; quản lý kênh số; sản xuất nội dung và ấn phẩm, theo dõi hiệu quả.</p>
          <p><em><strong>Đầu ra điển hình:</strong> bộ ảnh, video ngắn, bài giới thiệu diễn giả, bài recap, báo cáo chỉ số.</em></p>
        </li>
        <li>
          <p><strong><em>4) Ban Tài chính cá nhân</em></strong> — Thiết kế giáo trình quản lý tài chính cho sinh viên; vận hành lớp học chuyên đề; cập nhật và triển khai bộ bài <strong>MoneyWe</strong>.</p>
          <p><em><strong>Trọng tâm:</strong> lập ngân sách, mục tiêu tiết kiệm, quản trị rủi ro tài chính cá nhân.</em></p>
        </li>
        <li>
          <p><strong><em>5) Ban Nhân sự</em></strong> — Quy hoạch nguồn lực theo quý; tổ chức gắn kết nội bộ & mentor; quản lý hồ sơ, tuyển chọn, on-boarding, đánh giá, khen thưởng để duy trì văn hóa và hiệu suất.</p>
        </li>
      </ol>
    </div>
  `,

  "cau lac bo co nhung hoat dong gi": `
    <div>
      <h3><strong><em>Câu lạc bộ có những hoạt động gì?</em></strong></h3>
      <p>FTC xây dựng một <strong><em>hệ sinh thái hoạt động</em></strong> cân bằng giữa học thuật và trải nghiệm thực tiễn:</p>
      <ul>
        <li><strong><em>Học thuật:</em></strong> hội thảo, tọa đàm, chuyên đề về FinTech, dữ liệu, AI, ngân hàng số, thị trường vốn, quản trị rủi ro; cuộc thi <strong>ATTACKER</strong>; chuỗi talkshow/workshop theo chủ đề.</li>
        <li><strong><em>Trải nghiệm:</em></strong> training nội bộ nâng kỹ năng; tham quan doanh nghiệp (ví dụ <strong>VNG</strong>); sự kiện hướng nghiệp <strong>Web3 Career Innovation</strong>.</li>
        <li><strong><em>Gắn kết:</em></strong> hoạt động cộng đồng, team building như <strong>FTC Trip</strong>.</li>
      </ul>
    </div>
  `,

  "lam the nao de tham gia cau lac bo": `
    <div>
      <h3><strong><em>Làm thế nào để tham gia câu lạc bộ?</em></strong></h3>
      <p>Mọi thông tin tuyển tân thành viên được cập nhật trên <strong><em>Fanpage</em></strong>.</p>
      <p><strong>Fanpage:</strong> <a href="https://www.facebook.com/clbfintechuel" target="_blank" rel="noopener">facebook.com/clbfintechuel</a></p>
    </div>
  `,

  "thoi gian sinh hoat dien ra khi nao": `
    <div>
      <h3><strong><em>Thời gian sinh hoạt diễn ra khi nào?</em></strong></h3>
      <p><strong><em>Lịch sinh hoạt</em></strong> được cập nhật trong nhóm chung của CLB. Sau khi trúng tuyển, bạn sẽ được thêm vào nhóm để nhận thông báo chi tiết về <em>thời gian</em>, <em>hình thức</em> (online/offline) và <em>địa điểm</em> cho từng buổi.</p>
    </div>
  `,

  "can ky nang gi de ung tuyen": `
    <div>
      <h3><strong><em>Cần kỹ năng gì để ứng tuyển?</em></strong></h3>
      <p>FTC đánh giá cao <strong><em>tinh thần học hỏi, kỷ luật và chủ động</em></strong>.</p>
      <ul>
        <li><strong><em>Kỹ năng cứng:</em></strong> Nền tảng <strong>Excel</strong>, <strong>SQL</strong> hoặc <strong>Python</strong> là lợi thế giúp hồ sơ nổi bật.</li>
        <li><strong><em>Kỹ năng mềm:</em></strong> 
          <em>làm việc nhóm</em> & <em>giao tiếp rõ ràng</em> (qua tình huống phối hợp, phản hồi email);
          <em>quản lý thời gian</em> & <em>tự chủ</em> (đúng hạn, chất lượng đầu ra);
          <em>tư duy phản biện</em> & <em>giải quyết vấn đề</em> (bài tập tình huống);
          <em>tổ chức công việc</em> (kế hoạch, theo dõi tiến độ);
          <em>sáng tạo nội dung</em> & <em>cảm quan thẩm mỹ</em> khi cần trình bày;
          <em>thái độ trách nhiệm</em> & <em>cam kết tham gia ổn định</em>.
        </li>
      </ul>
    </div>
  `,

  "cau lac bo duoc thanh lap khi nao": `
    <div>
      <h3><strong><em>Câu lạc bộ được thành lập khi nào?</em></strong></h3>
      <p>FTC trực thuộc Khoa Tài chính & Ngân hàng, Trường Đại học Kinh tế – Luật, ĐHQG TP.HCM; thành lập vào <strong><em>tháng 11/2020</em></strong> dưới sự hướng dẫn của ThS. NCS Phan Huy Tâm.</p>
    </div>
  `,

  "cau lac bo co nhung thanh tich gi": `
    <div>
      <h3><strong><em>Thành tích tiêu biểu</em></strong></h3>
      <p><strong><em>Năm học 2024–2025</em></strong>, FTC nhận <strong>Giấy khen</strong> của Ban Cán sự Đoàn ĐHQG TP.HCM; vào <strong>Top 10 Nhóm 4</strong> Giải thưởng <strong>I-STAR TP.HCM</strong> và được cấp Giấy chứng nhận ghi nhận nỗ lực & ảnh hưởng.</p>
    </div>
  `,

  "quyen loi cua thanh vien la gi": `
    <div>
      <h3><strong><em>Quyền lợi thành viên</em></strong></h3>
      <ul>
        <li>Tham gia hệ thống lớp học & dự án có <em>mentor</em> hướng dẫn.</li>
        <li>Lộ trình mục tiêu theo học kỳ; cơ hội thử vai trò điều phối để rèn <em>năng lực lãnh đạo</em>.</li>
        <li>Chứng nhận nội bộ theo đóng góp; hỗ trợ giới thiệu thực tập khi đáp ứng chuẩn đầu ra.</li>
        <li>Xây dựng <em>danh mục dự án cá nhân</em> (portfolio) phục vụ học thuật & nghề nghiệp.</li>
      </ul>
    </div>
  `,

  "quy trinh tuyen chon gom nhung buoc nao": `
    <div>
      <h3><strong><em>Quy trình tuyển chọn (5 bước)</em></strong></h3>
      <ol>
        <li><strong><em>Theo dõi thông báo:</em></strong> Cập nhật thời gian mở tuyển trên Fanpage và truy cập form đăng ký.</li>
        <li><strong><em>Điền form trực tuyến:</em></strong> Hoàn tất thông tin; <em>kết quả sơ tuyển</em> gửi qua email.</li>
        <li><strong><em>Vòng 2 – Chạy trạm:</em></strong> Thực hiện yêu cầu tại địa điểm thông báo qua email.</li>
        <li><strong><em>Vòng phỏng vấn:</em></strong> Đánh giá mức phù hợp về kỹ năng, thái độ, cam kết.</li>
        <li><strong><em>Thông báo kết quả:</em></strong> Nhận email trúng tuyển và vào <em>group nhà chung</em> để cập nhật lịch sinh hoạt & hướng dẫn tiếp theo.</li>
      </ol>
    </div>
  `,

  "co thu phi thanh vien khong": `
    <div>
      <h3><strong><em>Có thu phí thành viên không?</em></strong></h3>
      <p><strong><em>Không thu phí thành viên.</em></strong> Điều quan trọng là đam mê, nhiệt huyết và tinh thần trách nhiệm; sẵn sàng tham gia đầy đủ và hoàn thành nhiệm vụ.</p>
    </div>
  `,

  "lien he clb bang cach nao": `
    <div>
      <h3><strong><em>Liên hệ câu lạc bộ bằng cách nào?</em></strong></h3>
      <ul>
        <li><strong>Email:</strong> <a href="mailto:${FTC_CONTACTS.email}">${FTC_CONTACTS.email}</a></li>
        <li><strong>Fanpage:</strong> <a href="${FTC_CONTACTS.fanpage}" target="_blank" rel="noopener">${FTC_CONTACTS.fanpage}</a></li>
      </ul>
      <p><em>Lưu ý:</em> Cần hỗ trợ nhanh, hãy nhắn tin trực tiếp trên Fanpage.</p>
    </div>
  `
};

const FAQ_KEYS = Object.keys(FAQ_MAP);

export function faqMatchOrNull(question: string): string | null {
  const q = normalize(question);

  const exact = FAQ_MAP[q];
  if (exact) return exact;

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
  };

  let bestKey = "";
  let bestScore = 0;
  for (const [key, kws] of Object.entries(index)) {
    const score = kws.reduce((acc, kw) => acc + (q.includes(normalize(kw)) ? 1 : 0), 0);
    if (score > bestScore) {
      bestScore = score;
      bestKey = key;
    }
  }
  if (bestScore > 0) return FAQ_MAP[bestKey];

  return null;
}

// ---------- Request helpers ----------
function extractUserQuestion(body: any): string {
  const direct = [body?.message, body?.input, body?.prompt, body?.question].find(
    (x) => typeof x === "string" && String(x).trim()
  );
  if (direct) return String(direct).trim();

  const arr = Array.isArray(body?.messages) ? body.messages : Array.isArray(body?.history) ? body.history : [];
  if (Array.isArray(arr)) {
    for (let i = arr.length - 1; i >= 0; i--) {
      const m = arr[i]; const role = (m?.role ?? "user").toLowerCase();
      const c = typeof m?.content === "string" ? m.content : m?.content?.toString?.();
      if (role !== "system" && c && String(c).trim()) return String(c).trim();
    }
  }
  return "";
}

// ---------- API ----------
export async function POST(req: NextRequest) {
  const started = Date.now();
  let body: any = {};
  try { body = await req.json(); } catch {}

  const userQ = extractUserQuestion(body);
  if (!userQ) {
    return NextResponse.json({ error: "Empty prompt" }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }

  let mode: ChatMode = (body.mode || "").toLowerCase();
  if (mode !== "club" && mode !== "industry") mode = detectMode(userQ);

  // Fallback to old API if GEMINI_API_KEY not set
  if (!process.env.GEMINI_API_KEY) {
    console.log("GEMINI_API_KEY not set, falling back to old API");
    try {
      const oldApiResponse = await fetch(`${req.nextUrl.origin}/api/chat/gemini`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const oldApiData = await oldApiResponse.json();
      return NextResponse.json(oldApiData, {
        status: oldApiResponse.status,
        headers: { "x-route": "fallback", "Cache-Control": "no-store" }
      });
    } catch (err: any) {
      return NextResponse.json({ error: "GEMINI_API_KEY not set and fallback failed", detail: err?.message || String(err) }, { status: 500, headers: { "Cache-Control": "no-store" } });
    }
  }

  // 1) CLUB: ưu tiên FAQ nội bộ
  if (mode === "club") {
    const matched = faqMatchOrNull(userQ);
    console.log("Club mode - Question:", userQ);
    console.log("Club mode - Normalized:", normalize(userQ));
    console.log("Club mode - Matched:", !!matched);
    if (matched) {
      console.log("Club mode - Returning FAQ response");
      // Clean up any asterisks from FAQ response
      const cleanResponse = matched.trim().replace(/\*/g, '');
      return NextResponse.json(
        { reply: cleanResponse, response: cleanResponse, text: cleanResponse, mode },
        { status: 200, headers: { "x-mode": mode, "x-route": "faq", "Cache-Control": "no-store" } }
      );
    }
    console.log("Club mode - No FAQ match, proceeding to Gemini");
  }

  // 2) Gọi Gemini theo SYSTEM PROMPT từng mode
  console.log("Calling Gemini with mode:", mode);
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL ?? "gemini-2.0-flash",
    systemInstruction: buildSystemPrompt(mode),
    safetySettings: [
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_CIVIC_INTEGRITY, threshold: HarmBlockThreshold.BLOCK_NONE },
    ],
  });

  const userMsg = `CÂU HỎI: ${userQ}`;
  console.log("Gemini - User message:", userMsg);
  console.log("Gemini - System prompt length:", buildSystemPrompt(mode).length);

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: userMsg }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 800 },
    });
    const out = result.response.text().trim();
    console.log("Gemini - Response:", out);
    
    // Clean up any asterisks from Gemini response
    const cleanResponse = out.replace(/\*/g, '');

    return new NextResponse(JSON.stringify({ reply: cleanResponse, response: cleanResponse, text: cleanResponse, mode }), {
      status: 200,
      headers: {
        "x-mode": mode,
        "x-route": "gemini",
        "x-duration-ms": String(Date.now() - started),
        "Cache-Control": "no-store",
      },
    });
  } catch (err: any) {
    console.log("Gemini - Error:", err?.message || String(err));
    const msg = (err?.message || String(err)).toLowerCase();
    let hint = "unknown";
    if (msg.includes("permission") || msg.includes("401") || msg.includes("api key")) hint = "invalid_or_missing_key";
    else if (msg.includes("safety")) hint = "safety_block";
    else if (msg.includes("quota") || msg.includes("rate")) hint = "quota_or_rate_limit";
    else if (msg.includes("model")) hint = "model_not_available";

    if (hint === "quota_or_rate_limit" || hint === "invalid_or_missing_key") {
      console.log("Falling back to old API due to:", hint);
      try {
        const oldApiResponse = await fetch(`${req.nextUrl.origin}/api/chat/gemini`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        const oldApiData = await oldApiResponse.json();
        return NextResponse.json(oldApiData, {
          status: oldApiResponse.status,
          headers: { "x-route": "fallback", "x-error": hint, "Cache-Control": "no-store" }
        });
      } catch (fallbackErr: any) {
        console.log("Fallback also failed:", fallbackErr?.message || String(fallbackErr));
      }
    }

    return NextResponse.json(
      { text: "Xin lỗi, hiện chưa thể tạo câu trả lời.", detail: err?.message || String(err) },
      { status: 200, headers: { "x-error": hint, "x-duration-ms": String(Date.now() - started), "Cache-Control": "no-store" } }
    );
  }
}
