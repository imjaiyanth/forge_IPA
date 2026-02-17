from fastapi import FastAPI, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from . import models, schemas, crud, database, auth
from .database import engine
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Annotated

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

from fastapi.middleware.cors import CORSMiddleware

import os

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173", # Vite default
    "http://127.0.0.1:5173",
    "http://localhost:8080",
    "http://127.0.0.1:8080",
]

# Add environment variable origins
allowed_origins_env = os.getenv("ALLOWED_ORIGINS")
if allowed_origins_env:
    origins.extend([origin.strip() for origin in allowed_origins_env.split(",")])

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Support Private Network Access (PNA) preflight for browser -> loopback requests
# Modern browsers send `Access-Control-Request-Private-Network: true` on preflight when a
# public origin tries to access a loopback/private address (e.g. 127.0.0.1).
# The browser will block the request unless the preflight response includes
# `Access-Control-Allow-Private-Network: true`.
@app.middleware("http")
async def add_private_network_header(request: Request, call_next):
    response = await call_next(request)
    if request.method == "OPTIONS" and request.headers.get("access-control-request-private-network"):
        response.headers["Access-Control-Allow-Private-Network"] = "true"
    return response

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        from jose import JWTError, jwt
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = crud.get_member_by_email(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user

@app.on_event("startup")
def startup_event():
    db = database.SessionLocal()
    # Check if admin user exists
    user = crud.get_member_by_email(db, "jai@forgeipa.com")
    if not user:
        # Create admin user
        # Note: We need a schema for creation, constructing it manually here
        user_in = schemas.MemberCreate(
            name="Jai",
            role="Admin",
            email="jai@forgeipa.com",
            contact="1234567890",
            password="admin123"
        )
        crud.create_member(db, user_in)
        print("Admin user created: jai@forgeipa.com")
    db.close()

@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(get_db)
):
    user = crud.get_member_by_email(db, form_data.username)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = auth.timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=schemas.Member)
async def read_users_me(current_user: Annotated[schemas.Member, Depends(get_current_user)]):
    return current_user

@app.get("/")
def read_root():
    return {"message": "Welcome to Forge Estimates API"}

# Members
@app.get("/members", response_model=list[schemas.Member])
def read_members(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    members = crud.get_members(db, skip=skip, limit=limit)
    return members

@app.post("/members", response_model=schemas.Member)
def create_member(member: schemas.MemberCreate, db: Session = Depends(get_db)):
    return crud.create_member(db=db, member=member)

@app.put("/members/{member_id}", response_model=schemas.Member)
def update_member(member_id: int, member: schemas.MemberUpdate, db: Session = Depends(get_db)):
    db_member = crud.get_member(db, member_id=member_id)
    if db_member is None:
        raise HTTPException(status_code=404, detail="Member not found")
    return crud.update_member(db=db, member_id=member_id, member=member)

@app.delete("/members/{member_id}", response_model=schemas.Member)
def delete_member(member_id: int, db: Session = Depends(get_db)):
    db_member = crud.get_member(db, member_id=member_id)
    if db_member is None:
        raise HTTPException(status_code=404, detail="Member not found")
    return crud.delete_member(db=db, member_id=member_id)

# Clients
@app.get("/clients", response_model=list[schemas.Client])
def read_clients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    clients = crud.get_clients(db, skip=skip, limit=limit)
    return clients

@app.post("/clients", response_model=schemas.Client)
def create_client(client: schemas.ClientCreate, db: Session = Depends(get_db)):
    return crud.create_client(db=db, client=client)

@app.put("/clients/{client_id}", response_model=schemas.Client)
def update_client(client_id: int, client: schemas.ClientUpdate, db: Session = Depends(get_db)):
    db_client = crud.get_client(db, client_id=client_id)
    if db_client is None:
        raise HTTPException(status_code=404, detail="Client not found")
    return crud.update_client(db=db, client_id=client_id, client=client)

@app.delete("/clients/{client_id}", response_model=schemas.Client)
def delete_client(client_id: int, db: Session = Depends(get_db)):
    db_client = crud.get_client(db, client_id=client_id)
    if db_client is None:
        raise HTTPException(status_code=404, detail="Client not found")
    return crud.delete_client(db=db, client_id=client_id)

# Vendors
@app.get("/vendors", response_model=list[schemas.Vendor])
def read_vendors(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    vendors = crud.get_vendors(db, skip=skip, limit=limit)
    return vendors

@app.post("/vendors", response_model=schemas.Vendor)
def create_vendor(vendor: schemas.VendorCreate, db: Session = Depends(get_db)):
    return crud.create_vendor(db=db, vendor=vendor)

@app.put("/vendors/{vendor_id}", response_model=schemas.Vendor)
def update_vendor(vendor_id: int, vendor: schemas.VendorUpdate, db: Session = Depends(get_db)):
    db_vendor = crud.get_vendor(db, vendor_id=vendor_id)
    if db_vendor is None:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return crud.update_vendor(db=db, vendor_id=vendor_id, vendor=vendor)

@app.delete("/vendors/{vendor_id}", response_model=schemas.Vendor)
def delete_vendor(vendor_id: int, db: Session = Depends(get_db)):
    db_vendor = crud.get_vendor(db, vendor_id=vendor_id)
    if db_vendor is None:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return crud.delete_vendor(db=db, vendor_id=vendor_id)

# Projects
@app.get("/projects", response_model=list[schemas.Project])
def read_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    projects = crud.get_projects(db, skip=skip, limit=limit)
    return projects

@app.post("/projects", response_model=schemas.Project)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db)):
    return crud.create_project(db=db, project=project)

@app.put("/projects/{project_id}", response_model=schemas.Project)
def update_project(project_id: int, project: schemas.ProjectUpdate, db: Session = Depends(get_db)):
    db_project = crud.get_project(db, project_id=project_id)
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return crud.update_project(db=db, project_id=project_id, project=project)

@app.delete("/projects/{project_id}", response_model=schemas.Project)
def delete_project(project_id: int, db: Session = Depends(get_db)):
    db_project = crud.get_project(db, project_id=project_id)
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return crud.delete_project(db=db, project_id=project_id)

# Estimations
@app.get("/estimations", response_model=list[schemas.Estimation])
def read_estimations(db: Session = Depends(get_db)):
    estimations = crud.get_estimations(db)
    return estimations

@app.post("/estimations", response_model=schemas.Estimation)
def create_estimation(estimation: schemas.EstimationCreate, db: Session = Depends(get_db)):
    return crud.create_estimation(db=db, estimation=estimation)

# Company
@app.get("/company", response_model=schemas.Company)
def read_company(db: Session = Depends(get_db)):
    company = crud.get_company(db)
    if company is None:
        raise HTTPException(status_code=404, detail="Company not found")
    return company

@app.post("/company", response_model=schemas.Company)
def create_or_update_company(company: schemas.CompanyCreate, db: Session = Depends(get_db)):
    return crud.update_company(db=db, company=company)
