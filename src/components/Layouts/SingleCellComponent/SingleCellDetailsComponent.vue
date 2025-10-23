<template>
  <div v-if="singelCellStore.singleCell">
    <!-- General Info -->
    <div class="grid grid-cols-4 mb-4">
        <div class="font-medium mb-2">Creator Id</div>
        <div>{{ singelCellStore.singleCell.userMatrikelNumber }}</div>
        <div class="font-medium">TimeStamp</div>
        <div>{{ formatTimestamp(singelCellStore.singleCell.timeStamp) }}</div>
    </div>

    <!-- Test Results -->
    <table class="mt-12 w-full">
      <thead>
        <tr>
          <th scope="col" class="text-center py-2 mb-6" colspan="8">Single Cell Measurement Results</th>
        </tr>
        <tr class="dark:bg-zinc-800 ">
          <th scope="col" class="text-left px-2 py-2 min-w-48" >Target Pressure</th>
          <th scope="col" class="text-left px-2 py-2 min-w-16" >Loadcell Max Pressure</th>
          <th scope="col" class="text-left px-2 py-2 min-w-16" >Read out Pressure (manual)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="i in 10" :key="i" class="odd:bg-zinc-700 even:bg-zinc-800">
          <td class="text-left px-2 py-2">{{ singelCellStore.singleCell.targetPressures?.[i - 1] ?? '—' }}</td>
          <td class="text-left px-2 py-2">{{ singelCellStore.singleCell.calculatedPressures?.[i - 1] ?? '—' }}</td>
           <!-- pressure color-coded by status -->
          <td
            class="px-2 py-2 font-medium text-center"
            :class="singelCellStore.singleCell.status?.[i - 1]
              ? 'bg-emerald-500 text-white'
              : 'bg-red-400 text-zinc-800'"
          >
            {{ singelCellStore.singleCell.resultPressure?.[i - 1] ?? '—'  }}
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
import {useSingleCellStore} from "../../../store/singleCellStore";


/* CODE STARTS HERE */

// init stores
const toast = useToast();
const singelCellStore = useSingleCellStore();


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