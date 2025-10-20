import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import Lara from '@primevue/themes/lara';

// tailwind
import './index.css'
import 'primeicons/primeicons.css'


// primevue styled
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';


// Layouts
import MainModeLayout from "./components/Layouts/MainModeLayout.vue";
import VueApexCharts from "vue3-apexcharts";

// Icons
import '@fortawesome/fontawesome-free/css/all.min.css'


const app = createApp(App)



app.use(createPinia()) //use pinia
app.use(ToastService);
app.use(ConfirmationService);
app.use(VueApexCharts);
// primevue Theme
app.use(PrimeVue, {
    theme: {
        preset: Lara
    }
})

app.component("MainModeLayout", MainModeLayout)

// PrimeVue
app.component('DataTable', DataTable);
app.component('Column', Column);

app.use(router) //use router

app.mount('#app')
