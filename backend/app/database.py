from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

# Read the database URL from environment, fall back to the public Railway Postgres URL
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:fvDPNAfaFrbDFpQrkvqiNNJLlHWSvBmq@hopper.proxy.rlwy.net:46458/railway",
)

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
