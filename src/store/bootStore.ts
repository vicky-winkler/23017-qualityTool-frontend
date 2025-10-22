// SELECTED BOOT
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBootStore = defineStore('boot', () => {
    
    const boot = ref(null);
    const detailsModal = ref(false);

    function resetStore(){
        boot.value = null;
        detailsModal.value = false;
    }

    
    // expose
    return { 
        boot,
        detailsModal,
        resetStore,

    }
 })