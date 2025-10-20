<template>
  <Toast position="bottom-center" />

  <!-- Header -->
  <div class="pl-12 pr-12 pt-6 flex justify-between">

    <div class="bg-zinc-900" style="width: 50%">
      <h1 class="p-2 pl-6 font-bold bg-zinc-800 uppercase text-white text-left text-3xl">MENU</h1>
    </div>
    <!-- User Logged In -->
        <div class="bg-zinc-900" style="width: 30%">
      <h1 class="p-2 pl-6 font-bold bg-zinc-800 text-white text-left text-3xl">{{overallStore.username}}</h1>
    </div>
    <!-- Logout Button -->
    <Button class="bg-orange-500 hover:bg-red-700 text-white font-semibold text-center text-xl uppercase"
      @click="logout()" severity="contrast" label="Logout"
      style="width: 20%; font-size: x-large; border-radius: 0px;">Logout
    </Button>
  </div>

  <!-- MAIN -->
  <div class="pl-12 pr-12 pt-6 card ">
    <div class="flex justify-center gap-6">
    
      <!-- Button Packaging -->
      <router-link v-if="orderStore.orderId !== 0 && orderStore.totAmount != orderStore.doneAmount" style="width: 33%;" :to="{ name: 'packagingView' }">
        <Button 
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold  rounded-none text-center"
          style="border-radius: 0px; height: 70vh;  width: 100%;" label="Delete" severity="info">
          <div class="flex-col">
            <i class="pi pi-box" style="font-size: 4rem"></i>
            <p class="text-3xl uppercase">Packaging</p>
          </div>
        </Button>
      </router-link>

      <!-- Button Order -->
      <router-link style="width: 33%;" :to="{ name: 'orderView' }">
        <Button 
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-none text-center"
          style="border-radius: 0px; height: 70vh; width: 100%;" label="Delete" severity="info">

          <div class="flex-col">
            <i class="pi pi-shopping-cart" style="font-size: 4rem"></i>
            <p class="text-3xl uppercase">Order</p>
          </div>
        </Button>
      </router-link>

      <!-- Button Boxed -->
      <router-link style="width: 33%;" :to="{ name: 'boxedView' }">
        <Button 
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold  rounded-none text-center"
          style="border-radius: 0px; height: 70vh;  width: 100%;" label="Delete" severity="info">
          <div class="flex-col">
            <i class="pi pi-warehouse" style="font-size: 4rem"></i>
            <p class="text-3xl uppercase">Boxed</p>
          </div>
        </Button>
      </router-link>

      <!-- Button Stock -->
      <router-link v-if="isAdmin === 'true'" style="width: 33%;" :to="{ name: 'stockView' }">
        <Button 
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold  rounded-none text-center"
          style="border-radius: 0px; height: 70vh;  width: 100%;" label="Delete" severity="info">
          <div class="flex-col">
            <i class="pi pi-inbox" style="font-size: 4rem"></i>
            <p class="text-3xl uppercase">Stock</p>
          </div>
        </Button>
      </router-link>

      <!-- Button Shutdown -->
      <Button class="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-none text-center"
        @click="confirmShutdown()" style="border-radius: 0px; min-width: 20%; width: 33%;" label="Delete"
        severity="danger">
        <div class="flex-col">
          <i class="pi pi-power-off" style="font-size: 4rem"></i>
          <p class="text-3xl uppercase">Shut down</p>
        </div>
      </Button>

    </div>
  </div>

    <!-- LOGOS -->
  <div class="pl-12 pr-12 pt-6 pb-6 card flex justify-between footer-bottom">
    <img src="../assets/imgs/logos/consteed_wide_yellow.png" alt="Image Consteed" width="340"/>
    <img src="../assets/imgs/logos/tratter.png" alt="Image Tratter" width="340"/>
  </div>

  <!-- FOOTER - INFO on Order -->
  <!-- Currently Selected Order -->
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

  <ConfirmDialog></ConfirmDialog>

</template>

<script setup>
//VUEW
import { ref, onBeforeMount, onMounted } from 'vue';
import { RouterLink } from "vue-router";
import router from '../router';
import { Buffer } from 'buffer';

// Graphic Components
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";
import Button from "primevue/button";

// Messaging & Commands
import { FrontEndCommand } from '../services/backendMessaging/commandEnums';
import { connection, establishConnection } from '../services/websocket/mainWebSocket';
import { frontEndCommand } from '../services/backendMessaging/backendCommands';

// Stores & Data
import { useOrderStore } from '../store/orderStore';
import { useOverallStore } from '../store/overallStore';


/* CODE STARTS HERE */

window.Buffer = Buffer;

const confirm = useConfirm();
const toast = useToast();
const isAdmin = ref(localStorage.getItem("adminToken"))
const orderStore = useOrderStore();
const overallStore = useOverallStore();

onMounted(() => {
  if (connection && connection.readyState === WebSocket.OPEN) {
    frontEndCommand(connection, FrontEndCommand.MainScreenView);
  } else {
    establishConnection()
    frontEndCommand(connection, FrontEndCommand.MainScreenView);
  }
  console.log("notified backend about new view - main " + FrontEndCommand.MainScreenView);
  
})

onBeforeMount(() => {
  isAdmin.value = localStorage.getItem("adminToken")

})


const logout = () => {
  if (connection && connection.readyState === WebSocket.OPEN) {
    frontEndCommand(connection, FrontEndCommand.LogoutUser);
    localStorage.removeItem("adminToken")
    localStorage.removeItem("authToken")
    router.push("/");

    console.log("notified backend about user logout " + FrontEndCommand.LogoutUser);
  }
}

const confirmShutdown = () => {
  confirm.require({
    message: 'Are you sure you want to proceed?',
    header: 'Teststation Shutdown',
    rejectProps: {
      label: 'Cancel',
      severity: 'contrast',
      outlined: false

    },
    acceptProps: {
      label: 'Shut down',
      severity: 'danger'
    },
    accept: () => {
      toast.add({ severity: 'contrast', summary: 'Confirmed', detail: 'Teststation is shutting down...', life: 5000 });
      frontEndCommand(connection, FrontEndCommand.ShutDown)
      console.log("notified backend about system shutdown " + FrontEndCommand.ShutDown);
    },
    reject: () => {
      toast.add({ severity: 'contrast', summary: 'Rejected', detail: 'Shutdown cancelled', life: 3000 });
    }
  });
};
</script>




<style scoped>

.footer-bottom {
  bottom: 0;
  position: fixed;
  width: 100%;
}

</style>