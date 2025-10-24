<template>
  
  <!-- Test Results -->
  <table class="w-full">
    <thead>
      <tr class="dark:bg-zinc-800 ">
        <th scope="col" class="text-left px-2 py-2 min-w-48" >Target Pressure</th>
        <th scope="col" class="text-left px-2 py-2 min-w-16" >Min Pressure</th>
        <th scope="col" class="text-left px-2 py-2 min-w-16" >Max Pressure</th>
        <th scope="col" class="text-left px-2 py-2 min-w-16" >Result Pressure</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="i in 5" :key="i" class="odd:bg-zinc-700 even:bg-zinc-800">
        <td class="text-left px-2 py-2">{{ bootStore.bootsRfid?.[currentIndex].targetPressure?.[i - 1] ?? '—' }}</td>
        <td class="text-left px-2 py-2">{{ bootStore.bootsRfid?.[currentIndex].minPressure?.[i - 1] ?? '—' }}</td>
        <td class="text-left px-2 py-2">{{ bootStore.bootsRfid?.[currentIndex].maxPressure?.[i - 1] ?? '—' }}</td>
          <!-- pressure color-coded by status -->
        <td
          class="px-2 py-2 font-medium text-center"
          :class="bootStore.boot.status?.[i - 1]
            ? 'bg-emerald-500 text-white'
            : 'bg-red-400 text-zinc-800'"
        >
          {{ bootStore.bootsRfid?.[currentIndex][`pressure${i}`] ?? '—' }}
        </td>
      </tr>
    </tbody>
  </table>


</template>




<script setup>

// VUE
import { RouterLink } from "vue-router";
import { onMounted, onUnmounted, ref, computed, defineProps, watchEffect  } from 'vue';

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


/* CODE STARTS HERE */

// init stores
const bootStore = useBootStore();
const recalStore = useRecalStore();



/* CODE STARTS HERE */
const props = defineProps({
    currentIndex:{
        type: Number, 
        default: 0
    },
});

const currentIndex = ref(props.currentIndex);


watchEffect(() => {
    currentIndex.value = props.currentIndex

});


defineExpose({
    currentIndex,
});






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
