// SELECTED Recal
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRecalStore = defineStore('recal', () => {
    
    const recal = ref(null);
    const recalsRfid = ref(null);

    function resetStore(){
        recal.value = null;
        recalsRfid.value = null;
    }

    
    // expose
    return { 
        recal,
        recalsRfid,
        resetStore,

    }
 })