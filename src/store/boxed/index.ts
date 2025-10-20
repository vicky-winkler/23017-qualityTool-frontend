import { defineStore } from "pinia";
import { ref } from "vue";


// API
import { APIResponse } from "../../services/api/types";
import { AxiosError } from "axios";
import axios from "../../services/api/axiosClient";
import { Boxes } from "../../services/api/boxed/types";


export const useBoxesApiStore = defineStore("boxesApiStore", () => {
  const boxes = ref<Boxes[]>([]);

  // Get All ECU Tests
  function initBoxes(data: Boxes[]) {
    boxes.value = data;
  }


  // Get All EcuTests from DB
  async function dispatchBoxes(testMode): Promise<APIResponse<Boxes[]>> {
    try {
      const response = await axios.get(testMode);
      initBoxes(response.data);
      return {
        success: true,
        content: response.data,
      };
    } catch (error) {
      const _error = error as AxiosError<string>;
      return {
        success: false,
        status: _error.response?.status,
        content: [new Boxes()],
      };
    }
    return {
      success: false,
      content: [new Boxes()],
      status: 400,
    };
  }

  return {
    boxes,
    initBoxes,
    dispatchBoxes,
  };

});