<template>
 <!-- Header: Title + BACK Button -->
 <div class="pl-12 pr-12 pb-0 pt-6 flex justify-between">
    <div class="bg-zinc-900" style="width: 100%">
      <h1 class="p-2 pl-6 font-bold bg-zinc-800 uppercase text-white text-left text-3xl">ORDER-PANEL</h1>
    </div>
    <!-- Add Button -->
    <Button raised severity="success" @click="orderForm = true">
      <i class="pi pi-plus" style="font-size: 2rem"></i>
    </Button>
    <router-link style="width: 20%" :to="{ name: 'mainScreenView' }"
      class="bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 px-4 rounded-none uppercase text-xl text-center">Back to Menu
    </router-link>
  </div>


    <!-- Table with orders -->
    <div class="pl-12 pr-12 pt-6">
      <OrderTableComponent ref="orderTableComponent"/>
    </div>

    <!-- Currently Selected Order (v-if="orderStore.orderId !== 0")-->
    <div v-if="orderStore.orderId !== 0" class="pl-12 pr-12 pt-6 pb-6 justify-end footer-bottom">
      <div class="pt-2 pb-2 pl-6 pr-6 flex justify-between bg-zinc-800 text-white text-xl">
        <div class="flex">
          <p class="">Selected Order: &nbsp;</p>
          <p class=" font-bold">{{ orderStore.kitType }}&nbsp;</p>
          <p class="">- {{ orderStore.orderId }}</p>
        </div>
        <p class="flex">Amount: {{ orderStore.doneAmount }} / {{ orderStore.totAmount }}</p>
      </div>
    </div>



  <!-- New Order Modal -->
  <template>
    <Dialog v-model:visible="orderForm" modal :style="{ width: '60%' }" class="text-base" :draggable="false">
        <template #header>
          <div class="flex items-center justify-between py-2 text-white rounded-t-md">
            <h3 class="text-lg font-semibold">New Order</h3>
          </div>
        </template>
        <OrderFormComponent ref="orderFormComponent"/>
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
import { frontEndCommand, decodeMessage } from '../services/backendMessaging/backendCommands';

// Stores & Data
import { useOrderStore } from '../store/orderStore';

// Primevue Components
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import ProgressBar from 'primevue/progressbar';
import Toast from 'primevue/toast';
import { useToast } from "primevue/usetoast";

// Custom Components
import OrderFormComponent from "../components/OrderPanelComponents/OrderFormComponent.vue";
import OrderTableComponent from "../components/OrderPanelComponents/OrderTableComponent.vue";



/* CODE STARTS HERE */

// init stores
const orderStore = useOrderStore();
const toast = useToast();


// local variables
const orderForm = ref(false);
const orderFormComponent = ref();
const orderTableComponent = ref();

  
  
onMounted(() => {
  // Send View Command
  if (connection) {
    frontEndCommand(connection, FrontEndCommand.OrdersView);
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
    // ADD ORDER
    if(commandID === FrontEndCommand.AddOrder){
      // close modal
      orderForm.value = false;
      // refresh DB call!
      orderTableComponent.value.loadData();
      // Order Added Successfully
      toast.add({ severity: 'contrast', summary: 'Added Order', detail: 'Order Added Successfully', life: 1000 });
    }
    // SELECT ORDER
    else if(commandID === FrontEndCommand.SelectOrder){
      toast.add({ severity: 'contrast', summary: 'Select Order', detail: 'Order Selected Successfully', life: 1000 });
    } 
    // DELETE ORDER
    else if(commandID === FrontEndCommand.DeleteOrder){
      // refresh DB call!
      orderTableComponent.value.loadData();
      // Order Deleted Successfully
      toast.add({ severity: 'contrast', summary: 'Deleted Order', detail: 'Order Deleted Successfully', life: 1000 });
    }
  }
  // NACK
  else if(commandType === "NACK"){
    // SELECT ORDER
    if(commandID === FrontEndCommand.SelectOrder){
      orderStore.resetStore();
      toast.add({ severity: 'danger', summary: 'Selected Order', detail: 'Selecting Order failed!', life: 3000 });
    }
  }
  // ERR
  else if(commandType === "ERR"){
    var errorMessage = decodedOscMessage.args[2].value;
    console.log(errorMessage);
    // SELECT ORDER
    if(commandID === FrontEndCommand.SelectOrder){
      toast.add({ severity: 'danger', summary: 'Selected Order', detail: errorMessage, life: 3000 });
    }
    // Add ORDER
    else if(commandID === FrontEndCommand.AddOrder){
      toast.add({ severity: 'danger', summary: 'Add Order', detail: errorMessage, life: 3000 });
    }
    // DELETE ORDER
    else if(commandID === FrontEndCommand.DeleteOrder){
      toast.add({ severity: 'danger', summary: 'Delete Order', detail: errorMessage, life: 3000 });
    }
  }
  else if(commandType === "DATA"){
    // BAR CODE RESULT
    if(commandID === FrontEndCommand.Scanner){
      barCodeScannerResult(decodedOscMessage);
    }
    // QR CODE RESULT
    else if(commandID === FrontEndCommand.ScannerQR){
      qrCodeScannerResult(decodedOscMessage);
    }
  }


}



// When  BarCodeScanner has Result => push to Order Form! (Only order number)
function barCodeScannerResult(oscMessage){
  console.log("BarCode: " + oscMessage.args[3].value);
  orderFormComponent.value.setOrderID(parseInt(oscMessage.args[3].value));
}


// When QRCodeScanner has Result => push to Order Form! (all info)
function qrCodeScannerResult(oscMessage){
  var data = oscMessage.args[3].value.split(',');
  orderFormComponent.value.setOrderFromQR(parseInt(data[0]), parseInt(data[1]), parseInt(data[2]), parseInt(data[3]));
}


</script>





<style scoped>

.footer-bottom {
  bottom: 0;
  position: fixed;
  width: 100%;
}

</style>