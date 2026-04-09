from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import models  # noqa: F401
from app.database import Base, SessionLocal, engine
from app.routers.matches import router as matches_router
from app.routers.teams import router as teams_router
from app.utils.seed_data import seed_database


Base.metadata.create_all(bind=engine)

app = FastAPI(title="API Fase de Grupos")

allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(teams_router)
app.include_router(matches_router)


@app.on_event("startup")
def startup_seed_data() -> None:
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()


@app.get("/")
def read_root() -> dict[str, str]:
    return {"message": "API de fase de grupos disponible"}
