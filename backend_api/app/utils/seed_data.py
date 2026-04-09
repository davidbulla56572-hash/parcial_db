from sqlalchemy.orm import Session

from app.models.match import Match
from app.models.team import Team


SAMPLE_TEAMS_BY_GROUP: dict[str, list[tuple[str, str]]] = {
    "A": [
        ("Argentina", "Argentina"),
        ("Canada", "Canada"),
        ("Chile", "Chile"),
        ("Peru", "Peru"),
    ],
    "B": [
        ("Mexico", "Mexico"),
        ("Ecuador", "Ecuador"),
        ("Venezuela", "Venezuela"),
        ("Jamaica", "Jamaica"),
    ],
    "C": [
        ("Estados Unidos", "Estados Unidos"),
        ("Uruguay", "Uruguay"),
        ("Panama", "Panama"),
        ("Bolivia", "Bolivia"),
    ],
    "D": [
        ("Brasil", "Brasil"),
        ("Colombia", "Colombia"),
        ("Paraguay", "Paraguay"),
        ("Costa Rica", "Costa Rica"),
    ],
    "E": [
        ("Francia", "Francia"),
        ("Paises Bajos", "Paises Bajos"),
        ("Polonia", "Polonia"),
        ("Austria", "Austria"),
    ],
    "F": [
        ("Espana", "Espana"),
        ("Croacia", "Croacia"),
        ("Marruecos", "Marruecos"),
        ("Turquia", "Turquia"),
    ],
    "G": [
        ("Alemania", "Alemania"),
        ("Portugal", "Portugal"),
        ("Suiza", "Suiza"),
        ("Hungria", "Hungria"),
    ],
    "H": [
        ("Inglaterra", "Inglaterra"),
        ("Italia", "Italia"),
        ("Dinamarca", "Dinamarca"),
        ("Serbia", "Serbia"),
    ],
}


def seed_database(db: Session) -> None:
    _seed_teams(db)
    _seed_matches(db)


def _seed_teams(db: Session) -> None:
    existing_teams = db.query(Team).count()
    if existing_teams > 0:
        return

    teams_to_create: list[Team] = []
    for group, teams in SAMPLE_TEAMS_BY_GROUP.items():
        for team_name, country_name in teams:
            teams_to_create.append(
                Team(
                    nombre=team_name,
                    pais=country_name,
                    grupo=group,
                    activo=True,
                )
            )

    db.add_all(teams_to_create)
    db.commit()


def _seed_matches(db: Session) -> None:
    existing_matches = db.query(Match).count()
    if existing_matches > 0:
        return

    matches_to_create: list[Match] = []
    sample_scores = [(2, 1), (1, 1)]

    for group in SAMPLE_TEAMS_BY_GROUP:
        teams_in_group = (
            db.query(Team)
            .filter(Team.grupo == group, Team.activo.is_(True))
            .order_by(Team.id.asc())
            .all()
        )
        if len(teams_in_group) < 4:
            continue

        pairings = [
            (teams_in_group[0], teams_in_group[1], sample_scores[0]),
            (teams_in_group[2], teams_in_group[3], sample_scores[1]),
        ]

        for local_team, away_team, (local_goals, away_goals) in pairings:
            matches_to_create.append(
                Match(
                    id_local=local_team.id,
                    id_visitante=away_team.id,
                    goles_local=local_goals,
                    goles_visitante=away_goals,
                    grupo=group,
                )
            )

    if matches_to_create:
        db.add_all(matches_to_create)
        db.commit()
