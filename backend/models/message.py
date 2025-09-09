"""
Base model for chat messages
"""
from datetime import datetime

class Message:
    def __init__(self, content: str, role: str, timestamp: datetime = None):
        self.content = content
        self.role = role  # "user" or "assistant"
        self.timestamp = timestamp or datetime.now()
        self.id = None  # To be set when persisted

    def to_dict(self):
        """Convert message to dictionary format."""
        return {
            'id': self.id,
            'content': self.content,
            'role': self.role,
            'timestamp': self.timestamp.isoformat()
        }

    @classmethod
    def from_dict(cls, data: dict):
        """Create message instance from dictionary."""
        msg = cls(
            content=data['content'],
            role=data['role'],
            timestamp=datetime.fromisoformat(data['timestamp'])
        )
        msg.id = data.get('id')
        return msg
