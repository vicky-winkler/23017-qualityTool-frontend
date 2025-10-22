// SELECTED ConditionedSensor
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConditionedSensorStore = defineStore('conditionedSensor', () => {
    
    const conditionedSensor = ref(null);

    function resetStore(){
        conditionedSensor.value = null;
    }

    
    // expose
    return { 
        conditionedSensor,
        resetStore,

    }
 })