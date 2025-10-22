// SELECTED BOOT
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBootStore = defineStore('boot', () => {
    
    const boot = ref(null);
    const detailsModal = ref(false);
    const exportModal = ref(false);

    function resetStore(){
        boot.value = null;
        detailsModal.value = false;
        exportModal.value = false;
    }

    
    // expose
    return { 
        boot,
        detailsModal,
        exportModal,
        resetStore,

    }
 })