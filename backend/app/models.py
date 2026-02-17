from sqlalchemy import Column, Integer, String, Date, Text, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from .database import Base

class Member(Base):
    __tablename__ = "members"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    role = Column(String, index=True)
    email = Column(String, index=True, unique=True)
    contact = Column(String)
    hashed_password = Column(String)

class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    client_id = Column(String, unique=True, index=True)
    address = Column(Text)
    poc = Column(String)
    phone = Column(String)
    email = Column(String)

class Vendor(Base):
    __tablename__ = "vendors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    vendor_id = Column(String, unique=True, index=True)
    address = Column(Text)
    poc = Column(String)
    phone = Column(String)
    email = Column(String)

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    quotation_no = Column(String, unique=True, index=True)
    status = Column(String, default="Draft") # e.g. "Draft", "Quoted", "In Progress", "Completed"
    poc_phone = Column(String) # Keeping as strictly provided in mock
    
    # Optional relationships could be added later if needed

class Estimation(Base):
    __tablename__ = "estimations"

    id = Column(String, primary_key=True, index=True) # "EST-001"
    client_name = Column(String, index=True)
    billing_address = Column(Text)
    ship_to_address = Column(Text)
    poc_name = Column(String)
    poc_phone = Column(String)
    poc_email = Column(String)
    prepared_by = Column(String)
    project_name = Column(String)
    revision = Column(String)
    proposal_no = Column(String)
    proposal_date = Column(Date)
    valid_till = Column(Date)

class Company(Base):
    __tablename__ = "company"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    address = Column(Text)
    email = Column(String)
    phone = Column(String)

# Stats table might be separate or calculated dynamically
