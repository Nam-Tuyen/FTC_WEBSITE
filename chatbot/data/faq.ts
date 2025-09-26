// chatbot/data/faq.ts

import { normalize } from '@/chatbot/router';

export const FTC_CONTACTS = {
  fanpage: 'https://www.facebook.com/clbfintechuel',
  email: 'clbcongnghetaichinh@st.uel.edu.vn'
};

export const FAQ_MAP: Record<string, string> = {
  'cac ban trong cau lac bo lam gi': `
- Ban Học thuật: workshop/talkshow; tài liệu thực hành; ngân hàng câu hỏi; ra đề & chấm ATTACKER.
- Ban Sự kiện: kế hoạch/kịch bản/điều phối; timeline/checklist/phân công/nghiệm thu/chi phí.
- Ban Truyền thông: nhận diện & câu chuyện thương hiệu; kênh số; ấn phẩm; theo dõi hiệu quả.
- Ban Tài chính cá nhân: giáo trình quản lý tài chính sinh viên; MoneyWe; ngân sách/tiết kiệm/rủi ro.
- Ban Nhân sự: quy hoạch nguồn lực; gắn kết/mentor; hồ sơ; tuyển chọn/on-boarding; đánh giá/khen thưởng.
  `,
  'cau lac bo co nhung hoat dong gi': `
FTC xây dựng một <strong>hệ sinh thái hoạt động</strong> vừa học thuật vừa trải nghiệm thực tiễn:

<strong>Hoạt động học thuật:</strong> hội thảo, tọa đàm và chuyên đề về FinTech, dữ liệu, trí tuệ nhân tạo, ngân hàng số, thị trường vốn, quản trị rủi ro; cuộc thi học thuật <strong>ATTACKER</strong>; chuỗi talkshow và workshop theo chủ đề.

<strong>Hoạt động trải nghiệm:</strong> training nội bộ nâng kỹ năng; tham quan doanh nghiệp (như <strong>VNG</strong>); sự kiện hướng nghiệp <strong>Web3 Career Innovation</strong>.

<strong>Hoạt động gắn kết:</strong> các hoạt động cộng đồng như <strong>FTC Trip</strong>.
  `,
  'lam the nao de tham gia cau lac bo': `
Theo dõi Fanpage để cập nhật thông báo tuyển & form: ${FTC_CONTACTS.fanpage}
  `,
  'thoi gian sinh hoat dien ra khi nao': `
Lịch sinh hoạt công bố trong group nhà chung sau khi trúng tuyển; nêu rõ thời gian, hình thức, địa điểm từng hoạt động.
  `,
  'can ky nang gi de ung tuyen': `
Cốt lõi: học hỏi, kỷ luật, chủ động. Lợi thế: Excel/SQL/Python. Cần thêm: viết, thuyết trình, teamwork, quản lý thời gian; sự kiện → tổ chức; truyền thông → nội dung & thẩm mỹ.
  `,
  'cau lac bo duoc thanh lap khi nao': `
FTC thành lập 11/2020, trực thuộc Khoa Tài chính & Ngân hàng, UEL – ĐHQG-HCM (ThS. NCS Phan Huy Tâm).
  `,
  'cau lac bo co nhung thanh tich gi': `
Giấy khen Ban Cán sự Đoàn ĐHQG-HCM (2024–2025); Top 10 Nhóm 4 I-STAR TP.HCM.
  `,
  'quyen loi cua thanh vien la gi': `
Lộ trình mục tiêu; mentor; cơ hội điều phối; chứng nhận nội bộ theo đóng góp; hỗ trợ giới thiệu thực tập khi đạt chuẩn; xây portfolio dự án.
  `,
  'quy trinh tuyen chon gom nhung buoc nao': `
1) Theo dõi; 2) Form; 3) Chạy trạm; 4) Phỏng vấn; 5) Thông báo & vào group nhà chung.
  `,
  'co thu phi thanh vien khong': `
Không. Câu lạc bộ không thu phí thành viên.
  `,
  'lien he clb bang cach nao': `
Email: ${FTC_CONTACTS.email}
Fanpage: ${FTC_CONTACTS.fanpage}
  `,
};

export const FAQ_INDEX: Record<string, string[]> = {
  'cac ban trong cau lac bo lam gi': ['ban nao', 'cac ban', 'phan cong', 'nhiem vu'],
  'cau lac bo co nhung hoat dong gi': ['cau lac bo co nhung hoat dong', 'hoat dong gi', 'chuong trinh', 'workshop', 'talkshow', 'su kien'],
  'lam the nao de tham gia cau lac bo': ['tham gia', 'dang ky', 'tuyen thanh vien', 'gia nhap'],
  'thoi gian sinh hoat dien ra khi nao': ['lich sinh hoat', 'thoi gian', 'bao gio'],
  'can ky nang gi de ung tuyen': ['ky nang', 'yeu cau', 'ung tuyen', 'dieu kien'],
  'cau lac bo duoc thanh lap khi nao': ['thanh lap', 'ra doi', 'nam nao'],
  'cau lac bo co nhung thanh tich gi': ['thanh tich', 'giai thuong', 'giay khen'],
  'quyen loi cua thanh vien la gi': ['quyen loi', 'loi ich', 'benefit'],
  'quy trinh tuyen chon gom nhung buoc nao': ['quy trinh', 'tuyen chon', 'phong van', 'vong'],
  'co thu phi thanh vien khong': ['phi thanh vien', 'dong phi'],
  'lien he clb bang cach nao': ['lien he', 'email', 'fanpage', 'contact'],
};

export function faqMatchOrNull(question: string): string | null {
  const q = normalize(question);
  if (FAQ_MAP[q]) return FAQ_MAP[q];

  let bestKey = '';
  let bestScore = 0;
  for (const [key, kws] of Object.entries(FAQ_INDEX)) {
    const score = kws.reduce((acc, kw) => acc + (q.includes(normalize(kw)) ? 1 : 0), 0);
    if (score > bestScore) { bestScore = score; bestKey = key; }
  }
  return bestScore > 0 ? FAQ_MAP[bestKey] : null;
}
