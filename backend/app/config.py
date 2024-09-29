import os


class Config:
    GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL', 'mysql+pymysql://root:new_password@localhost/disaster_alert_db')
