import axiosClient from "../axiosClient";
import { APIResponse } from "../types";
import type {
  Boot,
} from "./types";

const baseUrl = "/Boot";



const bootController = {
  // GET all
  async getAll(): Promise<APIResponse<Boot[]>> {
    const { data } = await axiosClient.get<APIResponse<Boot[]>>(baseUrl);
    return data;
  },
  
  // GET by id
  async getById(bootId: number): Promise<APIResponse<Boot[]>> {
    const { data } = await axiosClient.get<APIResponse<Boot[]>>(
      `${baseUrl}/id/${bootId}`
    );
    return data;
  },

  // GET by MacAddress
  async getByMacAddress(macAddress: string): Promise<APIResponse<Boot[]>> {
    const { data } = await axiosClient.get<APIResponse<Boot[]>>(
      `${baseUrl}/MacAddress/${encodeURIComponent(macAddress)}`
    );
    return data;
  },

  // GET by DeviceId
  async getByDeviceId(deviceId: string): Promise<APIResponse<Boot[]>> {
    const { data } = await axiosClient.get<APIResponse<Boot[]>>(
      `${baseUrl}/DeviceId/${encodeURIComponent(deviceId)}`
    );
    return data;
  },

  // GET by Rfid
  async getByRfid(rfid: string): Promise<APIResponse<Boot[]>> {
    const { data } = await axiosClient.get<APIResponse<Boot[]>>(
      `${baseUrl}/Rfid/${encodeURIComponent(rfid)}`
    );
    return data;
  },

  // GET by SensorId
  async getBySensorId(sensorId: number): Promise<APIResponse<Boot[]>> {
    const { data } = await axiosClient.get<APIResponse<Boot[]>>(
      `${baseUrl}/SensorId/${sensorId}`
    );
    return data;
  },

  // GET by MatrikelNumber
  async getByMatrikelNumber(matrikelNumber: number): Promise<APIResponse<Boot[]>> {
    const { data } = await axiosClient.get<APIResponse<Boot[]>>(
      `${baseUrl}/MatrikelNumber/${matrikelNumber}`
    );
    return data;
  },

  // GET last boot test
  async getLast(): Promise<APIResponse<Boot>> {
    const { data } = await axiosClient.get<APIResponse<Boot>>(`${baseUrl}/last`);
    return data;
  },

};

export default bootController;