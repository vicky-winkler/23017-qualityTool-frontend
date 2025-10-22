// SELECTED Box
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBoxStore = defineStore('box', () => {
    
    const box = ref(null);

    function resetStore(){
        box.value = null;
    }

    
    // expose
    return { 
        box,
        resetStore,

    }
 })