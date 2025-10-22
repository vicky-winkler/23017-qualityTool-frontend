// SELECTED SingleCell
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSingleCellStore = defineStore('singleCell', () => {
    
    const singleCell = ref(null);

    function resetStore(){
        singleCell.value = null;
    }

    
    // expose
    return { 
        singleCell,
        resetStore,

    }
 })