<template>
  <!-- Header: Title + BACK Button -->
  <div class="pl-12 pr-12 pb-0 pt-6 flex justify-between">
    <div class="bg-zinc-900" style="width: 100%">
      <h1 class="p-2 pl-6 font-bold bg-zinc-800 uppercase text-white text-left text-3xl">PACKAGING-PANEL</h1>
    </div>
    <button v-if="packagingRunning" style="width: 20%;"
      class=" bg-orange-400 hover:bg-red-400 text-white font-semibold py-2 px-4 rounded-none text-center"
      @click="abortPackaging">Abort
    </button>
    <router-link style="width: 20%" :to="disabledBackToMenu ? '' : { name: 'mainScreenView' }" 
      :class="[
      'bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 px-4 rounded-none uppercase text-xl text-center',
      { 'pointer-events-none opacity-50': disabledBackToMenu }]">Back to Menu
    </router-link>
  </div>

  <!-- Below Title Header -->
  <div class="pl-12 pr-12">
    <ConfirmDialog></ConfirmDialog>
    <ProgressBar v-if="packagingRunning" mode="indeterminate" class="rounded-none" style="border-radius: 0px; height: 6px;"></ProgressBar>
    <ProgressBar v-else :value="0" class="rounded-none" style="border-radius: 0px; height: 6px;"></ProgressBar>
  </div>


  <!-- Currently Selected Order -->
  <div v-if="orderStore.orderId !== 0" class="pl-12 pr-12 pt-6">
      <div class="pt-2 pb-2 pl-6 pr-6 flex justify-between bg-zinc-800 text-white text-xl">
        <div class="flex">
          <p class="">Selected Order: &nbsp;</p>
          <p class=" font-bold">{{ orderStore.kitType }}&nbsp;</p>
          <p class="">- {{ orderStore.orderId }}</p>
        </div>
        <p class="flex">Amount: {{ orderStore.doneAmount }} / {{ orderStore.totAmount }}</p>
      </div>
  </div>


  <!-- Body with Grid -->
   <div class="grid grid-cols-5 gap-6 pl-12 pr-12 pt-6">
      <PackagingCardComponent :imageFileName="'Box.jpg'" :imageInfo="'SoftCase'" :numberNeeded="1" ref="softCaseComponent" />
      <!-- <PackagingCardComponent :imageFileName="'Sticker.jpg'" :imageInfo="'Stickers'"  :numberNeeded="1" ref="stickersComponent"/> -->
      <PackagingCardComponent :imageFileName="'Cable.jpg'" :imageInfo="'Y-Charger'"  :numberNeeded="orderStore.numberYCharger" ref="yChargerComponent"/>
      <PackagingCardComponent :imageFileName="'Charger.jpg'" :imageInfo="'USB-Charger'"  :numberNeeded="1" ref="usbChargerComponent"/>
      <PackagingCardComponent :imageFileName="'Brush.jpg'" :imageInfo="'Hoofpick'"  :numberNeeded="1" ref="hoofpickComponent"/>

      <button @click="openBootModal()">
        <PackagingCardComponent :imageFileName="'Shoe.jpg'" :imageInfo="'Boots'"  :numberNeeded="orderStore.numberBoots" ref="bootsComponent" :toggleHover="enableBootModal"/>
      </button>

      <button @click="openPasternWrapModal()">
        <PackagingCardComponent :imageFileName="'Socks.jpg'" :imageInfo="'Pastern Wrap'"  :numberNeeded="orderStore.numberPasternWraps" ref="pasternWrapComponent" :toggleHover="enablePasternWrapModal"/>
      </button>
      
      <PackagingCardComponent :imageFileName="'QuickStartGuide.jpg'" :imageInfo="'Quick Start'"  :numberNeeded="1" ref="manualComponent"/>
      <PackagingCardComponent :imageFileName="'SafetyRegulation.jpg'" :imageInfo="'Booklet'"  :numberNeeded="1" ref="safetyRegulationComponent"/>
      
      <button @click="openBanderoleStickersModal()">
        <PackagingCardComponent :imageFileName="'Cover.jpg'" :imageInfo="'Banderole'"  :numberNeeded="1" ref="banderoleComponent"/>
      </button>
      
      <PackagingCardComponent :imageFileName="'Label.jpg'" :imageInfo="'Final-Label'" :numberNeeded="1" ref="labelComponent"/>
   </div>

  <!-- Select Version -->
  <div v-if="enableSelectVersion" class="pl-12 pr-12 pt-6 flex gap-2">
    <h1 class="p-2 bg-zinc-800 uppercase text-white text-center text-lg w-64">Select Version: </h1>
    <Dropdown v-model="selectedVersion" 
      :options="versions" 
      optionLabel="name"
      :disabled="disableVersion"
      placeholder="Select Version"
      scrollHeight="100px"
      checkmark :highlightOnSelect="false"  
      class="w-full md:w-14rem !rounded-none" />
  </div>

  <!-- Instructions -->
  <div v-if="instruction !== '' " class="pl-12 pr-12 pt-6 pb-6" >
    <h1 v-if="redInstruction" class="p-2 bg-zinc-800 uppercase text-red-500 text-center text-lg border-4 border-red-500">{{ instruction }}</h1>
    <h1 v-else class="p-2 bg-zinc-800 uppercase text-white text-center text-lg border-4 border-white">{{ instruction }}</h1>
  </div>


  
  <!-- ERROR -->
  <template>
      <Dialog class="flex flex-col justify-left" v-model:visible="errorState" modal header="Error" :style="{ width: '35%' }">
        <span class="text-surface-500 dark:text-surface-400  mb-8">{{ error }}</span>
        <div class="flex justify-end gap-2">
          <Button severity="danger" type="button" label="OK" @click="errorState = false"></Button>
        </div>
      </Dialog>
  </template>


  <!-- Boot Modal -->
  <template>
    <Dialog v-model:visible="bootModal" modal header="Boots" :style="{ width: '43%' }">
        <BootsPackagingComponent ref="bootPackagingModal" />
    </Dialog>
  </template>

  <!-- Pastern Wrap Modal -->
  <template>
    <Dialog v-model:visible="pasternWrapModal" modal header="Pastern Wraps" :style="{ width: '35%' }">
        <PasternWrapComponent ref="pasternWrapPackagingModal"/>
    </Dialog>
  </template>

    <!-- Banderole Stickers Modal -->
    <template>
    <Dialog v-model:visible="banderoleStickersModal" modal header="Banderole Stickers" :style="{ width: '35%' }">
        <BanderoleStickersComponent />
    </Dialog>
  </template>



</template>
  
<script setup>
// VUE
import { RouterLink } from "vue-router";
import router from "../router";
import { onMounted, onUnmounted, ref, onBeforeMount, watch, nextTick } from 'vue';

// Messaging and Commands
import slip from 'slip';
import { connection } from '../services/websocket/mainWebSocket';
import { BackEndCommand, FrontEndCommand, OscDataType } from '../services/backendMessaging/commandEnums';
import { frontEndCommand, decodeMessage, backEndSettingsData, backEndCommand } from '../services/backendMessaging/backendCommands';

// Stores & Data
import { useOrderStore } from '../store/orderStore';


// Primevue Components
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import Dialog from 'primevue/dialog';
import ProgressBar from 'primevue/progressbar';
import ConfirmDialog from 'primevue/confirmdialog';
import Dropdown from 'primevue/dropdown';



// Custom Components
import PackagingCardComponent from "../components/PackagingPanelComponents/PackagingCardComponent.vue";
import BootsPackagingComponent from "../components/PackagingPanelComponents/BootsPackagingComponent.vue";
import PasternWrapComponent from "../components/PackagingPanelComponents/PasternWrapComponent.vue";
import BanderoleStickersComponent from "../components/PackagingPanelComponents/BanderoleStickersComponent.vue";



/* CODE STARTS HERE */

// init stores
const orderStore = useOrderStore();

// Initialize Components
const softCaseComponent = ref();
const bootsComponent = ref();
const usbChargerComponent = ref();
const yChargerComponent = ref();
const hoofpickComponent = ref();
const pasternWrapComponent = ref();
const manualComponent = ref();
const stickersComponent = ref();
const banderoleComponent = ref();
const labelComponent = ref();
const bootPackagingModal = ref();
const pasternWrapPackagingModal = ref();
const safetyRegulationComponent = ref();



// local variables
const packagingRunning = ref(false);
const instruction = ref('');
const redInstruction = ref(false);
const error = ref('');
const errorState = ref(false);
const bootModal = ref(false);
const enableBootModal = ref(false);
const pasternWrapModal = ref(false);
const enablePasternWrapModal = ref(false);
const banderoleStickersModal = ref(false);
const enableBanderoleStickersModal = ref(false);
const enableSelectVersion = ref(false);
const selectedVersion = ref();
const disableVersion = ref(false);

const versions = ref([
  //{ name: 'v1 - Standard', code: 'v1'},
  //{ name: 'v2 - New Shoe', code: 'v2'},
  // { name: 'v3 - New Rivet - Old Shoe', code: 'v3'},
  // { name: 'v4 - New Rivet - New Shoe', code: 'v4'},
  { name: 'v5 - New Sensor - New Ecu Enclosure', code: 'v5'},
  { name: 'v6 - New Rivet', code: 'v6'},
])

const disabledBackToMenu = ref(false);


onBeforeMount(() => {
 
})


onMounted(() => {
  // Send View Command
  if (connection) {
    frontEndCommand(connection, FrontEndCommand.PackagingView);
    listenToWebsocket();
  }

  reset();

  // TODO FAKE DATA

  /*
  enableBootModal.value = true;
  enablePasternWrapModal.value = true;
  softCaseComponent.value.increaseNumberAdded();
  bootsComponent.value.increaseNumberAdded();
  banderoleComponent.value.increaseNumberAdded();
  hoofpickComponent.value.increaseNumberAdded();
  manualComponent.value.increaseNumberAdded();
  pasternWrapComponent.value.increaseNumberAdded();
  pasternWrapComponent.value.increaseNumberAdded();
  labelComponent.value.increaseNumberAdded();
  stickersComponent.value.increaseNumberAdded();
  enableSelectVersion.value = true;
  
  */
  
  
})


onUnmounted(() => {
  // Send View Command
  if (connection) {
    frontEndCommand(connection, FrontEndCommand.MainScreenView);
  }

  reset();
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

  // ACKs
  if(commandType === "ACK"){
    // Softcase
    if(commandID === BackEndCommand.Softcase){
      // reset from previous test!
      reset();

      // start new test
      softCaseComponent.value.increaseNumberAdded();
      packagingRunning.value = true;
    }
    // Stickers
    else if(commandID === BackEndCommand.Stickers){
      stickersComponent.value.increaseNumberAdded();
    }
    // Y-Charger (usually 2x)
    else if(commandID === BackEndCommand.YCharger){
      yChargerComponent.value.increaseNumberAdded();
    }
    // Usb-A-Charger
    else if(commandID === BackEndCommand.UsbACharger){
      usbChargerComponent.value.increaseNumberAdded();
    }
    // Hoofpick
    else if(commandID === BackEndCommand.Hoofpick){
      hoofpickComponent.value.increaseNumberAdded();
      
      setTimeout(() => {
        // open BootsPackagingComponent after 5s
        openBootModal();
      }, 5000)
      

    }
    // Boots - completed
    else if(commandID === BackEndCommand.Boots){
      setTimeout(() => {
        // close boot modal after 3s
        bootModal.value = false;
      }, 3000)

      enableSelectVersion.value = true;
      
      /*
      setTimeout(() => {
      // open PasternWrapComponent after 5s
      openPasternWrapModal();
      }, 5000)
      */
    }
    // PasternWrap (usually 2x)
    else if(commandID === BackEndCommand.PasternWrap){
      insertPasternWraps();
    }
    // Manual
    else if(commandID === BackEndCommand.Manual){
      disableVersion.value = true;
      manualComponent.value.increaseNumberAdded();
    }
    // Safety Regulation
    else if(commandID === BackEndCommand.SafetyRegulationBooklet){
      safetyRegulationComponent.value.increaseNumberAdded();
    }
    // Banderole
    else if(commandID === BackEndCommand.Banderole){
      banderoleComponent.value.increaseNumberAdded();

      setTimeout(() => {
      // open BanderoleStickersModal after 5s
      openBanderoleStickersModal();
      }, 5000)

    }
    // Label has Serial Number
    else if(commandID === BackEndCommand.ScanLabel){
      labelComponent.value.increaseNumberAdded();
      packagingRunning.value = false;

      // close banderoleStickersModal
      banderoleStickersModal.value = false;

      // as box is completed => evaluates what happens next
      boxCompleted();
    }
  }
  // NACKs
  else if(commandType === "NACK"){
    error.value = 'Invalid Item - Try Again';
    errorState.value = true;
    packagingRunning.value = false;
  }
  // DATA
  else if(commandType === "DATA"){
    // Instruction
    if(commandID === FrontEndCommand.Instructions){
      setInstruction(decodedOscMessage);
    }
    // BOOT RFID RESULT
    else if(commandID === BackEndCommand.RfidResult){
      bootsComponent.value.increaseNumberAdded();
      insertBoot(decodedOscMessage);
    }
    // Label Serial Number
    else if(commandID === BackEndCommand.Label){
      console.log("SerialNumber: " + decodedOscMessage.args[3].value);
      labelComponent.value.addImageInfo(decodedOscMessage.args[3].value);
    }
  }
  // CMD
  else if (commandType === "CMD"){
    // Init Packaging => Reset();
    if(commandID === BackEndCommand.InitPackaging){
      // reset();
      disabledBackToMenu.value = false;
    }
  }
  // ERR
  else if(commandType === "ERR"){
    // Order Selected is Full => should never be executed!
    if(commandID === BackEndCommand.OrderSelected){
      // leave Packaging view!
      router.push('mainScreenView');
    }
    
    error.value = 'Invalid Operation: ' + decodedOscMessage.args[2].value;
    instruction.value = decodedOscMessage.args[2].value;
    errorState.value = true;
    packagingRunning.value = false;
  }


}



// executed after Label is scanned!
// when Box Completed => adjusts amountDone and evaluates if amountDone === totalAmount
function boxCompleted(){
  // increase done amount
  orderStore.doneAmount++;

  // if amountDone === totalAmount => move to MainScreenView
  if(orderStore.doneAmount === orderStore.totalAmount){
    router.push('mainScreenView');
  }

}


// Set Instructions
function setInstruction(decodedOscMessage){
  if (decodedOscMessage.args[2].value === OscDataType.String) { 

    instruction.value = decodedOscMessage.args[3].value;

      if(instruction.value === 'Wait... Box is being stored!'){
        redInstruction.value = true;
        disabledBackToMenu.value = true;
      }
      else {
        redInstruction.value = false;
      }

  }


}



// reset all Variables
function reset(){

  packagingRunning.value = false;
  errorState.value = false;
  error.value = '';
  instruction.value = "Start Packaging by Scanning Softcase!";
  bootModal.value = false;
  enableBootModal.value = false;
  pasternWrapModal.value = false;
  enablePasternWrapModal.value = false;
  enableSelectVersion.value = false;
  selectedVersion.value = null;
  disableVersion.value = false;

  

  // reset Components
  if(softCaseComponent.value?.numberAdded > 0){
    console.log("Reset components!!!");

    softCaseComponent.value.resetComponent();
    bootsComponent.value.resetComponent();
    banderoleComponent.value.resetComponent();
    hoofpickComponent.value.resetComponent();
    manualComponent.value.resetComponent();
    pasternWrapComponent.value.resetComponent();
    // stickersComponent.value.resetComponent();
    yChargerComponent.value.resetComponent();
    usbChargerComponent.value.resetComponent();
    labelComponent.value.resetComponent();
    safetyRegulationComponent.value.resetComponent();

    labelComponent.value.addItemName('');


    // try re-initializing
    //labelComponent = ref();
    //hoofpickComponent = ref();
  }

 
}



// insert Boot -> gets Data from Backend and inserts it
// Message: /FRONT/DATA/ 0 261 0 040F952A2F1591, 4, 0 
function insertBoot(decodedOscMessage){

  var rfid = "";
  var size = "";
  var posArray = "";


  if (decodedOscMessage.args[2].value === OscDataType.String) { 
    const splitArray = decodedOscMessage.args[3].value.split(",");
    rfid = splitArray[0];
    size = parseInt(splitArray[1]);
    posArray = parseInt(splitArray[2]);
  }

  
  bootPackagingModal.value.determineBoot(rfid, size, posArray);

}


// insert PasternWraps -> gets Data from Backend and inserts it
function insertPasternWraps(){
  // SINGLE PASTERN WRAP
  if(orderStore.numberPasternWraps === 1){
    // increases number added FRONT
    pasternWrapPackagingModal.value.determinePasternWrap("front");

    setTimeout(() => {
        // close pasternWrap modal after 3s
        pasternWrapModal.value = false;
      }, 3000)
    
  }

  // TWO PASTERN WRAPs
  else if(orderStore.numberPasternWraps === 2 && pasternWrapComponent.value.numberAdded === 0){
    pasternWrapPackagingModal.value.determinePasternWrap("front");
  }
  else if(orderStore.numberPasternWraps === 2 && pasternWrapComponent.value.numberAdded === 1){
    pasternWrapPackagingModal.value.determinePasternWrap("back");

    setTimeout(() => {
        // close pasternWrap modal after 3s
        pasternWrapModal.value = false;
      }, 3000)
  }

  // increase background!
  pasternWrapComponent.value.increaseNumberAdded();
}



// open bootModal
function openBootModal(){

  enableBootModal.value = true;
  if(enableBootModal.value) { bootModal.value = true; }

  
  // TEST ONLY
  // nextTick(() => {
  //   bootPackagingModal.value.determineBoot("rfid", 3, 0);
  // });

 
}


// open pasternWrapModal
function openPasternWrapModal(){
  enablePasternWrapModal.value = true;
  if(enablePasternWrapModal.value) { pasternWrapModal.value = true; }
}

// open BanderoleStickersModal
function openBanderoleStickersModal(){
  enableBanderoleStickersModal.value = true;
  if(enableBanderoleStickersModal.value) { banderoleStickersModal.value = true; }
}


// watch selectedVersion
watch(selectedVersion, (newVal, oldVal) => {
  console.log('Selected version changed:', newVal)
  if (newVal) {
    sendVersionToBackend();
  }
})



// send Version to Backend
function sendVersionToBackend(){
  console.log(selectedVersion.value.code);
  
  //CMD to move to "Version"
  backEndCommand(connection, BackEndCommand.Version);

  // actual version Data to backend
  backEndSettingsData(connection, BackEndCommand.Version, selectedVersion.value.code);
  openPasternWrapModal();
  
  /*
  // PASTERN WRAP MODAL
  setTimeout(() => {
  // open PasternWrapComponent after 5s
  openPasternWrapModal();
  }, 5000)

  */
}



// Stop packaging 
function abortPackaging(){
  frontEndCommand(connection, FrontEndCommand.Stop);
  console.log("abort packaging");
}




</script>