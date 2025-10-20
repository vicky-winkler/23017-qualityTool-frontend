// User information
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useOverallStore = defineStore('overall', () => {
    
    const username = ref('');
    const isAdmin = ref(false);

    function resetStore(){
        username.value = '';
        isAdmin.value = false;
    }

    
    // expose
    return { 
        username,
        isAdmin,
        
        resetStore,

    }
 })