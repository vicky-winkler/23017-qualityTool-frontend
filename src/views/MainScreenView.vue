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
    
      <!-- Button Package -->
      <router-link style="width: 33%;" :to="{ name: 'boxView' }">
        <Button 
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold  rounded-none text-center"
          style="border-radius: 0px; height: 70vh;  width: 100%;" label="Delete" severity="info">
          <div class="flex-col">
            <i class="pi pi-box" style="font-size: 4rem"></i>
            <p class="text-3xl uppercase">Packages</p>
          </div>
        </Button>
      </router-link>

      <!-- Button Boot -->
      <router-link style="width: 33%;" :to="{ name: 'bootView' }">
        <Button 
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-none text-center"
          style="border-radius: 0px; height: 70vh; width: 100%;" label="Delete" severity="info">
          <div class="flex-col">
            <i class="fa-solid fa-shoe-prints" style="font-size: 4rem"></i>
            <p class="text-3xl uppercase">Shoes</p>
          </div>
        </Button>
      </router-link>

      <!-- Button Measurement Single -->
      <router-link style="width: 33%;" :to="{ name: 'measurementSingleView' }">
        <Button 
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold  rounded-none text-center"
          style="border-radius: 0px; height: 70vh;  width: 100%;" label="Delete" severity="info">
          <div class="flex-col">
            <i class="pi pi-chart-line" style="font-size: 4rem"></i>
            <p class="text-3xl uppercase">Single-Loadcell Measurements</p>
          </div>
        </Button>
      </router-link>

      <!-- Button Measurement Multi -->
      <router-link style="width: 33%;" :to="{ name: 'measurementMultiView' }">
        <Button 
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold  rounded-none text-center"
          style="border-radius: 0px; height: 70vh;  width: 100%;" label="Delete" severity="info">
          <div class="flex-col">
            <i class="pi pi-chart-scatter" style="font-size: 4rem"></i>
            <p class="text-3xl uppercase">7-Loadcells Measurements</p>
          </div>
        </Button>
      </router-link>

    </div>
  </div>

    <!-- LOGOS -->
  <div class="pl-12 pr-12 pt-6 pb-6 card flex justify-between footer-bottom">
    <img src="../assets/imgs/logos/consteed_wide_yellow.png" alt="Image Consteed" width="340"/>
    <img src="../assets/imgs/logos/tratter.png" alt="Image Tratter" width="340"/>
  </div>



</template>

<script setup>
//VUEW
import { ref, onBeforeMount, onMounted } from 'vue';
import { RouterLink } from "vue-router";
import router from '../router';
import { Buffer } from 'buffer';

// Graphic Components
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";
import Button from "primevue/button";

// Messaging & Commands
import { FrontEndCommand } from '../services/backendMessaging/commandEnums';
import { connection, establishConnection } from '../services/websocket/mainWebSocket';
import { frontEndCommand } from '../services/backendMessaging/backendCommands';

// Stores & Data
import { useOverallStore } from '../store/overallStore';


/* CODE STARTS HERE */

window.Buffer = Buffer;

const toast = useToast();
const isAdmin = ref(localStorage.getItem("adminToken"))
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

</script>




<style scoped>

.footer-bottom {
  bottom: 0;
  position: fixed;
  width: 100%;
}

</style>