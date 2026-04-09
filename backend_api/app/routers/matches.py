from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.match import Match
from app.schemas.match import (
    MatchCreate,
    MatchResponse,
    MatchResultResponse,
    MatchUpdate,
    MatchWinnerResponse,
)


router = APIRouter(tags=["encuentros"])


@router.get("/encuentro", response_model=list[MatchResponse])
def list_matches(db: Session = Depends(get_db)) -> list[Match]:
    return db.query(Match).order_by(Match.grupo.asc(), Match.id.asc()).all()


@router.post("/encuentro", response_model=MatchResponse, status_code=status.HTTP_201_CREATED)
def create_match(payload: MatchCreate, db: Session = Depends(get_db)) -> Match:
    match = Match(**payload.model_dump())
    db.add(match)
    db.commit()
    db.refresh(match)
    return match


@router.put("/encuentro/{match_id}", response_model=MatchResponse)
def update_match(match_id: int, payload: MatchUpdate, db: Session = Depends(get_db)) -> Match:
    match = db.get(Match, match_id)
    if match is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Encuentro no encontrado.")

    for key, value in payload.model_dump().items():
        setattr(match, key, value)

    db.commit()
    db.refresh(match)
    return match


@router.get("/ganador/{match_id}", response_model=MatchWinnerResponse)
def get_match_winner(match_id: int, db: Session = Depends(get_db)) -> MatchWinnerResponse:
    match = db.get(Match, match_id)
    if match is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Encuentro no encontrado.")

    if match.goles_local > match.goles_visitante:
        return MatchWinnerResponse(
            encuentro_id=match.id,
            ganador="local",
            detalle=f"El equipo local con id {match.id_local} es el ganador.",
        )
    if match.goles_visitante > match.goles_local:
        return MatchWinnerResponse(
            encuentro_id=match.id,
            ganador="visitante",
            detalle=f"El equipo visitante con id {match.id_visitante} es el ganador.",
        )

    return MatchWinnerResponse(
        encuentro_id=match.id,
        ganador=None,
        detalle="El encuentro termino en empate.",
    )


@router.get("/resultado/{match_id}", response_model=MatchResultResponse)
def get_match_result(match_id: int, db: Session = Depends(get_db)) -> MatchResultResponse:
    match = db.get(Match, match_id)
    if match is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Encuentro no encontrado.")

    return MatchResultResponse(
        encuentro_id=match.id,
        marcador=f"{match.goles_local}-{match.goles_visitante}",
        grupo=match.grupo,
        id_local=match.id_local,
        id_visitante=match.id_visitante,
    )
