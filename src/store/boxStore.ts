// SELECTED Box
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBoxStore = defineStore('box', () => {
    
    const box = ref(null);
    const detailsModal = ref(false);
    const shoeDetails = ref(false);
    const exportModal = ref(false);

    function resetStore(){
        box.value = null;
        detailsModal.value = false;
        exportModal.value = false;
        shoeDetails.value = false;
    }

    
    // expose
    return { 
        box,
        detailsModal,
        exportModal,
        shoeDetails,
        resetStore,

    }
 })