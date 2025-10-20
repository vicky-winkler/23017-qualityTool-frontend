import { defineStore } from "pinia";
import { ref } from "vue";


// API
import { APIResponse } from "../../services/api/types";
import { AxiosError } from "axios";
import axios from "../../services/api/axiosClient";
import { Stock } from "../../services/api/stock/types";


export const useBoxesApiStore = defineStore("stockApiStore", () => {
  const stock = ref<Stock[]>([]);

  // Get All ECU Tests
  function initStock(data: Stock[]) {
    stock.value = data;
  }


  // Get All Stock from DB
  async function dispatchStock(testMode): Promise<APIResponse<Stock[]>> {
    try {
      const response = await axios.get(testMode);
      initStock(response.data);
      return {
        success: true,
        content: response.data,
      };
    } catch (error) {
      const _error = error as AxiosError<string>;
      return {
        success: false,
        status: _error.response?.status,
        content: [new Stock()],
      };
    }
    return {
      success: false,
      content: [new Stock()],
      status: 400,
    };
  }

  return {
    stock,
    initStock,
    dispatchStock,
  };

});