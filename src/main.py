from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.admin import router as admin_router
from src.api.auth import router as auth_router
from src.api.consultations import router as consultation_router
from src.api.doctor import router as doctor_router
from src.api.patient import router as patient_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(consultation_router)
app.include_router(admin_router)
app.include_router(doctor_router)
app.include_router(patient_router)

@app.get("/")
def root():
    return {"message": "Clinical AI API running"}
