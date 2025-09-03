"""
Dữ liệu về câu lạc bộ Công nghệ - Tài chính (FTC)
"""

# Thông tin cơ bản về câu lạc bộ
CLUB_INFO = {
    "name": "Câu lạc bộ Công nghệ - Tài chính (FTC)",
    "full_name": "Financial Technology Club",
    "university": "Trường Đại học Kinh tế - Luật, ĐHQG-HCM",
    "established": "Tháng 11/2020",
    "faculty": "Khoa Tài chính - Ngân hàng",
    "advisor": "ThS. NCS Phan Huy Tâm",
    "email": "clbcongnghetaichinh@st.uel.edu.vn",
    "fanpage": "https://www.facebook.com/clbfintechuel"
}

# Các ban trong câu lạc bộ
DEPARTMENTS = {
    "hoc_thuat": {
        "name": "Ban Học thuật",
        "description": "Phụ trách nội dung Fintech, dữ liệu, SQL, phân tích, thuật toán",
        "responsibilities": [
            "Soạn giáo trình nội bộ",
            "Chuẩn bị tài liệu cho sự kiện",
            "Tổ chức buổi rèn kỹ năng",
            "Đại diện CLB tham gia sân chơi học thuật"
        ]
    },
    "su_kien": {
        "name": "Ban Sự kiện", 
        "description": "Lên kế hoạch và tổ chức các chương trình của câu lạc bộ",
        "responsibilities": [
            "Lên ý tưởng và thiết kế cấu trúc nội dung",
            "Soạn kịch bản tổng thể",
            "Viết kế hoạch chương trình",
            "Soạn báo cáo tổng kết"
        ]
    },
    "truyen_thong": {
        "name": "Ban Truyền thông",
        "description": "Phụ trách hình ảnh, nội dung và các kênh trực tuyến",
        "responsibilities": [
            "Quản trị trang chính thức",
            "Sáng tạo nội dung và thiết kế",
            "Chụp ảnh, ghi hình",
            "Phối hợp truyền thông với đối tác"
        ]
    },
    "tai_chinh_ca_nhan": {
        "name": "Ban Tài chính cá nhân",
        "description": "Giáo dục tài chính cá nhân gắn với ứng dụng công nghệ",
        "responsibilities": [
            "Hỗ trợ giảng dạy bằng trò chơi MoneyWe",
            "Biên soạn chuỗi FTCCN Sharing",
            "Phối hợp tích hợp kiến thức công nghệ",
            "Kết nối hoạt động giữa các ban"
        ]
    },
    "nhan_su": {
        "name": "Ban Nhân sự",
        "description": "Xây dựng văn hóa, hoàn thiện nội quy và vận hành nguồn lực",
        "responsibilities": [
            "Soạn và cập nhật nội quy",
            "Tuyển chọn và phân công nhân sự",
            "Tổ chức hoạt động gắn kết",
            "Quản lý quỹ minh bạch"
        ]
    }
}

# Hoạt động chính
ACTIVITIES = [
    {
        "name": "Workshop/Seminar",
        "description": "Blockchain, Data, AI ứng dụng trong tài chính",
        "frequency": "Hàng tháng"
    },
    {
        "name": "Hackathon/Mini-hack", 
        "description": "Xây sản phẩm trong thời gian ngắn",
        "frequency": "Theo quý"
    },
    {
        "name": "Dự án thực tế",
        "description": "Làm sản phẩm/dashboards, collab doanh nghiệp",
        "frequency": "Liên tục"
    },
    {
        "name": "Mentoring",
        "description": "Kèm cặp theo nhóm kỹ năng",
        "frequency": "Đầu mỗi học kỳ"
    },
    {
        "name": "Company tour",
        "description": "Kết nối chuyên gia & doanh nghiệp",
        "frequency": "Theo học kỳ"
    }
]

# FAQ câu lạc bộ
CLUB_FAQ = [
    {
        "keywords": ["giới thiệu", "clb là gì", "ftc là gì", "về clb"],
        "answer": "CLB Công nghệ – Tài chính (FTC) là cộng đồng sinh viên UEL yêu thích công nghệ tài chính. FTC thành lập 11/2020, trực thuộc Khoa Tài chính – Ngân hàng. Chúng tôi tổ chức hội thảo, thực hành, dự án thực tế để bạn học sâu – làm thật – kết nối rộng."
    },
    {
        "keywords": ["tham gia", "gia nhập", "đăng ký", "ứng tuyển"],
        "answer": "Cách tham gia: 1) Điền đơn đăng ký, 2) Chọn ban phù hợp, 3) Phỏng vấn ngắn, 4) Buổi làm quen. Yêu cầu: nhiệt huyết và tinh thần học hỏi."
    },
    {
        "keywords": ["hoạt động", "sự kiện", "chương trình"],
        "answer": "Hoạt động tiêu biểu: Workshop/Seminar về Blockchain, Data, AI; Hackathon; Dự án thực tế; Mentoring; Company tour và networking."
    },
    {
        "keywords": ["chi phí", "phí thành viên", "phí tham gia"],
        "answer": "Không thu phí thành viên bắt buộc. Một số chuyên đề có thể thu mức phí nhỏ để bù chi phí; thành viên tích cực thường được ưu tiên miễn/giảm."
    },
    {
        "keywords": ["lịch sinh hoạt", "thời gian", "lịch họp"],
        "answer": "Lịch sinh hoạt: định kỳ ~2 tuần/lần & theo kế hoạch từng chương trình. Thông báo chi tiết trên fanpage và website trước sự kiện ≥7 ngày."
    },
    {
        "keywords": ["kỹ năng", "yêu cầu", "kinh nghiệm"],
        "answer": "Không bắt buộc kinh nghiệm trước. Cần: đam mê công nghệ & tài chính, sẵn sàng học hỏi. Kỹ năng cơ bản: làm việc nhóm, thuyết trình, Office. Ưu tiên: Python/JS, phân tích dữ liệu."
    },
    {
        "keywords": ["liên hệ", "email", "facebook", "fanpage"],
        "answer": f"Liên hệ: Email: {CLUB_INFO['email']}, Fanpage: {CLUB_INFO['fanpage']}"
    }
]

# Từ khóa liên quan đến câu lạc bộ
CLUB_KEYWORDS = [
    'clb', 'câu lạc bộ', 'ftc', 'fintech club', 'uel', 'ứng tuyển', 'tham gia',
    'hoạt động', 'sinh hoạt', 'ban', 'mentor', 'thực tập', 'tuyển dụng',
    'sự kiện', 'chương trình', 'liên hệ', 'fanpage', 'email', 'moneywe',
    'học thuật', 'truyền thông', 'nhân sự', 'tài chính cá nhân'
]

# Từ khóa công nghệ tài chính (sẽ chuyển sang Gemini)
FINTECH_KEYWORDS = [
    'fintech', 'blockchain', 'smart contract', 'defi', 'cryptocurrency',
    'bitcoin', 'ethereum', 'nft', 'dao', 'web3', 'banking', 'payments',
    'machine learning', 'ai', 'data analysis', 'trading algorithm',
    'risk management', 'portfolio', 'investment', 'forex'
]