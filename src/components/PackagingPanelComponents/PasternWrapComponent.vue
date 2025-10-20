<template>
    <!-- Body with Grid -->
    <div v-if="orderStore.numberBoots === 4" class="grid grid-cols-2 gap-6 pt-6">
       <PackagingCardComponent :imageFileName="'Socks.jpg'" :imageInfo="`Front - ${frontSize}`" :numberNeeded="1" ref="frontPasternWrapComponent"/>
       <PackagingCardComponent :imageFileName="'Socks.jpg'" :imageInfo="`Back - ${backSize}`"  :numberNeeded="1" ref="backPasternWrapComponent"/>
    </div>
 
    <div v-else class="grid grid-cols-1 gap-6 pt-6">
     <PackagingCardComponent :imageFileName="'Socks.jpg'" :imageInfo="`${frontSize}`" :numberNeeded="1" ref="frontPasternWrapComponent"/>
    </div>
 
 </template>

 <script setup>
 // VUE
 import { ref, onBeforeMount, onMounted } from 'vue';
 
 // Custom Components
 import PackagingCardComponent from './PackagingCardComponent.vue';
 import { useOrderStore } from '../../store/orderStore';
 
 
 
 
 /* CODE STARTS HERE */
 
 // init stores
 const orderStore = useOrderStore();
 
 // Initialize Components
 const frontSize = ref("x");
 const backSize = ref("x");

const frontPasternWrapComponent = ref();
const backPasternWrapComponent = ref();

// Size 2 => M
// Size 3 + 4 => L
// Size 5 => XL


onBeforeMount(() =>{
   // determine Sizes
   determineFrontSize();
   if(orderStore.numberBoots === 4){
      determineBackSize();
   }
});


// determine front size
function determineFrontSize(){
   console.log("front size" + orderStore.frontBootSize);
   if(orderStore.frontBootSize === 2){
      frontSize.value = "M";
   }
   else if(orderStore.frontBootSize === 3 || orderStore.frontBootSize === 4){
      frontSize.value = "L";
   }
   else if(orderStore.frontBootSize === 5){
      frontSize.value = "XL";
   }
}

// determine back size
function determineBackSize(){
   if(orderStore.backBootSize === 2){
      backSize.value = "M";
   }
   else if(orderStore.backBootSize === 3 || orderStore.backBootSize === 4){
      backSize.value = "L";
   }
   else if(orderStore.backBootSize === 5){
      backSize.value = "XL";
   }
}  


// determine Pastern Wrap
function determinePasternWrap(indicator){
   console.log("Pastern Wrap determine: "+ indicator);
   if(indicator === "front"){
      frontPasternWrapComponent.value.increaseNumberAdded();
   }
   else if(indicator === "back"){
      backPasternWrapComponent.value.increaseNumberAdded();
   }
}
 




defineExpose({
   determinePasternWrap,

});


 </script>