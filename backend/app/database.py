from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

# Use the provided PostgreSQL URL directly or from environment variables
# Ideally, user should put this in .env
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:fvDPNAfaFrbDFpQrkvqiNNJLlHWSvBmq@hopper.proxy.rlwy.net:46458/railway"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
