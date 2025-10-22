// SELECTED Box
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBoxStore = defineStore('box', () => {
    
    const box = ref(null);
    const detailsModal = ref(false);

    function resetStore(){
        box.value = null;
        detailsModal.value = false;
    }

    
    // expose
    return { 
        box,
        detailsModal,
        resetStore,

    }
 })