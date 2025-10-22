// SELECTED MultiCell
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMultiCellStore = defineStore('multiCell', () => {
    
    const multiCell = ref(null);

    function resetStore(){
        multiCell.value = null;
    }

    
    // expose
    return { 
        multiCell,
        resetStore,

    }
 })