import { GROUP_OPTIONS } from "../data/groupOptions.js";

export const findRouteByKey = (routes, key) =>
  routes.find((route) => route.key === key);

export const getGroupLabel = (group) => `Grupo ${group}`;

export const getGroupFilterOptions = () => GROUP_OPTIONS.map((group) => ({
  value: group,
  label: getGroupLabel(group),
}));

export const getTeamNameById = (teams, teamId) =>
  teams.find((team) => team.id === teamId)?.nombre ?? "Equipo no disponible";

export const enrichMatchesWithTeams = (matches, teams) =>
  matches.map((match) => ({
    ...match,
    nombreLocal: getTeamNameById(teams, match.idLocal),
    nombreVisitante: getTeamNameById(teams, match.idVisitante),
  }));

export const filterByGroup = (items, selectedGroup) =>
  selectedGroup === "TODOS"
    ? items
    : items.filter((item) => item.grupo === selectedGroup);

export const getTeamsByGroup = (teams, group) =>
  teams.filter((team) => team.grupo === group);

export const getAvailableOpponentOptions = (teams, group, currentLocalId) =>
  getTeamsByGroup(teams, group).filter((team) => team.id !== Number(currentLocalId));

export const getTeamById = (teams, teamId) =>
  teams.find((team) => team.id === Number(teamId)) ?? null;

export const mapApiTeamToUi = (team) => ({
  id: team.id,
  nombre: team.nombre,
  pais: team.pais,
  grupo: team.grupo,
  activo: team.activo,
});

export const mapUiTeamToApi = (team) => ({
  nombre: team.nombre,
  pais: team.pais,
  grupo: team.grupo,
  activo: team.activo,
});

export const mapApiMatchToUi = (match) => ({
  id: match.id,
  idLocal: match.id_local,
  idVisitante: match.id_visitante,
  golesLocal: match.goles_local,
  golesVisitante: match.goles_visitante,
  grupo: match.grupo,
});

export const mapUiMatchToApi = (match) => ({
  id_local: match.idLocal,
  id_visitante: match.idVisitante,
  goles_local: match.golesLocal,
  goles_visitante: match.golesVisitante,
  grupo: match.grupo,
});

const createStandingRow = (team) => ({
  id: team.id,
  nombre: team.nombre,
  pais: team.pais,
  grupo: team.grupo,
  puntos: 0,
  jugados: 0,
  golesFavor: 0,
  golesContra: 0,
  diferenciaGol: 0,
});

export const groupTeamsByGroup = (teams) =>
  teams.reduce((groups, team) => {
    if (!groups[team.grupo]) {
      groups[team.grupo] = [];
    }

    groups[team.grupo].push(team);
    return groups;
  }, {});

export const calculateGroupStandings = (teams, matches) => {
  const groups = groupTeamsByGroup(teams);

  return Object.entries(groups)
    .map(([group, groupTeams]) => {
      const standingsMap = new Map(
        groupTeams.map((team) => [team.id, createStandingRow(team)]),
      );

      matches
        .filter((match) => match.grupo === group)
        .forEach((match) => {
          const localTeam = standingsMap.get(match.idLocal);
          const visitorTeam = standingsMap.get(match.idVisitante);

          if (!localTeam || !visitorTeam) {
            return;
          }

          localTeam.jugados += 1;
          visitorTeam.jugados += 1;
          localTeam.golesFavor += match.golesLocal;
          localTeam.golesContra += match.golesVisitante;
          visitorTeam.golesFavor += match.golesVisitante;
          visitorTeam.golesContra += match.golesLocal;

          if (match.golesLocal > match.golesVisitante) {
            localTeam.puntos += 3;
          } else if (match.golesLocal < match.golesVisitante) {
            visitorTeam.puntos += 3;
          } else {
            localTeam.puntos += 1;
            visitorTeam.puntos += 1;
          }
        });

      const standings = Array.from(standingsMap.values())
        .map((team) => ({
          ...team,
          diferenciaGol: team.golesFavor - team.golesContra,
        }))
        .sort((a, b) => {
          if (b.puntos !== a.puntos) {
            return b.puntos - a.puntos;
          }

          if (b.diferenciaGol !== a.diferenciaGol) {
            return b.diferenciaGol - a.diferenciaGol;
          }

          if (b.golesFavor !== a.golesFavor) {
            return b.golesFavor - a.golesFavor;
          }

          return a.nombre.localeCompare(b.nombre);
        });

      return {
        group,
        teams: groupTeams,
        standings,
        leader: standings[0] ?? null,
      };
    })
    .sort((a, b) => a.group.localeCompare(b.group));
};
