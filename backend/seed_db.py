from sqlalchemy.orm import Session
from app import models, database, schemas

# Mock data mapping to our models
# Assuming database.py, models.py, schemas.py are imported correctly from app package

# Mock data from frontend (translated to python dicts)
mock_members = [
  { "name": "Rajesh Kumar", "role": "Admin", "email": "rajesh@forgeipa.com", "contact": "+91 98765 43210" },
  { "name": "Priya Sharma", "role": "Sales", "email": "priya@forgeipa.com", "contact": "+91 98765 43211" },
  { "name": "Amit Patel", "role": "Project Manager", "email": "amit@forgeipa.com", "contact": "+91 98765 43212" },
  { "name": "Sunita Reddy", "role": "Sales", "email": "sunita@forgeipa.com", "contact": "+91 98765 43213" },
]

mock_clients = [
  { "name": "Tata Steel Ltd", "client_id": "CLT-001", "address": "Mumbai, Maharashtra", "poc": "Vikram Mehta", "phone": "+91 22 6665 8282", "email": "vikram@tatasteel.com" },
  { "name": "Larsen & Toubro", "client_id": "CLT-002", "address": "Chennai, Tamil Nadu", "poc": "Anand Iyer", "phone": "+91 44 2249 6000", "email": "anand@lnt.com" },
  { "name": "Bharat Forge", "client_id": "CLT-003", "address": "Pune, Maharashtra", "poc": "Deepak Joshi", "phone": "+91 20 6704 2777", "email": "deepak@bharatforge.com" },
  { "name": "Godrej Industries", "client_id": "CLT-004", "address": "Mumbai, Maharashtra", "poc": "Neha Kapoor", "phone": "+91 22 2518 8010", "email": "neha@godrej.com" },
]

mock_vendors = [
  { "name": "Steel Authority India", "vendor_id": "VND-001", "address": "New Delhi", "poc": "Ravi Shankar", "phone": "+91 11 2436 7481", "email": "ravi@sail.com" },
  { "name": "Jindal Steel Works", "vendor_id": "VND-002", "address": "Bellary, Karnataka", "poc": "Suresh Garg", "phone": "+91 83 9224 0001", "email": "suresh@jindal.com" },
  { "name": "Precision Tools India", "vendor_id": "VND-003", "address": "Bangalore, Karnataka", "poc": "Mohan Das", "phone": "+91 80 2553 0291", "email": "mohan@precisiontools.in" },
]

mock_projects = [
  { "name": "CNC Shaft Assembly", "quotation_no": "QTN-2024-001", "status": "In Progress", "poc_phone": "+91 22 6665 8282" },
  { "name": "Hydraulic Valve Body", "quotation_no": "QTN-2024-002", "status": "Quoted", "poc_phone": "+91 44 2249 6000" },
  { "name": "Turbine Blade Set", "quotation_no": "QTN-2024-003", "status": "Completed", "poc_phone": "+91 20 6704 2777" },
  { "name": "Gear Housing Unit", "quotation_no": "QTN-2024-004", "status": "Draft", "poc_phone": "+91 22 2518 8010" },
]

mock_estimation = {
  "id": "EST-001",
  "client_name": "Tata Steel Ltd",
  "billing_address": "Jamshedpur Works, Jharkhand 831001",
  "ship_to_address": "Tata Steel Plant, Jamshedpur",
  "poc_name": "Vikram Mehta",
  "poc_phone": "+91 22 6665 8282",
  "poc_email": "vikram@tatasteel.com",
  "prepared_by": "Rajesh Kumar",
  "project_name": "CNC Shaft Assembly",
  "revision": "Rev 2",
  "proposal_no": "PRP-2024-001",
  "proposal_date": "2024-01-15", # Keeping as string for now to match simplicity
  "valid_till": "2024-02-15",
}

mock_company = {
  "name": "Forge i-DAS",
  "address": "Plot No. 45, MIDC Industrial Area, Pune, Maharashtra 411026",
  "email": "info@forgeidas.com",
  "phone": "+91 20 2710 4500",
}


def seed_data():
    db = database.SessionLocal()
    
    # Check if data exists
    if db.query(models.Member).first():
        print("Data already exists. Skipping seed.")
        db.close()
        return

    print("Seeding data...")

    # Members
    for member_data in mock_members:
        db_member = models.Member(**member_data)
        db.add(db_member)

    # Clients
    for client_data in mock_clients:
        db_client = models.Client(**client_data)
        db.add(db_client)

    # Vendors
    for vendor_data in mock_vendors:
        db_vendor = models.Vendor(**vendor_data)
        db.add(db_vendor)

    # Projects
    for project_data in mock_projects:
        db_project = models.Project(**project_data)
        db.add(db_project)
    
    # Estimation (Single object in mock)
    # We'll just add one for now
    db_estimation = models.Estimation(**mock_estimation)
    db.add(db_estimation)

    # Company
    db_company = models.Company(**mock_company)
    db.add(db_company)

    try:
        db.commit()
        print("Data seeded successfully!")
    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    # Ensure tables exist
    models.Base.metadata.create_all(bind=database.engine)
    seed_data()
