import axiosClient from "../axiosClient";
import { APIResponse } from "../types";
import type { Oven } from "./types";

const baseUrl = "/Oven";

const ovenController = {
  // GET all
  async getAll(): Promise<APIResponse<Oven[]>> {
    const { data } = await axiosClient.get<APIResponse<Oven[]>>(baseUrl);
    return data;
  },

    // GET by Id
  async getById(id: number): Promise<APIResponse<Oven>> {
    const { data } = await axiosClient.get<APIResponse<Oven>>(`${baseUrl}/id/${id}`);
    return data;
  },

  // GET last Oven
  async getLast(): Promise<APIResponse<Oven>> {
    const { data } = await axiosClient.get<APIResponse<Oven>>(`${baseUrl}/last`);
    return data;
  },
};

export default ovenController;