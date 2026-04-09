from pydantic import BaseModel, ConfigDict, field_validator

from app.utils.validators import ensure_group_value


class MatchBase(BaseModel):
    id_local: int
    id_visitante: int
    goles_local: int
    goles_visitante: int
    grupo: str

    @field_validator("goles_local", "goles_visitante")
    @classmethod
    def validate_goals(cls, value: int) -> int:
        if value < 0:
            raise ValueError("Los goles deben ser mayores o iguales a 0.")
        return value

    @field_validator("grupo")
    @classmethod
    def validate_group(cls, value: str) -> str:
        return ensure_group_value(value)


class MatchCreate(MatchBase):
    pass


class MatchUpdate(MatchBase):
    pass


class MatchResponse(MatchBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class MatchWinnerResponse(BaseModel):
    encuentro_id: int
    ganador: str | None
    detalle: str


class MatchResultResponse(BaseModel):
    encuentro_id: int
    marcador: str
    grupo: str
    id_local: int
    id_visitante: int
