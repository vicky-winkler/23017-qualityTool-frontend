<template>
 <!-- Header: Title + BACK Button -->
 <div class="pl-12 pr-12 pb-0 pt-6 flex justify-between">
    <div class="bg-zinc-900" style="width: 100%">
      <h1 class="p-2 pl-6 font-bold bg-zinc-800 uppercase text-white text-left text-3xl">RFID-PANEL</h1>
    </div>
        <!-- Export Button -->
    <button style="width: 5%;"
      class=" bg-emerald-400 hover:bg-emerald-500 text-white py-2 px-4 rounded-none text-center"
      @click="reload">
      <div class="flex gap-8">
            <i class="pi pi-refresh" style="font-size: 2rem"></i>
          </div>
    </button>
    <router-link style="width: 20%" :to="{ name: 'mainScreenView' }"
      class="bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 px-4 rounded-none uppercase text-xl text-center">Back to Menu
    </router-link>
  </div>


  <!-- Table with packages -->
  <div class="pl-12 pr-12 pt-6">
    <RfidTableComponent ref="rfidTableComponentRef"/>
  </div>


  <!-- Details Modal -->
  <template>
    <Dialog v-model:visible="conditionedSensorStore.replaceRfidModal" modal :style="{ width: '80%' }" class="text-base" :draggable="false">
        <template #header>
          <div class="flex items-center justify-between py-2 text-white rounded-t-md">
            <h3 class="text-3xl">Replace RFID with new RFID</h3>
          </div>
        </template>
        <!-- Details Modal Component -->
        <ReplaceRfidComponent ref="replaceRfidComponentRef" @submit-replace-rfid="(...args) => onReplaceSubmit(...args)"/>
    </Dialog>
  </template>

  <Toast position="bottom-center" />
</template>
  
<script setup>

// VUE
import { RouterLink } from "vue-router";
import { onMounted, onUnmounted, ref } from 'vue';

// Messaging and Commands
import slip from 'slip';
import { connection } from '../services/websocket/mainWebSocket';
import { FrontEndCommand } from '../services/backendMessaging/commandEnums';
import { frontEndCommand, decodeMessage, frontEndSettingsData } from '../services/backendMessaging/backendCommands';

// Stores & Data
import { useConditionedSensorStore } from "../store/conditionedSensorStore";

// Primevue Components
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import ProgressBar from 'primevue/progressbar';
import Toast from 'primevue/toast';
import { useToast } from "primevue/usetoast";

// Custom Components
import RfidTableComponent from "../components/Layouts/RFIDComponent/RfidTableComponent.vue"
import ReplaceRfidComponent from "../components/Layouts/RFIDComponent/ReplaceRfidComponent.vue";



/* CODE STARTS HERE */

// init stores
const toast = useToast();
const conditionedSensorStore = useConditionedSensorStore();
const rfidTableComponentRef = ref();
const replaceRfidComponentRef = ref();

  
  
onMounted(() => {
  // Send View Command
  if (connection) {
    frontEndCommand(connection, FrontEndCommand.RFID);
    listenToWebsocket();
  }
})



onUnmounted(() => {
  // Send View Command
  if (connection) {
    frontEndCommand(connection, FrontEndCommand.MainScreenView);
  }
  conditionedSensorStore.resetStore();
})


// listen to websocket 8585
function listenToWebsocket(){
   connection.onmessage = (event) => {
    const dataBuffer = Buffer.from(event.data);
    decoder.decode(dataBuffer);
  };
}

// decode message
const decoder = new slip.Decoder({
    onMessage: (msg) => processMessage(decodeMessage(msg)),
    maxMessageSize: 209715200,
    bufferSize: 2048,
});



// process received message
function processMessage(decodedOscMessage) {

  // Extract CommandType from Address
  const commandType = decodedOscMessage.address.split('/')[2]

  // CommandID
  const commandID = decodedOscMessage.args[1].value;

  // ACK
  if(commandType === "ACK"){
    
  }
  // NACK
  else if(commandType === "NACK"){
    
  }
  // ERR
  else if(commandType === "ERR"){
    
  }
  else if(commandType === "DATA"){
    
  }


}


// reloads entire table
function reload(){
  console.log('reload data');
  rfidTableComponentRef.value.loadData();
}

// sends message to backend when replace rfid is submitted from modal
function onReplaceSubmit(rfid){
  console.log("onReplaceSubmit: " + rfid);

  if (connection) {
    frontEndSettingsData(connection, FrontEndCommand.ReplaceRfid, rfid);
  }
}

// backend => modal when rfid replaced
function rfidReplaced(rfid){

  replaceRfidComponentRef.value.addMessageReplaced(rfid);
}


</script>





<style scoped>

.footer-bottom {
  bottom: 0;
  position: fixed;
  width: 100%;
}

</style>