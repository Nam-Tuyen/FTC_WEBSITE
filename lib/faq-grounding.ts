export type FaqTopic = 'activities' | 'join' | 'teams' | 'schedule' | 'skills' | 'founding' | 'achievements';

export const SUGGESTED_QUESTIONS: Record<FaqTopic, string[]> = {
  activities: [
    'cau lac bo co nhung hoat dong gi',
    'hoat dong clb',
    'clb lam gi',
    'clb co hoat dong gi',
    'su kien hoat dong',
  ],
  join: [
    'lam the nao de tham gia cau lac bo',
    'tham gia clb',
    'ung tuyen clb',
    'dang ky clb',
    'gia nhap clb',
  ],
  teams: [
    'cac ban trong cau lac bo lam gi',
    'clb co nhung ban nao',
    'co cau to chuc',
    'cac ban lam gi',
    'bo phan trong clb',
  ],
  schedule: [
    'thoi gian sinh hoat dien ra khi nao',
    'lich sinh hoat',
    'sinh hoat khi nao',
    'bao gio sinh hoat',
    'lich hoat dong',
  ],
  skills: [
    'can ky nang gi de ung tuyen',
    'ky nang ung tuyen',
    'yeu cau ung tuyen',
    'tieu chi ung tuyen',
    'kinh nghiem can co de vao clb',
  ],
  founding: [
    'ftc duoc thanh lap khi nao',
    'ftc thanh lap',
    'cau lac bo duoc thanh lap khi nao',
    'thanh lap ftc',
  ],
  achievements: [
    'ftc co nhung thanh tich gi',
    'thanh tich ftc',
    'giai thuong ftc',
    'ftc dat thanh tich gi',
  ],
};

export function normalizeVi(s: string) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s?.,:;!@#\$\/\+()_\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function jaccard(a: string[], b: string[]) {
  const A = new Set(a);
  const B = new Set(b);
  const inter = [...A].filter((x) => B.has(x)).length;
  const uni = new Set([...A, ...B]).size || 1;
  return inter / uni;
}

export function matchSuggestedQuestion(input: string): { matched: boolean; topic?: FaqTopic; score?: number } {
  const q = normalizeVi(input);
  if (!q) return { matched: false };

  const tokensQ = q.split(' ').filter(Boolean);

  let best: { topic?: FaqTopic; score: number } = { topic: undefined, score: 0 };

  (Object.keys(SUGGESTED_QUESTIONS) as FaqTopic[]).forEach((topic) => {
    for (const pat of SUGGESTED_QUESTIONS[topic]) {
      const p = normalizeVi(pat);
      const tokensP = p.split(' ').filter(Boolean);

      const contains = q.includes(p) || p.includes(q);
      const score = Math.max(contains ? 1 : 0, jaccard(tokensQ, tokensP));

      if (score > best.score) best = { topic, score };
    }
  });

  if (best.topic && best.score >= 0.42) return { matched: true, topic: best.topic, score: best.score };
  return { matched: false };
}

const FTC_FAQ_CONTEXT = `
[CÂU HỎI & TRẢ LỜI CHÍNH THỨC CỦA FTC]

1) Câu lạc bộ có những hoạt động gì?
    FTC tổ chức talkshow, workshop và lớp bồi dưỡng về Fintech, AI trong tài chính, giao dịch thuật toán, blockchain và tài chính cá nhân. Thành viên tham gia dự án thực tế trên dữ liệu và thị trường, rèn tư duy sản phẩm và quản trị rủi ro. Câu lạc bộ còn kết nối doanh nghiệp, mở cơ hội thực tập và xây dựng hồ sơ học thuật, đồng thời giúp phát triển kỹ năng giao tiếp, làm việc nhóm và quản lý dự án.

    2) Làm thế nào để tham gia câu lạc bộ?
    Bạn vào mục Ứng tuyển trên website, chọn Bắt đầu ngay hôm nay và điền form. Hãy chọn ban mong muốn, Ban Nhân sự sẽ liên hệ, định hướng và thông báo các bước tiếp theo. Nếu cần hỗ trợ nhanh, vui lòng gửi email hoặc nhắn fanpage của FTC.

    3) Các ban trong câu lạc bộ làm gì?
    Ban Điều hành định hướng chiến lược, điều phối hoạt động và đối ngoại. Ban Học thuật xây dựng nội dung Fintech, soạn giáo trình và tổ chức rèn kỹ năng như xử lý dữ liệu, SQL và phân tích giao dịch. Ban Sự kiện lập kế hoạch, viết kịch bản, điều phối chương trình và tổng kết báo cáo. Ban Truyền thông quản trị kênh chính thức, sản xuất bài viết, đồ họa, video và lưu trữ tư liệu. Ban Tài chính cá nhân phụ trách giáo dục tài chính cá nhân, triển khai MoneyWe và chuỗi FTCCN Sharing. Ban Nhân sự xây văn hóa, tuyển chọn và phân công nhân sự, theo dõi hiệu quả và quản lý quỹ.

    4) Thời gian sinh hoạt diễn ra khi nào?
    CLB sinh hoạt định kỳ qua các buổi talkshow, workshop và hoạt động nội bộ. Lịch cụ thể được công bố tại mục Hoạt động và trên các kênh chính thức, đồng thời gửi qua email cho ứng viên sau khi đăng ký.

    5) Cần kỹ năng gì để ứng tuyển?
    Câu lạc bộ ưu tiên tinh thần ham học, chủ động và cam kết thời gian, cùng kỹ năng giao tiếp, làm việc nhóm và quản lý thời gian. Ứng viên có lợi thế khi biết Excel hoặc Google Sheets, SQL hay Python đối với Ban Học thuật, có khả năng lập kế hoạch và điều phối đối với Ban Sự kiện, viết và thiết kế nội dung hoặc quay dựng video đối với Ban Truyền thông, nắm kiến thức tài chính cá nhân đối với Ban Tài chính cá nhân, và có kỹ năng tổ chức, phỏng vấn và vận hành ��ối với Ban Nhân sự.

    6) Câu lạc bộ có bao nhiêu ban tất cả?
    Câu lạc bộ có tất cả 5 ban bao gồm: Ban Học thuật, Ban Sự kiện, Ban Truyền thông, Ban Nhân sự và Ban Tài chính cá nhân.

    7) Hoạt động FTC trip có gì vui?
    Với phương châm làm hết mình và chơi hết mình câu lạc bộ luôn định kì hằng năm tổ chức các chuyến đi chơi để gắn kết giữa các thành viên và xả stress sau một thời gian dài hoạt động mệt mỏi.

    8) FTC được thành lập khi nào?
    Câu lạc bộ Công nghệ tài chính FTC trực thuộc Khoa Tài chính và Ngân hàng, Trường Đại học Kinh tế và Luật, Đại học Quốc gia Thành phố Hồ Chí Minh, được thành lập vào tháng mười một năm 2020 dưới sự hướng dẫn của ThS. NCS Phan Huy Tâm (Giảng viên Khoa Tài chính - Ngân hàng) cùng đội ngũ sinh viên ngành công nghệ tài chính.

    9) FTC có những thành tích gì?
    THÀNH TÍCH NỔI BẬT
    Thành tích nổi bật của câu lạc bộ trong thời gian qua

    NIỀM TỰ HÀO CỦA TUỔI TRẺ UEL
    Câu lạc bộ Công nghệ tài chính (FTC) luôn gắn liền hành trình phát triển của tuổi trẻ Trường Đại học Kinh tế – Luật với những trải nghiệm đáng nhớ và thành tích nổi bật. Trong năm học 2024 – 2025, FTC đã vinh dự được Ban Cán sự Đoàn Đại học Quốc gia TP.HCM trao tặng Giấy khen vì những đóng góp tích cực trong công tác Đoàn và phong trào thanh niên.

    FTC không chỉ tổ chức các hoạt động học thuật và ngoại khóa bổ ích mà còn tạo dựng một môi trường rèn luyện, kết nối và lan tỏa tinh thần tích cực.

    Giấy khen ĐHQG
    DẤU ẤN TẠI GIẢI THƯỞNG I-STAR
    FTC vinh dự nằm trong Top 10 tổ chức, cá nhân tiêu biểu Nhóm 4 tại Giải thưởng Đổi mới sáng tạo và Khởi nghiệp TP.HCM (I-Star). Đây là giải thưởng uy tín do Ủy ban Nhân dân TP.HCM chủ trì và Sở Khoa học và Công nghệ TP.HCM tổ chức.

    Với định hướng "bệ phóng cho những ý tưởng đổi mới", FTC triển khai nhiều chương trình thiết thực như cuộc thi học thuật, đào tạo, workshop và talkshow để giúp sinh viên tiếp cận kiến thức chuyên sâu về công nghệ tài chính và khởi nghiệp sáng tạo.

    I-Star Top10
    Giấy chứng nhận I-Star ghi nhận thành tích và đóng góp của FTC trong hoạt động đổi mới sáng tạo và khởi nghiệp. Đây là minh chứng cho nỗ lực của câu lạc bộ trong việc thúc đẩy sáng tạo và hỗ trợ sinh viên thực hiện dự án thực tế.
`.trim();

const FTC_RULES = `
Bạn là trợ lý của FTC. Khi câu hỏi thuộc 5 chủ đề gợi ý, chỉ được dùng dữ liệu trong [CÂU HỎI & TRẢ LỜI CHÍNH THỨC CỦA FTC] dưới đây để trả lời.
- Nếu dữ liệu không bao quát, hãy trả lời ngắn gọn: "Thông tin hiện chưa có trong dữ liệu FTC."
- Trình bày bằng tiếng Việt, súc tích, đúng giọng điệu thân thiện của CLB.
- Không bịa, không tham chiếu nguồn ngoài.
`.trim();

export function buildGroundedPrompt(userQuestion: string) {
  return `${FTC_RULES}

[CÂU HỎI & TRẢ LỜI CHÍNH THỨC CỦA FTC]
${FTC_FAQ_CONTEXT}

[CÂU HỎI]
${userQuestion}

[HƯỚNG DẪN TRẢ LỜI]
- Trả lời đúng trọng tâm câu hỏi.
- Nếu câu hỏi rơi vào 5 chủ đề nêu trên, chỉ dựa vào dữ liệu FTC để trả lời.
- Nếu không đủ dữ liệu trong FTC, trả lời: "Thông tin hiện chưa có trong dữ liệu FTC."
`;
}
