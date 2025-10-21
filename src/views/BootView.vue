<template>
 <!-- Header: Title + BACK Button -->
 <div class="pl-12 pr-12 pb-0 pt-6 flex justify-between">
    <div class="bg-zinc-900" style="width: 100%">
      <h1 class="p-2 pl-6 font-bold bg-zinc-800 uppercase text-white text-left text-3xl">Shoe-PANEL</h1>
    </div>
    <router-link style="width: 20%" :to="{ name: 'mainScreenView' }"
      class="bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 px-4 rounded-none uppercase text-xl text-center">Back to Menu
    </router-link>
  </div>


    <!-- Table with packages -->
    <div class="pl-12 pr-12 pt-6">
      <BootTableComponent/>
    </div>

    <!-- Currently Selected Package FOOTER (v-if="")-->
    <div v-if="true" class="pl-12 pr-12 pt-6 pb-6 justify-end footer-bottom">
      <div class="pt-2 pb-2 pl-6 pr-6 flex justify-between bg-zinc-800 text-white text-xl">

      </div>
    </div>



  

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
import { frontEndCommand, decodeMessage } from '../services/backendMessaging/backendCommands';

// Stores & Data


// Primevue Components
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import ProgressBar from 'primevue/progressbar';
import Toast from 'primevue/toast';
import { useToast } from "primevue/usetoast";

// Custom Components
import BootTableComponent from "../components/Layouts/BootComponents/BootTableComponent.vue";



/* CODE STARTS HERE */

// init stores
const toast = useToast();




  
  
onMounted(() => {
  // Send View Command
  if (connection) {
    frontEndCommand(connection, FrontEndCommand.BootView);
    listenToWebsocket();
  }
})



onUnmounted(() => {
  // Send View Command
  if (connection) {
    frontEndCommand(connection, FrontEndCommand.MainScreenView);
  }
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





</script>





<style scoped>

.footer-bottom {
  bottom: 0;
  position: fixed;
  width: 100%;
}

</style>