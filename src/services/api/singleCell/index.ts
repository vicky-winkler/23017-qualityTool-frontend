import axiosClient from "../axiosClient";
import { APIResponse } from "../types";
import type {
  QualitySingles,
} from "./types";

const baseUrl = "/QualitySingle";



const qualitySinglesController = {
  // GET all
  async getAll(): Promise<APIResponse<QualitySingles[]>> {
    const { data } = await axiosClient.get<APIResponse<QualitySingles[]>>(baseUrl);
    return data;
  },

};

export default qualitySinglesController;