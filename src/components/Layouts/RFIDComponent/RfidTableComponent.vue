<template>
  <!-- FILTER -->
  <div class="mb-3 flex items-center gap-8">
    <InputText 
      v-model="filterText" 
      placeholder="Search by Serial Number, IEE Id or RFID"
      style="width: 100%;"
    />
  </div>
  <!-- DATA TABLE -->
    <DataTable ref="dataTable" v-model:selection="selectedDataSet" selectionMode="single"
        :metaKeySelection="false" 
        :value="filteredConditionedSensors" 
        dataKey="id"
        :paginator="true" 
        :rows="12" 
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
        @rowSelect="onRowSelect"
        @rowUnselect="onRowUnselect">

        <Column field="id" header="Id" sortable style="min-width: 6rem; max-height: 3rem; font-size:medium;"></Column>
        <Column field="ovenId" header="Oven Id" sortable style="min-width: 12rem; font-size:medium;"></Column>
        <Column field="sensorSerialNumber" header="Serial Number" sortable style="min-width: 12rem; font-size:medium;"></Column>
        <Column field="ieeSensorSerialNumber" header="IEE Id" sortable style="min-width: 12rem; font-size:medium;"></Column>
        <Column field="rfid" header="RFID" sortable style="min-width: 12rem; font-size:medium;"></Column>
        <Column field="size" header="Size" sortable style="min-width: 12rem; font-size:medium;"></Column>
        <!-- <Column field="timeStamp" header="Timestamp" sortable style="min-width: 10rem; font-size:x-large;"></Column> -->
        <Column header="Created" class="p-0 m-0" sortable style="width: 30%; font-size:medium;">
            <template #body="slotProps">
                <p>{{ formatTimestamp(slotProps.data.timeStamp) }}</p>
            </template>
        </Column>
    </DataTable>

    <Toast position="bottom-center" />
</template>
    
<script setup>
// VUE
import { ref, onMounted, onBeforeMount, computed } from 'vue';

// Primevue Components
import { FilterMatchMode } from '@primevue/core/api';
import Toast from 'primevue/toast';
import { useToast } from "primevue/usetoast";
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row';                   // optional
import InputText from 'primevue/inputtext';

// Messaging and Commands

// Data and Stores
import { API } from "../../../services/api/index";
import{ useConditionedSensorStore } from "../../../store/conditionedSensorStore";

/* CODE STARTS HERE */
// init stores
const toast = useToast();
const isAdmin = ref(localStorage.getItem("adminToken"))

// local variables
const conditionedSensor = ref();
const selectedDataSet = ref(null);
const filterText = ref("");
const conditionedSensorStore = useConditionedSensorStore()

// DataTable
const filters = ref({
  'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});


onBeforeMount(() => {
  isAdmin.value = localStorage.getItem("adminToken");

})

// Fetch and Load Data from DB on mount
onMounted(async () => {
   loadData();
});


// load Data from DB
async function loadData(){
    console.log('fetch data...');
  try {
    // Fetch from API
    const response = await API.conditionedSensor.getAll();

    // console.log('API raw response:', response);
    if (Array.isArray(response)) {

      if (Array.isArray(response.status)) {
        response.status = response.status.map(s =>
          s === true || s === "true" || s === 1 || s === "1"
        );
      }

      // Sort newest first (descending by timeStamp)
      response.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));

      conditionedSensor.value = response;

      console.log("Loaded array of conditionedSensor, count =", conditionedSensor.value.length);
      return;
    }
  } catch (error) {
    console.error('API error:', error);
    toast.add({
      severity: 'error',
      summary: 'Network Error',
      detail: error.message,
      life: 4000,
    });
  }
}


const filteredConditionedSensors = computed(() => {
  if (!filterText.value.trim()) return conditionedSensor.value;

  const search = filterText.value.toLowerCase();

  return conditionedSensor.value.filter((b) => {
    // Convert timestamp to readable date (localized & ISO for matching)
    const date = new Date(b.timeStamp);
    const formattedDateDE = date.toLocaleDateString("de-DE"); // e.g. "21.10.2025"
    const formattedDateISO = date.toISOString().split("T")[0]; // e.g. "2025-10-21"

    // Search in all relevant fields
    return [
      b.sensorSerialNumber,
      b.rfid,
      b.ieeSensorSerialNumber,
      formattedDateDE,
      formattedDateISO,
    ].some((val) => val && val.toLowerCase().includes(search));
  });
});



// when selecting a row
const onRowSelect = (event) => {
  // add to singleCell
  conditionedSensorStore.conditionedSensorSerialNumber = event.data.sensorSerialNumber;
  conditionedSensorStore.conditionedSensor = event.data;
  console.log("Selected sensorSerialNumber:", conditionedSensorStore.conditionedSensorSerialNumber);
  selectedDataSet.value = event.data;
  conditionedSensorStore.replaceRfidModal = true;
  console.log("Modal: " +conditionedSensorStore.replaceRfidModal);
};


// when unselecting a row
const onRowUnselect = (event) => {
  // update singleCell
  conditionedSensorStore.resetStore();
  selectedDataSet.value = null;
};



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



defineExpose({
    loadData,
});



</script>


<style scoped>

.footer-bottom {
  bottom: 0;
  position: fixed;
  width: 100%;
}


/* Showing 1 to 4 of 4 */
::v-deep(.p-paginator-current) {
  @apply text-sm text-white;
}


</style>