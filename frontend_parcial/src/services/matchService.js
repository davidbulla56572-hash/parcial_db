import { apiClient } from "./apiClient.js";
import { mapApiMatchToUi, mapUiMatchToApi } from "../utils/tournament.js";

export const matchService = {
  async list() {
    const matches = await apiClient.get("/encuentro");
    return matches.map(mapApiMatchToUi);
  },

  async getById(matchId) {
    const matches = await this.list();
    return matches.find((match) => match.id === matchId) ?? null;
  },

  async create(payload) {
    const match = await apiClient.post("/encuentro", mapUiMatchToApi(payload));
    return mapApiMatchToUi(match);
  },

  async updateGoals(matchId, payload) {
    const currentMatch = await this.getById(matchId);

    if (!currentMatch) {
      throw new Error("Encuentro no encontrado.");
    }

    const match = await apiClient.put(`/encuentro/${matchId}`, {
      ...mapUiMatchToApi({
        ...currentMatch,
        ...payload,
      }),
    });

    return mapApiMatchToUi(match);
  },

  async getWinner(matchId) {
    return apiClient.get(`/ganador/${matchId}`);
  },

  async getResult(matchId) {
    return apiClient.get(`/resultado/${matchId}`);
  },

  async getOutcome(matchId) {
    const [winner, result] = await Promise.all([
      this.getWinner(matchId),
      this.getResult(matchId),
    ]);

    return {
      ganador: winner.ganador,
      detalle: winner.detalle,
      resultado: result.marcador,
      grupo: result.grupo,
      idLocal: result.id_local,
      idVisitante: result.id_visitante,
    };
  },
};
