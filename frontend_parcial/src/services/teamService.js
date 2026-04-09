import { apiClient } from "./apiClient.js";
import { mapApiTeamToUi, mapUiTeamToApi } from "../utils/tournament.js";

export const teamService = {
  async list() {
    const teams = await apiClient.get("/teams");
    return teams.map(mapApiTeamToUi);
  },

  async listByGroup(group) {
    const teams = await apiClient.get(`/teams/group/${group}`);
    return teams.map(mapApiTeamToUi);
  },

  async create(payload) {
    const team = await apiClient.post("/teams", mapUiTeamToApi(payload));
    return mapApiTeamToUi(team);
  },

  async update(teamId, payload) {
    const team = await apiClient.put(`/teams/${teamId}`, mapUiTeamToApi(payload));
    return mapApiTeamToUi(team);
  },

  async remove(teamId) {
    return apiClient.delete(`/teams/${teamId}`);
  },
};
