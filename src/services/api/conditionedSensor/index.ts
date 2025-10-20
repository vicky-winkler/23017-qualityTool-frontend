import axiosClient from "../axiosClient";
import { APIResponse } from "../types";
import type {
  ConditionedSensor,
} from "./types";

const baseUrl = "/ConditionedSensor";



const conditionedSensorController = {
  // GET all
  async getAll(): Promise<APIResponse<ConditionedSensor[]>> {
    const { data } = await axiosClient.get<APIResponse<ConditionedSensor[]>>(baseUrl);
    return data;
  },

  // GET by Id
  async getById(sensorId: number): Promise<APIResponse<ConditionedSensor[]>> {
    const { data } = await axiosClient.get<APIResponse<ConditionedSensor[]>>(
      `${baseUrl}/id/${sensorId}`
    );
    return data;
  },

  // GET by Size
  async getBySize(size: number): Promise<APIResponse<ConditionedSensor[]>> {
    const { data } = await axiosClient.get<APIResponse<ConditionedSensor[]>>(
      `${baseUrl}/size/${size}`
    );
    return data;
  },

  // GET by SerialNumber
  async getBySerialNumber(serialNumber: string): Promise<APIResponse<ConditionedSensor[]>> {
    const { data } = await axiosClient.get<APIResponse<ConditionedSensor[]>>(
      `${baseUrl}/SerialNumber/${encodeURIComponent(serialNumber)}`
    );
    return data;
  },

  // GET by Rfid
  async getByRfid(rfid: string): Promise<APIResponse<ConditionedSensor[]>> {
    const { data } = await axiosClient.get<APIResponse<ConditionedSensor[]>>(
      `${baseUrl}/Rfid/${encodeURIComponent(rfid)}`
    );
    return data;
  },

  // GET by IEESerialNumber
  async getByIEESerialNumber(ieeSerialNumber: string): Promise<APIResponse<ConditionedSensor[]>> {
    const { data } = await axiosClient.get<APIResponse<ConditionedSensor[]>>(
      `${baseUrl}/IEESerialNumber/${encodeURIComponent(ieeSerialNumber)}`
    );
    return data;
  },

  // GET last sensor test
  async getLast(): Promise<APIResponse<ConditionedSensor>> {
    const { data } = await axiosClient.get<APIResponse<ConditionedSensor>>(`${baseUrl}/last`);
    return data;
  },


};

export default conditionedSensorController;