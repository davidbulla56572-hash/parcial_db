from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Match(Base):
    __tablename__ = "matches"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    id_local: Mapped[int] = mapped_column(Integer, nullable=False)
    id_visitante: Mapped[int] = mapped_column(Integer, nullable=False)
    goles_local: Mapped[int] = mapped_column(Integer, nullable=False)
    goles_visitante: Mapped[int] = mapped_column(Integer, nullable=False)
    grupo: Mapped[str] = mapped_column(String(1), nullable=False, index=True)
