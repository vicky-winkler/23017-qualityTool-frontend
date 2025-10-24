<template>
  <div v-if="conditionedSensorStore.conditionedSensor">
    <!-- General Info -->
    <div class="grid grid-cols-4 mb-12">
        <div class="font-medium mb-2">Id</div>
        <div>{{ conditionedSensorStore.conditionedSensor.id }}</div>
        <div class="font-medium">Size</div>
        <div>{{ conditionedSensorStore.conditionedSensor.size }}</div>
        <div class="font-medium mb-2">RFID</div>
        <div>{{ conditionedSensorStore.conditionedSensor.rfid }}</div>
        <div class="font-medium">Sensor Serialnumber</div>
        <div>{{ conditionedSensorStore.conditionedSensor.sensorSerialNumber }}</div>
        <div class="font-medium mb-2">IEE Id</div>
        <div>{{ conditionedSensorStore.conditionedSensor.ieeSensorSerialNumber }}</div>
        <div class="font-medium">TimeStamp</div>
        <div>{{ formatTimestamp(conditionedSensorStore.conditionedSensor.timeStamp) }}</div>
    </div>

    <!-- Replace Component -->
    <div class="flex gap-8">
      <!-- Replace Input Field -->
      <InputText v-model="replaceRfid" placeholder="Replace RFID e.g. 04299E2A2F1590" style="width: 50%;"/>
      <!-- Replace Button -->
      <button
        @click="submitReplace"
        :disabled="replaceRfid.length !== 14"
        class="rounded px-4 py-3 text-black"
        :class="{
          'bg-emerald-400 hover:bg-emerald-600': replaceRfid.length === 14,
          'bg-emerald-600 opacity-50 cursor-not-allowed': replaceRfid.length !== 14
        }"
      >
        Replace RFID
      </button>
    </div>
    <!-- Error Input -->
    <div v-if="errorInput != ''" class="mt-2">
      <p class="text-red-800 text-lg ">{{ errorInput }}</p>
    </div>

    <!-- Replaced Message -->
    <div v-if="messageReplaced != ''" class="mt-4">
      <p class="text-red-800 text-2xl ">{{ messageReplaced }}</p>
    </div>

  </div>
</template>
  
<script setup>

// VUE
import { RouterLink } from "vue-router";
import { onMounted, onUnmounted, ref, watchEffect, defineProps, defineEmits } from 'vue';

// Messaging and Commands


// Stores & Data
import { useConditionedSensorStore } from "../../../store/conditionedSensorStore";

// Primevue Components
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import ProgressBar from 'primevue/progressbar';
import Toast from 'primevue/toast';
import { useToast } from "primevue/usetoast";
import InputText from 'primevue/inputtext';

// Custom Components



/* CODE STARTS HERE */

// init stores
const toast = useToast();
const conditionedSensorStore = useConditionedSensorStore();
const replaceRfid = ref("");
const errorInput = ref('');
const emit = defineEmits(["submit-replace-rfid"]);

// define props
const props = defineProps({
  messageReplaced:{
    type: String,
    default: ''
  }
});

const messageReplaced = ref(props.messageReplaced);

watchEffect(() => {
  messageReplaced.value = props.messageReplaced;
});

// display message on successful replacement
function addMessageReplaced(message){
  messageReplaced.value = "Current RFID (" + conditionedSensorStore.conditionedSensor.rfid + ") has been replaced with" + message + ".\n Please reload Table.";
}

defineExpose({
  addMessageReplaced,
});




onUnmounted(() => {
  // reset vars
  conditionedSensorStore.resetStore();
  replaceRfid.value = '';
  errorInput.value = ''
})





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



function submitReplace(){

  if(replaceRfid.value.length != 14 ){
    errorInput.value = "The RFID must be 14 characters long!";
  }
  else{
   console.log("submit replace");
   emit("submit-replace-rfid", replaceRfid.value);
  }
  

}


</script>


<style scoped>

.footer-bottom {
  bottom: 0;
  position: fixed;
  width: 100%;
}

</style>