import axiosClient from "../axiosClient";
import { APIResponse } from "../types";
import type {
  Recal,
} from "./types";

const baseUrl = "/Recal";



const recalController = {
  // GET all
  async getAll(): Promise<APIResponse<Recal[]>> {
    const { data } = await axiosClient.get<APIResponse<Recal[]>>(baseUrl);
    return data;
  },

  
  // GET by id
  async getById(recalId: number): Promise<APIResponse<Recal[]>> {
    const { data } = await axiosClient.get<APIResponse<Recal[]>>(
      `${baseUrl}/id/${recalId}`
    );
    return data;
  },

  // GET by MacAddress
  async getByMacAddress(macAddress: string): Promise<APIResponse<Recal[]>> {
    const { data } = await axiosClient.get<APIResponse<Recal[]>>(
      `${baseUrl}/MacAddress/${encodeURIComponent(macAddress)}`
    );
    return data;
  },

  // GET by DeviceId
  async getByDeviceId(deviceId: string): Promise<APIResponse<Recal[]>> {
    const { data } = await axiosClient.get<APIResponse<Recal[]>>(
      `${baseUrl}/DeviceId/${encodeURIComponent(deviceId)}`
    );
    return data;
  },

  // GET by Rfid
  async getByRfid(rfid: string): Promise<APIResponse<Recal[]>> {
    const { data } = await axiosClient.get<APIResponse<Recal[]>>(
      `${baseUrl}/Rfid/${encodeURIComponent(rfid)}`
    );
    return data;
  },

  // GET by SensorId
  async getBySensorId(sensorId: number): Promise<APIResponse<Recal[]>> {
    const { data } = await axiosClient.get<APIResponse<Recal[]>>(
      `${baseUrl}/SensorId/${sensorId}`
    );
    return data;
  },

  // GET by MatrikelNumber
  async getByMatrikelNumber(matrikelNumber: number): Promise<APIResponse<Recal[]>> {
    const { data } = await axiosClient.get<APIResponse<Recal[]>>(
      `${baseUrl}/MatrikelNumber/${matrikelNumber}`
    );
    return data;
  },

  // GET last recal test
  async getLast(): Promise<APIResponse<Recal>> {
    const { data } = await axiosClient.get<APIResponse<Recal>>(`${baseUrl}/last`);
    return data;
  },

};

export default recalController;