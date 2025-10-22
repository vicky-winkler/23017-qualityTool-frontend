// SELECTED SingleCell
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSingleCellStore = defineStore('singleCell', () => {
    
    const singleCell = ref(null);
    const detailsModal = ref(false);

    function resetStore(){
        singleCell.value = null;
        detailsModal.value = false;
    }

    
    // expose
    return { 
        singleCell,
        detailsModal,
        resetStore,

    }
 })