import sys
import os

# Add current directory to path so we can import app
sys.path.append(os.getcwd())

from app.database import engine
from app import models

def reset_database():
    print("Dropping all tables...")
    # This drops all tables defined in models.Base
    models.Base.metadata.drop_all(bind=engine)
    print("All tables dropped.")
    
    print("Creating all tables...")
    # This creates all tables defined in models.Base
    models.Base.metadata.create_all(bind=engine)
    print("All tables created.")

if __name__ == "__main__":
    reset_database()
