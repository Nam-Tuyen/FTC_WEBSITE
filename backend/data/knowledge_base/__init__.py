"""
Main knowledge base module that combines all data sources
"""

from .general_info import GENERAL_INFO
from .activities import ACTIVITIES
from .achievements import ACHIEVEMENTS
from .departments import DEPARTMENTS
from .opportunities import OPPORTUNITIES
from .recruitment import RECRUITMENT
from .keywords import KEYWORDS

# Combine all knowledge into one dictionary for easy access
knowledge_base = {
    "general": GENERAL_INFO,
    "activities": ACTIVITIES,
    "achievements": ACHIEVEMENTS,
    "departments": DEPARTMENTS,
    "opportunities": OPPORTUNITIES,
    "recruitment": RECRUITMENT
}

# Keywords mapping for better question classification
keywords_mapping = {
    "general": [
        "ftc", "clb", "câu lạc bộ", "là gì", "giới thiệu", "sứ mệnh", 
        "thành viên", "ban", "about"
    ],
    "activities": [
        "hoạt động", "cuộc thi", "attacker", "talkshow", "training", 
        "chia sẻ", "trip", "ngoại khóa"
    ],
    "achievements": [
        "thành tích", "giải thưởng", "i-star", "giấy khen", "vinh danh", 
        "đạt được"
    ],
    "departments": [
        "ban học thuật", "ban sự kiện", "ban truyền thông", 
        "ban tài chính cá nhân", "ban nhân sự", "ban điều hành"
    ],
    "opportunities": [
        "cơ hội", "lợi ích", "việc làm", "thực tập", "career", 
        "kết nối", "học hỏi"
    ],
    "recruitment": [
        "tuyển", "tham gia", "đăng ký", "yêu cầu", "điều kiện", 
        "phỏng vấn", "tuyển thành viên"
    ]
}
