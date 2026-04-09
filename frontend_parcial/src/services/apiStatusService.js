import { apiClient } from "./apiClient.js";

export const apiStatusService = {
  async getStatus() {
    return apiClient.get("/");
  },
};
