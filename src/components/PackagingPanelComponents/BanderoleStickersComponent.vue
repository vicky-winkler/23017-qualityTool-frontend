<template>
    <!-- Body with Grid -->
     <p>Apply Size-Stickers to the Banderole!</p>
    <div v-if="orderStore.numberBoots === 4" class="grid grid-cols-2 gap-6 pt-6">
       <PackagingCardComponent :imageFileName="`250123_Etichette_${orderStore.frontBootSize}.jpg`" :imageInfo="'Front'" :toggleNumberNeeded="false" />
       <PackagingCardComponent :imageFileName="`250123_Etichette_${orderStore.backBootSize}.jpg`" :imageInfo="'Back'"  :toggleNumberNeeded="false" />
    </div>
 
    <div v-else class="grid grid-cols-1 gap-6 pt-6">
     <PackagingCardComponent :imageFileName="`250123_Etichette_${orderStore.frontBootSize}.jpg`" :imageInfo="'Both'" :toggleNumberNeeded="false" />
    </div>
 
 </template>
     
 <script setup>
 // VUE
 import { ref, onBeforeMount, defineProps, watchEffect } from 'vue';
 
 // Custom Components
 import PackagingCardComponent from './PackagingCardComponent.vue';
 import { useOrderStore } from '../../store/orderStore';
 
 
 
 
 
 /* CODE STARTS HERE */
 
 // init stores
 const orderStore = useOrderStore();
 

 </script>