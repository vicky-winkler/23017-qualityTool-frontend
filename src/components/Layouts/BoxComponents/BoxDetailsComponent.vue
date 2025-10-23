<template>
  <div v-if="boxStore.box">
    <!-- General Info -->
    <div class="grid grid-cols-4 mb-4">
        <div class="font-medium mb-2">Id</div>
        <div>{{ boxStore.box.id }}</div>
        <div class="font-medium">Order Id</div>
        <div>{{ boxStore.box.orderId }}</div>
        <div class="font-medium mb-2">Serial Number</div>
        <div>{{ boxStore.box.serialNumber }}</div>
        <div class="font-medium">Kit Type</div>
        <div>{{ boxStore.box.kitType }}</div>
        <div class="font-medium mb-2">Creator Id</div>
        <div>{{ boxStore.box.matrikelNummer }}</div>
        <div class="font-medium">TimeStamp</div>
        <div>{{ formatTimestamp(boxStore.box.timeStamp) }}</div>
        <div class="font-medium mb-2">Language</div>
        <div>{{ boxStore.box.language }}</div>
        <div class="font-medium">Version</div>
        <div class="mb-2">{{ boxStore.box.version }}</div>
    </div>

    <!-- Shoes -->
    <div class="grid grid-cols-2 gap-6 pt-6">
      <CardComponent
        v-for="(rfid, index) in boxStore.box?.sensorTestRFIDs"
        :key="index"
        :imageFileName="'Shoe.jpg'"
        :imageInfo="`Boot ${index + 1}: ${rfid}`"
        :itemName="boxStore.box.sensorSerialNumbers[index]"
        :ecuDeviceId="deviceIdHyphenated(boxStore.box.ecuDeviceIds[index])"
        :toggle-hover="true"
        @click="openShoe(rfid)"
      />
    </div>

  </div>
</template>
  
<script setup>

// VUE
import { RouterLink } from "vue-router";
import { onMounted, onUnmounted, ref } from 'vue';

// Messaging and Commands


// Stores & Data
import { useBoxStore } from "../../../store/boxStore";

// Primevue Components
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import ProgressBar from 'primevue/progressbar';
import Toast from 'primevue/toast';
import { useToast } from "primevue/usetoast";

// Custom Components
import CardComponent from "./CardComponent.vue";


/* CODE STARTS HERE */

// init stores
const toast = useToast();
const boxStore = useBoxStore();


// Opens selected shoe
function openShoe(rfid){
  console.log("open shoe: " + rfid);
}

// Format timestamp to something more readable
function formatTimestamp(timestamp){
    // parse
    const dateMs = Date.parse(timestamp);
    const date = new Date(dateMs);

    var month = "";

    if((date.getMonth()+1) < 10){
        month = "0" +  (date.getMonth() + 1);
    }
    else{
        month =(date.getMonth() + 1);
    }


    return "" + date.getDate() + "." + month + "." + date.getFullYear() + "\t" + date.getHours() + ":" + date.getMinutes();

}



// Sets status of EndTest
function setStatus(statusArray){
  return checkAllTrue(statusArray) ? 'PASS' : 'FAIL';
}


// Get Severity for Completed => COMPLETE = GREEN, not COMpleted = RED
function getSeverity(statusArray){
  return checkAllTrue(statusArray) ? 'success' : 'danger';
}


// Helper for Status checking
function checkAllTrue(statusArray){
  return Array.isArray(statusArray) && statusArray.every((s) => s === true);
}

// devIdHyphenated
function deviceIdHyphenated(deviceId) {
  if (!deviceId || deviceId.length % 2 !== 0) {
    throw new Error("Invalid device ID format.");
  }

  const bytes = [];

  for (let i = 0; i < deviceId.length; i += 2) {
    const hexPair = deviceId.substring(i, i + 2);
    const decimalValue = parseInt(hexPair, 16);
    bytes.push(decimalValue.toString());
  }

  return bytes.join("-");
}

</script>


<style scoped>

.footer-bottom {
  bottom: 0;
  position: fixed;
  width: 100%;
}

</style>>