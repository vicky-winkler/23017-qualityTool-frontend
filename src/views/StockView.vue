<template>
    <!-- Header: Title + BACK Button -->
 <div class="pl-12 pr-12 pb-0 pt-6 flex justify-between">
    <div class="bg-zinc-900" style="width: 100%">
      <h1 class="p-2 pl-6 font-bold bg-zinc-800 uppercase text-white text-left text-3xl">STOCK-PANEL</h1>
    </div>
    <router-link style="width: 20%" :to="{ name: 'mainScreenView' }"
      class="bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 px-4 rounded-none uppercase text-xl text-center">Back to Menu
    </router-link>
  </div>

  
  </template>
  
  <script setup>
  // VUE
  import { RouterLink } from "vue-router";
  import { onMounted, onUnmounted } from 'vue';
  
  // Messaging and Commands
  import slip from 'slip';
  import { decodeMessage } from '../services/backendMessaging/backendCommands';
  import { connection } from '../services/websocket/mainWebSocket';
  import { FrontEndCommand } from '../services/backendMessaging/commandEnums';
  import { frontEndCommand } from '../services/backendMessaging/backendCommands';
  
  // Graphic Components

  
  
  onMounted(() => {
    // Send View Command
    if (connection) {
      frontEndCommand(connection, FrontEndCommand.StockView);
    }
  })
  
  onUnmounted(() => {
    // Send View Command
    if (connection) {
      frontEndCommand(connection, FrontEndCommand.MainScreenView);
    }
  })
  </script>