from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.team import Team
from app.schemas.team import TeamCreate, TeamResponse, TeamUpdate
from app.utils.validators import ensure_group_value


router = APIRouter(tags=["teams"])


@router.get("/teams", response_model=list[TeamResponse])
def list_teams(db: Session = Depends(get_db)) -> list[Team]:
    return db.query(Team).order_by(Team.grupo.asc(), Team.nombre.asc(), Team.id.asc()).all()


@router.post("/teams", response_model=TeamResponse, status_code=status.HTTP_201_CREATED)
def create_team(payload: TeamCreate, db: Session = Depends(get_db)) -> Team:
    team = Team(**payload.model_dump())
    db.add(team)
    db.commit()
    db.refresh(team)
    return team


@router.put("/teams/{team_id}", response_model=TeamResponse)
def update_team(team_id: int, payload: TeamUpdate, db: Session = Depends(get_db)) -> Team:
    team = db.get(Team, team_id)
    if team is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Equipo no encontrado.")

    for key, value in payload.model_dump().items():
        setattr(team, key, value)

    db.commit()
    db.refresh(team)
    return team


@router.delete("/teams/{team_id}")
def delete_team(team_id: int, db: Session = Depends(get_db)) -> dict[str, str]:
    team = db.get(Team, team_id)
    if team is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Equipo no encontrado.")

    team.activo = False
    db.commit()
    return {"message": "Equipo desactivado correctamente."}


@router.get("/teams/group/{group}", response_model=list[TeamResponse])
def list_teams_by_group(group: str, db: Session = Depends(get_db)) -> list[Team]:
    try:
        normalized_group = ensure_group_value(group)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    teams = (
        db.query(Team)
        .filter(Team.grupo == normalized_group)
        .order_by(Team.nombre.asc())
        .all()
    )
    return teams
