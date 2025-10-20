<template>
   <!-- Body with Grid -->
   <div v-if="orderStore.numberBoots === 4" class="grid grid-cols-2 gap-6 pt-6" >
      <PackagingCardComponent :imageFileName="'Shoe.jpg'" :imageInfo="`Front-Left ( Size ${orderStore.frontBootSize} )`" :numberNeeded="1" ref="frontLeftComponent"/>
      <PackagingCardComponent :imageFileName="'Shoe.jpg'" :imageInfo="`Front-Right ( Size ${orderStore.frontBootSize} )`"  :numberNeeded="1" ref="frontRightComponent"/>
      <PackagingCardComponent :imageFileName="'Shoe.jpg'" :imageInfo="`Back-Left ( Size ${orderStore.backBootSize} )`"  :numberNeeded="1" ref="backLeftComponent"/>
      <PackagingCardComponent :imageFileName="'Shoe.jpg'" :imageInfo="`Back-Right ( Size ${orderStore.backBootSize} )`" :numberNeeded="1" ref="backRightComponent"/>
   </div>

   <div v-else class="grid grid-cols-2 gap-6 pt-6">
    <PackagingCardComponent :imageFileName="'Shoe.jpg'" :imageInfo="`Left ( Size ${orderStore.frontBootSize} )`" :numberNeeded="1" ref="frontLeftComponent" />
    <PackagingCardComponent :imageFileName="'Shoe.jpg'" :imageInfo="`Right ( Size ${orderStore.frontBootSize} )`"  :numberNeeded="1" ref="frontRightComponent"/>
   </div>

</template>
    
<script setup>
// VUE
import { ref, nextTick } from 'vue';

// Custom Components
import PackagingCardComponent from './PackagingCardComponent.vue';
import { useOrderStore } from '../../store/orderStore';



/* CODE STARTS HERE */

// init stores
const orderStore = useOrderStore();

// Initialize Components
const frontLeftComponent = ref();
const frontRightComponent = ref();
const backLeftComponent = ref();
const backRightComponent = ref();



// determines Position of Boot and shows RFID and Size
function determineBoot(rfid, size, positionArray){

   if(positionArray === 0){
      frontLeftComponent.value.addItemName(`${rfid}`);
      frontLeftComponent.value.increaseNumberAdded();
      frontLeftComponent.value.toggleNumberNeeded = false;
   }
   else if(positionArray === 1){
      frontRightComponent.value.addItemName(`${rfid}`);
      frontRightComponent.value.increaseNumberAdded();
      frontRightComponent.value.toggleNumberNeeded = false;
   }
   else if(positionArray === 2){
      backLeftComponent.value.addItemName(`${rfid}`);
      backLeftComponent.value.increaseNumberAdded();
      backLeftComponent.value.toggleNumberNeeded = false;
   }
   else if(positionArray === 3){
      backRightComponent.value.addItemName(`${rfid}`);
      backRightComponent.value.increaseNumberAdded();
      backRightComponent.value.toggleNumberNeeded = false;
   }
  
}




defineExpose({
   determineBoot,

});

</script>