<template>
  <div v-if="bootStore.boot">
    <!-- General Info -->
    <div class="grid grid-cols-4 mb-4">
        <div class="font-medium mb-2">Id</div>
        <div>{{ bootStore.boot.id }}</div>
        <div class="font-medium">Sensor Id</div>
        <div>{{ bootStore.boot.sensorId }}</div>
        <div class="font-medium mb-2">RFID</div>
        <div>{{ bootStore.boot.rfid }}</div>
        <div class="font-medium">SensorSerialNumber</div>
        <div>{{ bootStore.boot.sensorSerialNumber }}</div>
        <div class="font-medium mb-2">Creator Id</div>
        <div>{{ bootStore.boot.userMatrikelNumber }}</div>
        <div class="font-medium">TimeStamp</div>
        <div>{{ formatTimestamp(bootStore.boot.timeStamp) }}</div>
        <div class="font-medium mb-2">EcuDeviceId</div>
        <div>{{ deviceIdHyphenated(bootStore.boot.ecuDeviceId) }}</div>
        <div class="font-medium">Mac-Address</div>
        <div class="mb-2">{{ bootStore.boot.macAddress }}</div>
        <div class="font-medium mb-2">R_Temp/Meander</div>
        <div>{{ bootStore.boot.r_Temp_Avg }}</div>
        <div class="font-medium">External Temperature</div>
        <div>{{ bootStore.boot.externalTemperatureSensorAvg }}</div>
    </div>

    <!-- Test Results -->
    <table class="mt-12 w-full">
      <thead>
        <tr>
          <th scope="col" class="text-center py-2" colspan="8">EndTest Results</th>
        </tr>
        <tr class="dark:bg-zinc-800 ">
          <th scope="col" class="text-left px-2 py-2 min-w-48" >Target Pressure</th>
          <th scope="col" class="text-left px-2 py-2 min-w-16" >Min Pressure</th>
          <th scope="col" class="text-left px-2 py-2 min-w-16" >Max Pressure</th>
          <th scope="col" class="text-left px-2 py-2 min-w-16" >Result Pressure</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="i in 5" :key="i" class="odd:bg-zinc-700 even:bg-zinc-800">
          <td class="text-left px-2 py-2">{{ bootStore.boot.targetPressure?.[i - 1] ?? '—' }}</td>
          <td class="text-left px-2 py-2">{{ bootStore.boot.minPressure?.[i - 1] ?? '—' }}</td>
          <td class="text-left px-2 py-2">{{ bootStore.boot.maxPressure?.[i - 1] ?? '—' }}</td>
           <!-- pressure color-coded by status -->
          <td
            class="px-2 py-2 font-medium text-center"
            :class="bootStore.boot.status?.[i - 1]
              ? 'bg-emerald-500 text-white'
              : 'bg-red-400 text-zinc-800'"
          >
            {{ bootStore.boot[`pressure${i}`] ?? '—' }}
          </td>
        </tr>
      </tbody>
    </table>

  </div>
</template>
  
<script setup>

// VUE
import { RouterLink } from "vue-router";
import { onMounted, onUnmounted, ref } from 'vue';

// Messaging and Commands


// Stores & Data


// Primevue Components
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import ProgressBar from 'primevue/progressbar';
import Toast from 'primevue/toast';
import { useToast } from "primevue/usetoast";

// Custom Components
import { useBootStore } from "../../../store/bootStore";


/* CODE STARTS HERE */

// init stores
const toast = useToast();
const bootStore = useBootStore();




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

</style>