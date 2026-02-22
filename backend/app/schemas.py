from pydantic import BaseModel
from typing import Optional, List
from datetime import date

class MemberBase(BaseModel):
    name: str
    role: str
    email: str
    contact: str

class MemberCreate(MemberBase):
    password: str

class MemberUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    email: Optional[str] = None
    contact: Optional[str] = None
    password: Optional[str] = None

class Member(MemberBase):
    id: int
    # hashed_password not returned

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class ClientBase(BaseModel):
    name: str
    client_id: str
    address: Optional[str] = None
    poc: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None

class ClientCreate(ClientBase):
    pass

class ClientUpdate(BaseModel):
    name: Optional[str] = None
    client_id: Optional[str] = None
    address: Optional[str] = None
    poc: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None

class Client(ClientBase):
    id: int

    class Config:
        from_attributes = True

class VendorBase(BaseModel):
    name: str
    vendor_id: str
    address: Optional[str] = None
    poc: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    raw_materials: Optional[str] = None

class VendorCreate(VendorBase):
    pass

class VendorUpdate(BaseModel):
    name: Optional[str] = None
    vendor_id: Optional[str] = None
    address: Optional[str] = None
    poc: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    raw_materials: Optional[str] = None

class Vendor(VendorBase):
    id: int

    class Config:
        from_attributes = True

class ProjectBase(BaseModel):
    name: str
    quotation_no: str
    status: str
    poc_phone: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    quotation_no: Optional[str] = None
    status: Optional[str] = None
    poc_phone: Optional[str] = None

class Project(ProjectBase):
    id: int

    class Config:
        from_attributes = True

class EstimationBase(BaseModel):
    id: str # Custom ID logic from frontend
    client_name: str
    billing_address: Optional[str] = None
    ship_to_address: Optional[str] = None
    poc_name: Optional[str] = None
    poc_phone: Optional[str] = None
    poc_email: Optional[str] = None
    prepared_by: Optional[str] = None
    project_name: str
    revision: Optional[str] = None
    proposal_no: Optional[str] = None
    proposal_date: Optional[str] = None # Using string for simplicity initially, or datetime
    valid_till: Optional[str] = None

class EstimationCreate(EstimationBase):
    pass

class Estimation(EstimationBase):
    class Config:
        from_attributes = True

class CompanyBase(BaseModel):
    name: str
    address: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

class CompanyCreate(CompanyBase):
    pass

class Company(CompanyBase):
    id: int

    class Config:
        from_attributes = True

class Stats(BaseModel):
    total_clients: int
    active_projects: int
    quotations: int
    completed_jobs: int

    class Config:
        from_attributes = True
