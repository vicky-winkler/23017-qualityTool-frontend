// SELECTED Oven
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useOvenStore = defineStore('oven', () => {
    
    const oven = ref(null);

    function resetStore(){
        oven.value = null;
    }

    
    // expose
    return { 
        oven,
        resetStore,

    }
 })