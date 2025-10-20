<template>
    <!-- Header: Title + BACK Button -->
 <div class="pl-12 pr-12 pb-0 pt-6 flex justify-between">
    <div class="bg-zinc-900" style="width: 100%">
      <h1 class="p-2 pl-6 font-bold bg-zinc-800 uppercase text-white text-left text-3xl">BOXED-PANEL</h1>
    </div>
    <router-link style="width: 20%" :to="{ name: 'mainScreenView' }"
      class="bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 px-4 rounded-none uppercase text-xl text-center">Back to Menu
    </router-link>
  </div>

    <!-- Table with Boxes -->
  <div class="pl-12 pr-12 pt-6">
    <BoxedTableComponent ref="boxTableComponent"/>
  </div>

  <Toast position="bottom-center" />
</template>

<script setup>
// VUE
import { RouterLink } from "vue-router";
import { ref, onMounted, onUnmounted } from 'vue';

// Messaging and Commands
import slip from 'slip';
import { connection } from '../services/websocket/mainWebSocket';
import { FrontEndCommand } from '../services/backendMessaging/commandEnums';
import { frontEndCommand, decodeMessage } from '../services/backendMessaging/backendCommands';

// Primevue Components
import Toast from 'primevue/toast';
import { useToast } from "primevue/usetoast";
  
// Custom Components
import BoxedTableComponent from "../components/BoxedPanelComponents/BoxedTableComponent.vue"



/* CODE STARTS HERE */
const boxTableComponent = ref();
const toast = useToast();


onMounted(() => {
  // Send View Command
  if (connection) {
    frontEndCommand(connection, FrontEndCommand.BoxedView);
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
    // DELETE BOX
    if(commandID === FrontEndCommand.DeleteBox) {
      // refresh DB call!
      boxTableComponent.value.loadData();
      // Box Deleted Successfully
      toast.add({ severity: 'contrast', summary: 'Deleted Box', detail: 'Box Deleted Successfully', life: 1000 });
    }
  }
  // NACK
  else if(commandType === "NACK"){
  
  }
  // ERR
  else if(commandType === "ERR"){
    var errorMessage = decodedOscMessage.args[2].value;
    console.log(errorMessage);
    // DELETE ORDER
    if(commandID === FrontEndCommand.DeleteBox){
      toast.add({ severity: 'danger', summary: 'Delete Box', detail: errorMessage, life: 3000 });
    }
  }
  else if(commandType === "DATA"){
    
  }

}



</script>