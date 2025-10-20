import { defineStore } from "pinia";
import { ref } from "vue";


// API
import { APIResponse } from "../../services/api/types";
import { AxiosError } from "axios";
import axios from "../../services/api/axiosClient";
import { Orders } from "../../services/api/order/types";


export const useOrdersApiStore = defineStore("ordersApiStore", () => {
  const orders = ref<Orders[]>([]);

  // Get All ECU Tests
  function initOrders(data: Orders[]) {
    orders.value = data;
  }


  // Get All EcuTests from DB
  async function dispatchOrders(testMode): Promise<APIResponse<Orders[]>> {
    try {
      const response = await axios.get(testMode);
      initOrders(response.data);
      return {
        success: true,
        content: response.data,
      };
    } catch (error) {
      const _error = error as AxiosError<string>;
      return {
        success: false,
        status: _error.response?.status,
        content: [new Orders()],
      };
    }
    return {
      success: false,
      content: [new Orders()],
      status: 400,
    };
  }

  return {
    orders,
    initOrders,
    dispatchOrders,
  };

});