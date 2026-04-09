from pydantic import BaseModel, ConfigDict, field_validator

from app.utils.validators import ensure_group_value


class TeamBase(BaseModel):
    nombre: str
    pais: str
    grupo: str

    @field_validator("nombre", "pais")
    @classmethod
    def validate_required_text(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Este campo es obligatorio.")
        return value

    @field_validator("grupo")
    @classmethod
    def validate_group(cls, value: str) -> str:
        return ensure_group_value(value)


class TeamCreate(TeamBase):
    activo: bool = True


class TeamUpdate(TeamBase):
    activo: bool


class TeamResponse(TeamBase):
    id: int
    activo: bool

    model_config = ConfigDict(from_attributes=True)
