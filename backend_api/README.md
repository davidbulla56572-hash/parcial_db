# Backend API

API REST sencilla para gestionar equipos y encuentros de una fase de grupos usando FastAPI, SQLAlchemy y PostgreSQL.

## Requisitos

- Python 3.11 o superior
- `uv` instalado
- PostgreSQL local con la base de datos `parcial_db`

## Instalacion

```bash
uv sync
```

## Ejecucion

```bash
uv run uvicorn app.main:app --reload
```

La documentacion interactiva queda disponible en `http://127.0.0.1:8000/docs`.
