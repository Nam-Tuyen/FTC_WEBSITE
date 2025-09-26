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

- FTC là viết tắt Finance and Technology Club
- FTC có các hoạt động thể thao như bóng chuyền, bóng đá và cầu lông. Đặc biệt bạn nào thích thể thao trí tuệ thì có thể chơi Poker
- FTC cũng đồng thời có nhận phát người yêu nữa nhé mà họ chịu hay không thì ở bạn

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
- Định dạng trả lời ở dạng đoạn văn kết hợp list phải có bulllet point ở mỗi dòng để tóm tắt ý chính giúp người dùng dễ nắm bắt, không dùng emoji trừ khi người dùng dùng trước. Đồng thời kết hợp sử dụng in nghiêng in đậm để trình bày rõ ràng hơn.
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

// ---------- FAQ (CLUB) - No <h3> ----------
export const FAQ_MAP: Record<string, string> = {
  "cau lac bo co nhung hoat dong gi": `
     <div> 
      <p>Câu lạc bộ FTC chú trọng xây dựng hệ sinh thái hoạt động đa dạng, cân bằng giữa học thuật, thực hành và gắn kết cộng đồng với rất nhiều hoạt động tiêu biểu sau: </p>
      <ul>
        <li><strong> • Cuộc thi ATTACKER:</strong> Cuộc thi học thuật thường niên về công nghệ tài chính hiện đại, phát triển tư duy sản phẩm và nghiên cứu ứng dụng.</li>
        <li><strong> • Talkshow:</strong> Các buổi nói chuyện, trao đổi với chuyên gia về Blockchain, AI, chứng khoán công nghệ, ngân hàng số.</li>
        <li><strong> • Tham quan doanh nghiệp:</strong> Các buổi thăm quan, trải nghiệm môi trường làm việc (ví dụ VNG), kết nối với nhà tuyển dụng và lãnh đạo.</li>
        <li><strong> • FTC Training & Sharing</strong> Các buổi đào tạo nội bộ từ cơ bản đến nâng cao, rèn kỹ năng nghề nghiệp, chia sẻ kinh nghiệm thực tế.</li>
        <li><strong> • Career Day – Web3 Career Innovation:</strong> Các buổi giao lưu doanh nghiệp kết hợp phỏng vấn và nhận CV hỗ trợ tìm việc làm.</li>
        <li><strong> • Workshop chuyên sâu:</strong> Các buổi đào tạo thực hành chuyên sâu đến từ phía doanh nghiệp giúp các bạn nắm vững được nền tảng kiến thức.</li>
        <li><strong> • FTC Trip:</strong> Các buổi đi chơi bonding gắn kết giúp các bạn xả stress sau một thời gian dài hoạt động.</li>
      </ul>
     </div>
  `,

  "lam the nao de tham gia cau lac bo": `
    <div>
      <p>Để tham gia câu lạc bộ FTC các bạn có thể thực hiện các bước sau: </p>
      <ul>
        <li><strong>• Theo dõi kênh:</strong> cập nhật thông báo tuyển trên Fanpage/Instagram của FTC.</li>
        <li><strong>• Đăng ký form:</strong> điền thông tin cá nhân, sở thích, mong muốn tham gia.</li>
        <li><strong>• Phỏng vấn đầu vào:</strong> trao đổi với Ban Nhân sự & Ban Điều hành về nguyện vọng, kỹ năng, sự phù hợp với từng ban.</li>
        <li><strong>• Kết quả:</strong> công bố trúng tuyển và phân bổ vào 1 trong 5 ban.</li>
      </ul>
      <p><em>Lưu ý: FTC quan trọng nhất là tinh thần học hỏi, không quan trọng việc "giỏi sẵn".</em></p>
    </div>
  `,

  "cac ban trong cau lac bo lam gi": `
   <div>
      <p>FTC có 5 ban chuyên môn (không tính Ban Điều hành). Mỗi ban có chức năng riêng và phối hợp chặt chẽ như sau:</p>
      <ul>
        <li><strong> • Ban Học thuật:</strong> Xây dựng nội dung workshop/talkshow, ra đề ATTACKER, biên soạn tài liệu học thuật về phân tích dữ liệu, ngân hàng số, thuật toán giao dịch.</li>
        <li><strong> • Ban Sự kiện:</strong> Xây dựng timeline, kịch bản MC, điều phối hiện trường, soạn kế hoạch và báo cáo tổng kết.</li>
        <li><strong> • Ban Truyền thông:</strong> Phụ trách ấn phẩm, nội dung fanpage, video recap, poster, chiến dịch truyền thông.</li>
        <li><strong> • Ban Tài chính cá nhân:</strong> Phụ trách mảng tài chính cá nhân trong câu lạc bộ thông qua các hoạt động như MoneyWe, workshop kỹ năng quản lý chi tiêu, tích hợp FinTech vào tài chính cá nhân.</li>
        <li><strong> • Ban Nhân sự:</strong>Chịu trách nhiệm phân công công việc, làm dự trù kinh phí đồng thời nắm các vấn đề về nhân sự trong câu lạc bộ.</li>
      </ul>
  </div>
  `,

  "can ky nang gi de ung tuyen": `
    <div>
      <p>Không yêu cầu chuyên môn cao ngay từ đầu mà FTC đề cao nhất nhất:</p>
      <ul>
        <li><strong><em>• Tinh thần học hỏi & kỷ luật:</em></strong> sẵn sàng tìm tòi, tôn trọng deadline.</li>
        <li><strong><em>• Làm việc nhóm:</em></strong> đa số hoạt động triển khai theo nhóm.</li>
        <li><strong><em>• Thái độ tích cực:</em></strong> chủ động, cởi mở, sẵn sàng đóng góp.</li>
      </ul>
      <p>Yêu cầu bổ sung theo từng ban:</p>
      <ul>
        <li><strong>• Học thuật:</strong> Phân tích dữ liệu, viết nội dung, khả năng nghiên cứu.</li>
        <li><strong>• Sự kiện:</strong> Quản lý timeline, giao tiếp, tổ chức.</li>
        <li><strong>• Truyền thông:</strong> Viết content, thiết kế, chỉnh sửa ảnh/video.</li>
        <li><strong>• Tài chính cá nhân:</strong> Kiến thức quản lý chi tiêu, sáng tạo hoạt động.</li>
        <li><strong>• Nhân sự:</strong> Làm việc nhóm, năng động và gắn kết nội bộ.</li>
      </ul>
    </div>
  `,

  "cau lac bo duoc thanh lap khi nao": `
    <div>
      <p>FTC thành lập <strong>tháng 11/2020</strong>, trực thuộc Khoa Tài chính – Ngân hàng, Trường Đại học Kinh tế – Luật, ĐHQG-HCM dưới sự hướng dẫn của thầy <strong>ThS. NCS Phan Huy Tâm</strong>. Từ đó đến nay, FTC là một trong các CLB học thuật tiên phong và đi đầu về lĩnh vực công nghệ tài chính trong trong môi trừng Đại học trên cả nước.</p>
    </div>
  `,

  "cau lac bo co nhung thanh tich gi": `
    <div>
      <p> Trong năm 2024 - 2025 vừa qua thì câu lạc bộ FTC có vinh dự nhận được những thành tích sau:</p>
      <ul>
        <li> • Giấy khen của Ban Cán sự Đoàn ĐHQG-HCM vì đóng góp tích cực cho công tác Đoàn & phong trào thanh niên.</li>
        <li> • Giải thưởng I-STAR TP.HCM với thành tích Top 10 Nhóm 4 (tổ chức/cá nhân hỗ trợ khởi nghiệp) do Sở Khoa học Công nghệ TP.HCM chủ trì nhằm tôn vinh đóng góp cho đổi mới sáng tạo.</li>
      </ul>
      <p>Những thành tích này đã giúp khẳng định vai trò tiên phong của FTC trong hệ sinh thái học thuật và khởi nghiệp trong lĩnh vực FinTech.</p>
    </div>
  `,

  "quyen loi cua thanh vien la gi": `
    <div>
      <p> Các bạn tân sinh viên khi tham gia vào câu lạc bộ sẽ được các lợi ích như sau:</p>
      <ul>
        <li><strong>• Học tập:</strong> Được trau dòi kiến thức về lĩnh vực FinTech, blockchain, AI trong tài chính, quản trị rủi ro, giao dịch theo thuật toán đồng thời có cơ họi tham gia nghiên cứu khoa học để nâng cao chuyên môn học thuật.</li>
        <li><strong>• Thực hành:</strong> Các bạn sẽ có cơ hội đi tham gia nhiều dự án, thi học thuật, được kiến tập và thực tập tại các công ty trong ngành.</li>
        <li><strong>• Nghề nghiệp:</strong> Các bạn sẽ được đi tham quan doanh nghiệp, chuỗi Career Day giúp nâng caoo CV và tìm kiếm cơ hội việc làm.</li>
        <li><strong>• Kỹ năng:</strong> Bạn sẽ được trau dồi khả năng teamwork, quản lý dự án, truyền thông, thiết kế nội dung, tư duy phản biện.</li>
        <li><strong>• Cộng đồng:</strong> Khi vào FTC bạn sẽ được trải nghiệm môi trường cởi mở, năng động, gắn kết như gia đình.</li>
      </ul>
    </div>
  `,

  "quy trinh tuyen chon gom nhung buoc nao": `
    <div>
      <p>Quy trình tuyển chọn gồm các bước sau:</p>
      <ul>
        <li><strong><em> • Đăng ký form:</em></strong> điền thông tin cá nhân, kỹ năng, mong muốn.</li>
        <li><strong><em> • Chạy trạm:</em></strong> Bạn sẽ đến và tham gia tuyển tân thành viên trực tiếp tại trường với các thử thách do anh chị đề ra.</li>
        <li><strong><em> • Phỏng vấn:</em></strong> trao đổi trực tiếp với ban phụ trách để đánh giá phù hợp.</li>
        <li><strong><em> • Kết quả:</em></strong> công bố trúng tuyển, phân bổ vào các ban.</li>
      </ul>
      <p><em>Nguyên tắc: Đánh giá công bằng, minh bạch dựa trên thái độ, tinh thần học hỏi và mức độ phù hợp với hoạt động CLB.</em></p>
    </div>
  `,

  "co thu phi thanh vien khong": `
    <div>
      <p>FTC là CLB học thuật phi lợi nhuận, trực thuộc Đoàn – Hội sinh viên Trường nên câu lạc bộ không hề thu phí tham gia nhé. FTCer chỉ cần đóng góp tinh thần, nhiệt huyết, trách nhiệm, không cần lo chi phí khi tham gia CLB!</p>
    </div>
  `
};


const FAQ_KEYS = Object.keys(FAQ_MAP);

export function faqMatchOrNull(question: string): string | null {
  const q = normalize(question);

  const exact = FAQ_MAP[q];
  if (exact) return exact;

  const index: Record<string, string[]> = {
    "cac ban trong cau lac bo lam gi": ["cac ban", "ban nao", "bo may", "phan cong", "nhiem vu", "ban hoc thuat", "ban su kien", "ban truyen thong"],
    "cau lac bo co nhung hoat dong gi": ["cau lac bo co nhung", "hoat dong gi", "nhung hoat dong", "hoat dong nao", "chuong trinh nao", "cau lac bo co nhung hoat dong", "co nhung hoat dong", "hoat dong cau lac bo"],
    "lam the nao de tham gia cau lac bo": ["lam the nao de tham gia", "tham gia cau lac bo", "dang ky tham gia", "tuyen thanh vien", "gia nhap"],
    "thoi gian sinh hoat dien ra khi nao": ["thoi gian sinh hoat", "lich sinh hoat", "bao gio sinh hoat", "khi nao sinh hoat"],
    "can ky nang gi de ung tuyen": ["can ky nang gi", "ky nang de ung tuyen", "yeu cau ky nang", "dieu kien ung tuyen"],
    "cau lac bo duoc thanh lap khi nao": ["thanh lap khi nao", "ra doi khi nao", "nam nao thanh lap"],
    "cau lac bo co nhung thanh tich gi": ["thanh tich gi", "giai thuong nao", "giay khen nao", "thanh tich nao"],
    "quyen loi cua thanh vien la gi": ["quyen loi cua thanh vien", "loi ich thanh vien", "benefit thanh vien", "quyen loi gi"],
    "quy trinh tuyen chon gom nhung buoc nao": ["quy trinh tuyen chon", "buoc tuyen chon", "vong tuyen chon", "phong van tuyen"],
    "co thu phi thanh vien khong": ["co thu phi", "dong phi thanh vien", "hoc phi thanh vien", "phi thanh vien"],
    "lien he clb bang cach nao": ["lien he clb", "contact clb", "email clb", "fanpage clb"]
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
