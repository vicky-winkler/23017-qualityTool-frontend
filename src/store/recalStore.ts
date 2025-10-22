// SELECTED Recal
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRecalStore = defineStore('recal', () => {
    
    const recal = ref(null);

    function resetStore(){
        recal.value = null;
    }

    
    // expose
    return { 
        recal,
        resetStore,

    }
 })