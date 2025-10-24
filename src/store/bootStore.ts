// SELECTED BOOT
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBootStore = defineStore('boot', () => {
    
    const boot = ref(null);
    const detailsModal = ref(false);
    const exportModal = ref(false);
    const bootsRfid = ref(null);
    const bootRecalDataSet = ref(null);

    function resetStore(){
        boot.value = null;
        detailsModal.value = false;
        exportModal.value = false;
        bootsRfid.value = null;
        bootRecalDataSet.value = null;
    }

    
    // expose
    return { 
        boot,
        detailsModal,
        exportModal,
        bootsRfid,
        bootRecalDataSet,
        resetStore,

    }
 })