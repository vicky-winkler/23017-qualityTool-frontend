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
        :imageInfo="boxStore.box.sensorSerialNumbers[index]"
        :itemName="`${rfid}`"
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
import { useBootStore } from "../../../store/bootStore"
import { API } from "../../../services/api/index"

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
const bootStore = useBootStore();


// Opens selected shoe
async function openShoe(rfid){
  // console.log("open shoe: " + rfid);

  // DB calls
  await loadShoeDetails(rfid);

    if (bootStore.bootsRfid?.length > 0) {
    // console.log("Loaded latest shoe:", bootStore.boot.ecuDeviceIdHyphenated);
    boxStore.shoeDetails = true;
  } else {
    console.warn("No data found for RFID:", rfid);
  }
}

// Load Shoe Details
async function loadShoeDetails(rfid) {
  // console.log('fetch data...');
  try {
    // Fetch from API
    const response = await API.boot.getByRfid(rfid);

    // console.log("response: ", response);

    if (!response || !Array.isArray(response) || response.length === 0) {
      console.warn('No shoe found for RFID:', rfid);
      bootStore.boot = null;
      bootStore.bootsRfid = [];
      return;
    }

    // Enrich each entry
    const enriched = response.map((boot) => ({
      ...boot,
      ecuDeviceIdHyphenated: deviceIdHyphenated(boot.ecuDeviceId),
    }));

    // Sort by newest first (descending by timeStamp)
    enriched.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));

    // Assign to store
    bootStore.bootsRfid = enriched;
    bootStore.boot = enriched[0]; // latest entry

  } catch (error) {
    console.error('API error:', error);
    toast.add({
      severity: 'error',
      summary: 'Network Error',
      detail: error.message,
      life: 4000,
    });
  }
}


// Format timestamp to something more readable
function formatTimestamp(timestamp) {
  if (!timestamp) return "-";
  const date = new Date(timestamp);
  if (isNaN(date)) return "-";

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}.${month}.${year} ${hours}:${minutes}`;
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
  // Handle null/undefined/empty
  if (!deviceId || typeof deviceId !== 'string') {
    return 'N/A';
  }

  // Must be even length and hex-only
  const cleanId = deviceId.trim();
  if (cleanId.length % 2 !== 0 || !/^[0-9a-fA-F]+$/.test(cleanId)) {
    console.warn('Invalid ECU device ID format:', deviceId);
    return deviceId; // fallback to raw value
  }

  const bytes = [];
  for (let i = 0; i < cleanId.length; i += 2) {
    const hexPair = cleanId.substring(i, i + 2);
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