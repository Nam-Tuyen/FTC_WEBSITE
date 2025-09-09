"""
Configuration management for different environments.
"""
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    """Base configuration."""
    DEBUG = False
    TESTING = False
    GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
    NOTION_TOKEN = os.getenv('NOTION_TOKEN')
    NOTION_DATABASE_ID = os.getenv('NOTION_DATABASE_ID')

class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = True

class ProductionConfig(Config):
    """Production configuration."""
    pass

class TestingConfig(Config):
    """Testing configuration."""
    TESTING = True

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}

def get_config():
    """Return the appropriate configuration object based on environment."""
    env = os.getenv('FLASK_ENV', 'default')
    return config[env]()
