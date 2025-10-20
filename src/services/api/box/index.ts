import axiosClient from "../axiosClient";
import { APIResponse } from "../types";
import type {
  Box,
} from "./types";

const baseUrl = "/Box";



const boxesController = {
  // GET all
  async getAll(): Promise<APIResponse<Box[]>> {
    const { data } = await axiosClient.get<APIResponse<Box[]>>(baseUrl);
    return data;
  },

  // GET by OrderId
  async getByOrderId(orderId: number): Promise<APIResponse<Box[]>> {
    const { data } = await axiosClient.get<APIResponse<Box[]>>(
      `${baseUrl}/OrderId/${orderId}`
    );
    return data;
  },

  // GET by Id
  async getById(id: number): Promise<APIResponse<Box>> {
    const { data } = await axiosClient.get<APIResponse<Box>>(`${baseUrl}/${id}`);
    return data;
  },

  // GET last Box test
  async getLast(): Promise<APIResponse<Box>> {
    const { data } = await axiosClient.get<APIResponse<Box>>(`${baseUrl}/last`);
    return data;
  },

};

export default boxesController;