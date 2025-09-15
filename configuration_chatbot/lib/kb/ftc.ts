// lib/kb/ftc.ts
// Knowledge base (KB) cho FTC + helpers dựng system instruction & context
// LƯU Ý: Đây chỉ là "ngữ cảnh" cung cấp cho Gemini, KHÔNG tự trả lời từ KB.

type FTCKBType = typeof FTCKB;

export const FTCKB = {
  "kb_version": "1.0",
  "updated_at": "2025-09-04T00:00:00+07:00",
  "language": "vi",
  "tone_guidelines": {
    "style": ["thân thiện", "ngắn gọn", "rõ ràng", "khích lệ"],
    "persona": "FTC AI Assistant",
    "pronouns": {"assistant": "FTC", "user": "bạn"},
    "rules": [
      "Tránh thuật ngữ khó; nếu bắt buộc dùng thì giải thích ngắn 1 dòng.",
      "Mỗi câu trả lời nên có 1 CTA (đăng ký, nhắn tin, xem lịch).",
      "Dùng emoji tiết chế (1–2 emoji).",
      "Không đoán bừa ngày/giờ; nếu thiếu thông tin thì dùng fallback lịch.",
      "Tôn trọng s�� đa dạng kỹ năng; ưu tiên tinh thần học hỏi."
    ]
  },
  "contact": {
    "email": "clbcongnghetaichinh@st.uel.edu.vn",
    "fanpage": "https://www.facebook.com/clbfintechuel",
    "affiliation": {
      "department": "Khoa Tài chính – Ngân hàng",
      "university": "Trường Đại học Kinh tế – Luật, ĐHQG-HCM"
    }
  },
  "club": {
    "name": "Câu lạc bộ Công nghệ – Tài chính",
    "abbr": "FTC",
    "full_name_vn": "Câu lạc bộ Công nghệ và Tài chính FTC",
    "founded": "2020-11",
    "advisor": "ThS. NCS Phan Huy Tâm",
    "mission": "Mang lại giá trị thiết thực cho sinh viên thông qua hệ sinh thái học thuật, thực hành và kết nối nghề nghiệp trong lĩnh vực công nghệ tài chính.",
    "core_values": ["giáo dục", "kết nối", "chia sẻ"],
    "motto": ["thống nhất", "vượt trội", "tiên phong"],
    "vision": "Trở thành cộng đồng sinh viên yêu thích công nghệ tài chính lớn nhất Việt Nam, mở rộng hợp tác sinh viên – doanh nghiệp trong khu vực Đông Nam Á.",
    "goals": [
      "Cập nhật và truyền đạt kiến thức về tài chính định lượng, dữ liệu và sản phẩm số.",
      "Kết nối sinh viên với giảng viên, chuyên gia, doanh nghiệp và nhà tuyển dụng.",
      "Xây dựng cộng đồng học thuật cởi mở: cùng học – cùng làm – cùng chia sẻ."
    ]
  },
  "activities": [
    {
      "name": "Hội thảo – tọa đàm – chuyên đề",
      "topics": [
        "xu hướng công nghệ tài chính",
        "dữ liệu & trí tuệ nhân tạo trong tài chính",
        "sản phẩm ngân hàng số",
        "diễn biến thị trường vốn",
        "quản trị rủi ro hiện đại"
      ]
    },
    {
      "name": "Cuộc thi & dự án thực hành",
      "description": "Thiết kế mô hình, phát triển công cụ phân tích và kiểm thử trên dữ liệu thực tế."
    },
    {
      "name": "Kết nối nghề nghiệp",
      "description": "Gặp gỡ chuyên gia/mentors, cơ hội thực tập & ngày hội việc làm, tham quan doanh nghiệp."
    },
    {
      "name": "Cộng đồng học thuật",
      "description": "Nhóm nghiên cứu sinh viên, giờ lập trình định kỳ, nhóm đọc, diễn đàn chia sẻ tài liệu."
    }
  ],
  "committees": {
    "Ban Chủ nhiệm": {
      "function": "Điều phối toàn diện, định hình chiến lược, phê duyệt kế hoạch – ngân sách – nhân sự, đầu mối đối ngoại."
    },
    "Ban Học thuật": {
      "function": "Phụ trách kiến thức FinTech; chuyển hóa kiến thức thành hoạt động dễ học, dễ áp dụng.",
      "tasks": [
        "Soạn giáo trình nội bộ; tài liệu cho sự kiện & ấn phẩm học thuật.",
        "Lên nội dung talkshow/workshop; xây bộ đề & tiêu chí chấm cho cuộc thi.",
        "Tổ chức rèn kỹ năng: xử lý dữ liệu, SQL, phân tích & giao dịch thuật toán.",
        "Đại diện FTC tham gia sân chơi học thuật – công nghệ – đổi mới sáng tạo."
      ]
    },
    "Ban Sự kiện": {
      "function": "Lên kế hoạch & tổ chức chương trình; kịch bản; tổng hợp báo cáo.",
      "tasks": [
        "Lên ý tưởng, cấu trúc nội dung, kịch bản tổng thể & kịch bản MC.",
        "Viết kế hoạch: mục tiêu, nội dung chính, tiến độ, ngân sách, checklist phối hợp.",
        "Soạn báo cáo tổng kết; đánh giá hiệu quả; đề xuất cải tiến.",
        "Trao đổi email hợp tác; ghi lịch; lưu trữ thông tin trao đổi."
      ]
    },
    "Ban Truyền thông": {
      "function": "Phụ trách hình ảnh, nội dung & kênh trực tuyến của FTC.",
      "tasks": [
        "Quản trị trang chính thức; giữ nhận diện thống nhất.",
        "Sáng tạo nội dung; thiết kế ấn phẩm (bài viết, infographics, poster, video).",
        "Chụp ảnh, ghi hình, chọn & lưu trữ tư liệu; lên lịch & xuất bản.",
        "Phối hợp truyền thông với đối tác; bảo đảm thông tin chính xác & kịp thời."
      ]
    },
    "Ban Tài chính cá nhân": {
      "function": "Giáo dục tài chính cá nhân gắn với ứng dụng công nghệ.",
      "tasks": [
        "Hỗ trợ giảng dạy bằng trò chơi MoneyWe; tổ chức chuyên đề/ tọa đàm.",
        "Biên soạn chuỗi FTCCN Sharing (bài hướng dẫn & bộ công cụ quản lý chi tiêu – tiết kiệm – đầu tư).",
        "Phối hợp Ban Học thuật để tích hợp kiến thức FinTech vào nội dung TC cá nhân.",
        "Kết nối liên ban để bồi dưỡng kỹ năng mềm: giao tiếp, teamwork, thuyết trình, quản lý thời gian."
      ]
    },
    "Ban Nhân sự": {
      "function": "Xây dựng văn hóa, n���i quy; vận hành & phát triển nguồn lực FTC.",
      "tasks": [
        "Soạn & cập nhật nội quy; giữ gìn văn hóa FTC; chăm lo đời sống tinh thần thành viên.",
        "Tuyển chọn, phân công; theo dõi hiệu quả; onboarding thành viên mới; gắn kết đội nhóm.",
        "Dự trù kinh phí theo hoạt động; lập dự toán tổng; theo dõi chi phí; quản lý quỹ minh bạch.",
        "Phối hợp các ban để cân đối nguồn lực theo kế hoạch & tiến độ."
      ]
    },
    "principle_of_collaboration": "Chuỗi liên thông: Học thuật bàn giao nội dung → Sự kiện tổ chức triển khai → Truyền thông thiết kế & lan tỏa; song song Nhân sự bố trí con người & gìn giữ văn hóa, Tài chính cá nhân triển khai mảng giáo dục chuyên biệt; tất cả do Ban Chủ nhiệm điều phối."
  },
  "join_process": [
    "Theo dõi Fanpage để cập nhật mùa tuyển & link form.",
    "Điền Form Đăng ký thành viên (đính kèm CV/portfolio nếu có).",
    "Tham dự buổi định hướng (giới thiệu FTC, văn hóa, lộ trình).",
    "Chọn ban phù hợp sở thích/kỹ năng.",
    "Phỏng vấn/ bài test nhỏ (tùy ban).",
    "Thử vi���c 1–2 tháng để làm quen quy trình & dự án.",
    "Chính thức trở thành FTC-er."
  ],
  "meeting_times_policy": {
    "summary": "Sinh hoạt theo kế hoạch từng học kỳ và lịch từng sự kiện; ưu tiên buổi tối ngày thường hoặc cuối tuần.",
    "where_to_check": "Lịch luôn cập nhật trên Fanpage và thông báo qua email/Zalo cho thành viên.",
    "fallback": "Lịch đang được chốt và sẽ cập nhật trên Fanpage; FTC sẽ gửi email/Zalo sau khi chốt."
  },
  "skills": {
    "common": ["giao tiếp", "làm việc nhóm", "quản lý thời gian", "trách nhiệm với deadline", "tinh thần học hỏi"],
    "by_committee": {
      "Ban Học thuật": ["tư duy dữ liệu/logic", "Excel/Google Sheets", "Python/SQL (cơ bản – điểm cộng)", "hứng thú tài chính định lượng/AI"],
      "Ban Sự kiện": ["tổ chức & giám sát tiến độ", "viết kịch bản", "phối hợp đa ban", "bám ngân sách"],
      "Ban Truyền thông": ["viết content", "thiết kế cơ bản (Canva/PS/AI)", "chụp/ghi hình", "lên lịch đăng"],
      "Ban Tài chính cá nhân": ["kiến thức TC cá nhân cơ bản", "kỹ năng chia sẻ/giảng giải"],
      "Ban Nhân sự": ["gắn kết cộng đồng", "lắng nghe", "cẩn thận giấy tờ – biểu mẫu", "theo dõi hiệu quả"],
      "Ban Chủ nhiệm": ["điều phối", "tư duy chiến lược", "đối ngoại"]
    },
    "note": "Chưa có kinh nghiệm vẫn có thể ứng tuyển; FTC có onboarding & mentor để phát triển từ nền tảng."
  },
  "faq": [
    {
      "intent": "hoat_dong",
      "question_patterns": [
        "Câu lạc bộ có những hoạt động gì?",
        "FTC làm những gì?",
        "Hoạt động tiêu biểu của FTC là gì?"
      ],
      "answer_short": "FTC có 4 nhóm hoạt động chính: hội thảo/chuyên đề, cuộc thi & dự án thực hành, kết nối nghề nghiệp, và cộng đồng học thuật (nhóm nghiên cứu, giờ lập trình, nhóm đọc). Bạn thích mảng nào để mình gợi ý chi tiết? 😊",
      "answer_full": "FTC tổ chức: (1) hội thảo – tọa đàm – chuyên đề về FinTech, dữ liệu & AI, ngân hàng số, thị trường vốn, quản trị rủi ro; (2) cuộc thi & dự án thực hành thiết kế mô hình, công cụ phân tích và kiểm thử trên dữ liệu thực; (3) kết nối nghề nghiệp với chuyên gia/mentors, cơ hội thực tập, ngày hội việc làm, tham quan doanh nghiệp; (4) cộng đồng học thuật: nhóm nghiên cứu, giờ lập trình định kỳ, nhóm đọc, diễn đàn tài liệu.",
      "cta": "Xem cập nhật hoạt động trên Fanpage và chọn mảng bạn quan tâm để FTC giới thiệu chi tiết."
    },
    {
      "intent": "tham_gia",
      "question_patterns": [
        "Làm thế nào để tham gia câu lạc bộ?",
        "Cách đăng ký vào FTC?",
        "FTC tuyển thành viên như thế nào?"
      ],
      "answer_short": "Theo dõi Fanpage khi mở đơn, điền form, dự định hướng, chọn ban, phỏng vấn/test (nếu có), thử việc 1–2 tháng rồi chính thức. ✅",
      "answer_full": "Quy trình gồm: (1) theo dõi Fanpage để thấy mùa tuyển & link form; (2) điền form đăng ký (đính kèm CV/portfolio nếu có); (3) tham dự buổi định hướng; (4) chọn ban phù hợp; (5) phỏng vấn/bài test nhỏ; (6) thử việc 1–2 tháng; (7) chính thức trở thành FTC-er.",
      "cta": "Bạn muốn FTC lưu email để nhắc khi mở đơn không? Fanpage: https://www.facebook.com/clbfintechuel"
    },
    {
      "intent": "cac_ban",
      "question_patterns": [
        "Các ban trong câu lạc bộ làm gì?",
        "Vai trò của từng ban?",
        "Nên chọn ban nào?"
      ],
      "answer_short": "Mỗi ban có vai trò riêng: Chủ nhiệm (điều phối & đối ngoại), Học thuật (nội dung FinTech), Sự kiện (kế hoạch & kịch bản), Truyền thông (nội dung & thiết kế), Tài chính cá nhân (giáo dục TC ứng dụng), Nhân sự (văn hóa – tuyển – gắn kết – quỹ). Bạn đang nghiêng về ban nào?",
      "answer_full": "Chủ nhiệm: chiến lược, điều phối, đối ngoại. Học thuật: giáo trình, nội dung sự kiện, bộ đề & tiêu chí chấm, rèn kỹ năng dữ liệu/SQL/thuật toán. Sự kiện: ý tưởng, kế hoạch, kịch bản, báo cáo, liên hệ đối tác. Truyền thông: content, thiết kế, ảnh/video, lịch đăng, phối hợp đối tác. Tài chính cá nhân: MoneyWe, chuỗi FTCCN Sharing, bộ công cụ chi tiêu–tiết kiệm–đầu tư, kỹ năng mềm. Nhân sự: nội quy & văn hóa, tuyển–phân công–theo dõi, onboarding, team bonding, dự toán & quỹ.",
      "cta": "Nhắn FTC mảng bạn thích để nhận checklist kỹ năng & lộ trình thử việc."
    },
    {
      "intent": "thoi_gian_sinh_hoat",
      "question_patterns": [
        "Thời gian sinh hoạt diễn ra khi nào?",
        "FTC sinh hoạt vào ngày nào?",
        "Lịch hoạt động FTC?"
      ],
      "answer_short": "FTC sinh hoạt theo kế hoạch từng học kỳ và lịch từng sự kiện. Lịch mới sẽ đăng trên Fanpage và thông báo qua email/Zalo.",
      "answer_full": "Lịch được sắp theo học kỳ; một số hoạt động tổ chức buổi tối ngày thường hoặc cuối tuần. Khi chốt lịch, FTC đăng trên Fanpage và gửi email/Zalo cho thành viên. Nếu bạn quan tâm mảng cụ thể (vd. giờ lập trình), FTC có thể đưa bạn vào danh sách ưu tiên thông báo.",
      "cta": "Để lại email để được báo sớm khi chốt lịch; theo dõi Fanpage để cập nhật."
    },
    {
      "intent": "ky_nang_ung_tuyen",
      "question_patterns": [
        "Cần kỹ năng gì để ứng tuyển?",
        "Yêu cầu đầu vào FTC?",
        "Chưa biết gì có tham gia được không?"
      ],
      "answer_short": "Không cần biết hết từ đầu; điều FTC tìm là tinh thần học hỏi, chủ động và teamwork. Kỹ năng sẽ được đào tạo qua dự án thực tế.",
      "answer_full": "Kỹ năng chung: giao tiếp, làm việc nhóm, quản lý thời gian, trách nhiệm với deadline. Theo ban: Học thuật (tư duy dữ liệu/logic, Excel/Sheets; Python/SQL cơ bản là điểm cộng), Sự kiện (tổ chức – kịch bản – phối hợp – ngân sách), Truyền thông (content, thiết kế cơ bản, chụp/ghi hình, lịch đăng), Tài chính cá nhân (kiến thức cơ bản, kỹ năng chia sẻ), Nhân sự (gắn kết cộng đồng, lắng nghe, giấy tờ – biểu mẫu, theo dõi hiệu quả).",
      "cta": "Hỏi FTC để nhận lộ trình học nhanh 2–4 tuần theo ban bạn chọn."
    }
  ],
  "fallbacks": {
    "unknown_schedule": "Lịch đang được chốt và sẽ cập nhật trên Fanpage; FTC sẽ thông báo qua email/Zalo sau khi chốt.",
    "contact_block": "📮 Email: clbcongnghetaichinh@st.uel.edu.vn | 📘 Fanpage: https://www.facebook.com/clbfintechuel | 📍 UEL – ĐHQG-HCM"
  },
  "cta_templates": [
    "Bạn muốn FTC lưu email để nhắc khi mở đơn không?",
    "Theo dõi Fanpage để xem lịch và link form.",
    "Nhắn FTC mảng bạn thích để tụi mình tư vấn ban phù hợp nhé!"
  ]
} as const;

// ===== Helpers =====
export function normalizeVi(s: string) {
  return (s ?? "").replace(/\uFFFD/g, "").normalize("NFC").trim();
}
export function toKey(s: string) {
  return (s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function findRelatedFaqSnippet(kb: FTCKBType, userQuestion: string) {
  try {
    const qk = toKey(userQuestion);
    for (const item of kb.faq ?? []) {
      for (const pat of item.question_patterns ?? []) {
        if (toKey(pat) && qk.includes(toKey(pat))) {
          const sn = item.answer_short || item.answer_full || "";
          if (sn) {
            return `FAQ liên quan:\n${normalizeVi(sn)}`;
          }
        }
      }
    }
  } catch {}
  return "";
}

export function buildSystemInstructionFromKB(kb: FTCKBType) {
  const t = kb.tone_guidelines;
  return [
    `Bạn là ${t?.persona ?? "FTC AI Assistant"} – trợ lý của Câu lạc bộ Công nghệ – Tài chính (FTC) thuộc UEL.`,
    `Phong cách: ${t?.style?.join(", ") || "thân thiện, ngắn gọn, rõ ràng"}.`,
    `Ngôi xưng: ${t?.pronouns?.assistant ?? "FTC"} với ${t?.pronouns?.user ?? "bạn"}.`,
    ...(t?.rules ?? []),
    `Thiếu dữ liệu CLB thì nói 'chưa có thông tin', không bịa. Sửa/loại bỏ ký tự lỗi (�).`,
  ].join("\n");
}

export function buildContextFromKB(kb: FTCKBType, userQuestion?: string) {
  const contact = `Liên hệ: ${kb.contact?.email} • Fanpage: ${kb.contact?.fanpage}`;
  const aff = `Trực thuộc: ${kb.contact?.affiliation?.department}, ${kb.contact?.affiliation?.university}`;
  const club = `FTC thành lập ${kb.club?.founded}; sứ mệnh: ${kb.club?.mission}`;
  const acts = (kb.activities ?? []).map(a => `• ${a.name}${a.description ? ` – ${a.description}` : ""}`).join("\n");
  const comms = Object.entries(kb.committees ?? {}).map(([name, info]: any) =>
    `• ${name}: ${info?.function || ""}`).join("\n");
  const join = (kb.join_process ?? []).map((s: string, i: number) => `${i + 1}. ${s}`).join("\n");
  const meet = `Lịch sinh hoạt: ${kb.meeting_times_policy?.summary}.`;

  const faqRel = userQuestion ? findRelatedFaqSnippet(kb, userQuestion) : "";

  return [
    "# NGỮ CẢNH FTC",
    contact,
    aff,
    club,
    "Hoạt động tiêu biểu:",
    acts,
    "Cơ cấu & chức năng:",
    comms,
    "Quy trình tham gia:",
    join,
    meet,
    faqRel ? "\n" + faqRel : "",
  ].map(normalizeVi).join("\n");
}
