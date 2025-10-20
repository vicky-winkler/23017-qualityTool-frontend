// current order information

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useOrderStore = defineStore('order', () => {
    
    const orderId = ref(0);
    const kitType = ref('');
    const totAmount = ref(0);
    const doneAmount = ref(0);
    const completed = ref(false);
       
    
    // define vars based on KitType => in OrderView
    const numberBoots = ref(0);
    const frontBootSize = ref(0);
    const backBootSize = ref(0);
    const numberPasternWraps = ref(0);
    const numberYCharger = ref(0);

    function resetStore(){
        orderId.value = 0;
        kitType.value = 'none';
        totAmount.value = 0;
        doneAmount.value = 0;
        completed.value = true;
        
        setOrderVariables('none');
    }

    
    // sets Order variables based on KitType
    function setOrderVariables(kitType){

        switch(kitType) {
            case "Kit2x2":
                numberBoots.value = 4;
                frontBootSize.value = 2;
                backBootSize.value = 2;
                numberPasternWraps.value = 2;
                numberYCharger.value = 2;
                break;
            case "Kit3x2":
                numberBoots.value = 4;
                frontBootSize.value = 3;
                backBootSize.value = 2;
                numberPasternWraps.value = 2;
                numberYCharger.value = 2;
                break;
            case "Kit3x3":
                numberBoots.value = 4;
                frontBootSize.value = 3;
                backBootSize.value = 3;
                numberPasternWraps.value = 2;
                numberYCharger.value = 2;
                break;
            case "Kit4x3":
                numberBoots.value = 4;
                frontBootSize.value = 4;
                backBootSize.value = 3;
                numberPasternWraps.value = 2;
                numberYCharger.value = 2;
                break;
            case "Kit4x4":
                numberBoots.value = 4;
                frontBootSize.value = 4;
                backBootSize.value = 4;
                numberPasternWraps.value = 2;
                numberYCharger.value = 2;
                break;
            case "Kit5x4":
                numberBoots.value = 4;
                frontBootSize.value = 5;
                backBootSize.value = 4;
                numberPasternWraps.value = 2;
                numberYCharger.value = 2;
                break;
            case "Kit5x5":
                numberBoots.value = 4;
                frontBootSize.value = 5;
                backBootSize.value = 5;
                numberPasternWraps.value = 2;
                numberYCharger.value = 2;
                break;
            case "none":
                numberBoots.value = 0;
                frontBootSize.value = 0;
                backBootSize.value = 0;
                numberPasternWraps.value = 0;
                numberYCharger.value = 0;
                break;
            } 
    }



    // expose
    return { 
        orderId,
        kitType,
        totAmount,
        doneAmount,
        completed,
        
        numberBoots,
        frontBootSize,
        backBootSize,
        numberPasternWraps,
        numberYCharger,

        resetStore,
        setOrderVariables,

    }
 })