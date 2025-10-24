// SELECTED ConditionedSensor
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConditionedSensorStore = defineStore('conditionedSensor', () => {
    
    const conditionedSensorSerialNumber = ref(null);
    const conditionedSensor = ref(null);
    const replaceRfidModal = ref(false);
    const replaceRfidInput = ref('');

    function resetStore(){
        conditionedSensorSerialNumber.value = null;
        conditionedSensor.value = null;
        replaceRfidModal.value = false;
        replaceRfidInput.value = '';
    }

    
    // expose
    return { 
        conditionedSensorSerialNumber,
        conditionedSensor,
        replaceRfidModal,
        replaceRfidInput,
        resetStore,

    }
 })