<template>
  <div v-if="bootStore.boot">
    <!-- General Info -->
    <div class="grid grid-cols-4 mb-4">
        <div class="font-medium mb-2">Id</div>
        <div>{{ bootStore.boot.id }}</div>
        <div class="font-medium">Calibration Id</div>
        <div>{{ bootStore.boot.sensorId }}</div>
        <div class="font-medium mb-2">RFID</div>
        <div>{{ bootStore.boot.rfid }}</div>
        <div class="font-medium">Sensor Serialnumber</div>
        <div>{{ bootStore.boot.sensorSerialNumber }}</div>
        <div class="font-medium mb-2">Creator Id</div>
        <div>{{ bootStore.boot.userMatrikelNumber }}</div>
        <div class="font-medium">TimeStamp</div>
        <div>{{ formatTimestamp(bootStore.boot.timeStamp) }}</div>
        <div class="font-medium mb-2">Ecu Device Id</div>
        <div>{{ bootStore.boot.ecuDeviceIdHyphenated }}</div>
        <div class="font-medium">Mac-Address</div>
        <div class="mb-2">{{ bootStore.boot.macAddress }}</div>
        <div class="font-medium mb-2">R_Temp/Meander</div>
        <div>{{ bootStore.boot.r_Temp_Avg }}</div>
        <div class="font-medium">External Temperature</div>
        <div>{{ bootStore.boot.externalTemperatureSensorAvg }}</div>
        <div class="font-medium mb-2">Number of EndTest</div>
        <div>{{ endTestIds.length }}</div>    
        <div class="font-medium mb-2">Number of Calibration</div>
        <div>{{ recalIds.length }}</div>
    </div>

    <!-- Test Results -->
    <div class="mt-12 w-full">
      <div class="flex justify-center items-center mb-2">
        <!-- Left Arrow -->
        <button
          v-if="bootStore.bootsRfid.length > 1 && currentBootIndex > 0"
          class="px-3 py-1 text-white"
          @click="prevBoot"
          >
          <div class="flex">
            <i class="pi pi-arrow-left text-xl"></i>
          </div>
        </button>
        <button
          v-else
          class="px-3 py-1 text-zinc-500"
          >
          <div class="flex">
            <i class="pi pi-arrow-left text-xl"></i>
          </div>
        </button>

        <div class="px-4 py-1 text-2xl">
          EndTest Results ({{ currentBootIndex + 1 }}/{{ bootStore.bootsRfid.length }}): {{ currentBoot.id }}
        </div>

        <!-- Right Arrow -->
        <button
          v-if="bootStore.bootsRfid.length > 1 && currentBootIndex < bootStore.bootsRfid.length - 1"
          class="px-3 py-1 text-white "
          @click="nextBoot"
          >
          <div class="flex">
            <i class="pi pi-arrow-right text-xl"></i>
          </div>
        </button>
        <button
          v-else
          class="px-3 py-1 text-zinc-500"
          >
          <div class="flex">
            <i class="pi pi-arrow-right text-xl"></i>
          </div>
        </button>
      </div>
        <BoxBootTestResultComponent v-model:currentIndex="currentBootIndex"/>
    </div>



    <!-- Return Button -->
    <button style="width: 20%;"
      class="mt-12 text-zinc-400 hover:text-white py-2 px-4 rounded-none text-center"
      @click="returnButton()">
      <div class="flex gap-8">
        <i class="pi pi-arrow-left" style="font-size: 2rem"></i>
      </div>
    </button>

  </div>
</template>
  
<script setup>

// VUE
import { RouterLink } from "vue-router";
import { onMounted, onUnmounted, ref, computed } from 'vue';

// Messaging and Commands


// Stores & Data
import { useBootStore } from "../../../store/bootStore";
import { useBoxStore } from "../../../store/boxStore";
import { useRecalStore } from "../../../store/recalStore";
import { API } from "../../../services/api/index";

// Primevue Components
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import ProgressBar from 'primevue/progressbar';
import Toast from 'primevue/toast';
import { useToast } from "primevue/usetoast";

// Custom Components
import BoxBootTestResultComponent from "./BoxBootTestResultComponent.vue";

/* CODE STARTS HERE */

// init stores
const toast = useToast();
const bootStore = useBootStore();
const boxStore = useBoxStore();
const recalStore = useRecalStore();
const currentBootIndex = ref(0);


function returnButton(){
  boxStore.shoeDetails = false;
  bootStore.resetStore();
  recalStore.resetStore();
}


  
  
onMounted(() => {
  getRecals(bootStore.boot.rfid);
})


onUnmounted(() => {
  returnButton();
})


/*
 FUNCTIONS FOR RESULT TABLE
*/

const currentBoot = computed(() => {
  // Default to the first if out of range
  return bootStore.bootsRfid?.[currentBootIndex.value] ?? bootStore.boot;
});

function nextBoot() {
  if (currentBootIndex.value < bootStore.bootsRfid.length - 1) {
    currentBootIndex.value++;
    // bootStore.boot = bootStore.bootsRfid[currentBootIndex.value];
  }
}

function prevBoot() {
  if (currentBootIndex.value > 0) {
    currentBootIndex.value--;
    // bootStore.boot = bootStore.bootsRfid[currentBootIndex.value];
  }
}





// Opens selected shoe
async function getRecals(rfid){
  // DB calls
  await loadRecals(rfid);

}

// Load Shoe Details
async function loadRecals(rfid) {
  try {
    // Fetch from API
    const response = await API.recal.getByRfid(rfid);

    // console.log("recal response: ", response);

    if (!response || !Array.isArray(response) || response.length === 0) {
      console.warn('No shoe found for RFID:', rfid);
      recalStore.recal = null;
      recalStore.recalsRfid = [];
      return;
    }

    // Enrich each entry
    const enriched = response.map((recal) => ({
      ...recal,
      ecuDeviceIdHyphenated: deviceIdHyphenated(recal.ecuDeviceId),
    }));

    // Sort by newest first (descending by timeStamp)
    enriched.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));

    // Assign to store
    recalStore.recalsRfid = enriched;
    recalStore.recal = enriched[0]; // latest entry

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



// get all EndTest ids
const endTestIds = computed(() => {
  return bootStore.bootsRfid?.map(b => b.id) ?? [];
});


// get all EndTest ids
const recalIds = computed(() => {
  return recalStore.recalsRfid?.map(b => b.id) ?? [];
});

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

</style>