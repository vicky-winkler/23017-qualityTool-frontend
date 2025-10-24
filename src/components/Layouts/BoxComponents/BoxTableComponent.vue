<template>
  <!-- FILTER -->
  <div class="mb-3 flex items-center gap-8">
    <InputText 
      v-model="filterText" 
      placeholder="Search OrderId, KitType, SerialNumber, TimeStamp, Creator Id, SensorSerialNumber, RFID, MacAddress or EcuDeviceId"
      style="width: 100%;"
    />
  </div>
  <!-- DATA TABLE -->
    <DataTable ref="dataTable" v-model:selection="selectedDataSet" selectionMode="single"
        :metaKeySelection="false" 
        :value="filteredBoxes" 
        dataKey="id"
        :paginator="true" 
        :rows="14" 
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
        @rowSelect="onRowSelect"
        @rowUnselect="onRowUnselect">

        <Column field="id" header="Id" sortable style="min-width: 6rem; max-height: 3rem; font-size:medium;"></Column>
        <Column field="orderId" header="Order Id" sortable style="min-width: 6rem; font-size:medium;"></Column>
        <Column field="kitType" header="Kit Type" sortable style="min-width: 6rem; font-size:medium;"></Column>
        <Column field="serialNumber" header="Serialnumber" sortable style="min-width: 6rem; font-size:medium;"></Column>
        <Column field="matrikelNummer" header="Creator Id" sortable style="min-width: 6rem; font-size:medium;"></Column>
        <!-- <Column field="timeStamp" header="Timestamp" sortable style="min-width: 10rem; font-size:x-large;"></Column> -->
        <Column header="Created" class="p-0 m-0" sortable style="width: 20%; font-size:medium;">
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
import { API }  from "../../../services/api/index";
import { useBoxStore } from "../../../store/boxStore";

/* CODE STARTS HERE */
// init stores
const toast = useToast();
const isAdmin = ref(localStorage.getItem("adminToken"))

// local variables
const boxes = ref();
const selectedDataSet = ref(null);
const filterText = ref("");
const boxStore = useBoxStore();

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
    const response = await API.box.getAll();

    // console.log('API raw response:', response);
    if (Array.isArray(response)) {

      // Sort newest first (descending by timeStamp)
      response.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));

      boxes.value = response;

      console.log("Loaded array of boxes, count =", boxes.value.length);
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


const filteredBoxes = computed(() => {
  if (!filterText.value.trim()) return boxes.value;

  const search = filterText.value.toLowerCase();

  return boxes.value.filter((b) => {
    // Convert timestamp to readable date (localized & ISO)
    const date = new Date(b.timeStamp);
    const formattedDateDE = date.toLocaleDateString("de-DE"); // e.g. "21.10.2025"
    const formattedDateISO = date.toISOString().split("T")[0]; // e.g. "2025-10-21"

    // Collect base fields
    const baseFields = [
      b.orderId,
      b.kitType,
      b.serialNumber,
      b.matrikelNummer,
      formattedDateDE,
      formattedDateISO,
      b.language,
      b.version,
    ];

    // Apply hyphenation to each ECU device ID for better matching
    const ecuHyphenated = (b.ecuDeviceIds || []).map(deviceIdHyphenated);

    // Safely flatten array fields
    const arrayFields = [
      ...(b.sensorTestRFIDs || []),
      ...(b.sensorSerialNumbers || []),
      ...(b.macAddresses || []),
      ...(b.ecuDeviceIds || []),
      ...ecuHyphenated,          // hyphenated
    ];

    // Combine everything into one searchable list
    const allFields = [...baseFields, ...arrayFields];

    // Return true if *any* field (stringified) matches search
    return allFields.some((val) => {
      if (val === null || val === undefined) return false;
      return val.toString().toLowerCase().includes(search);
    });
  });
});

// when selecting a row
const onRowSelect = (event) => {
  // add to boxStore
  boxStore.box = event.data;
  console.log("Selected box:", boxStore.box);
  selectedDataSet.value = event.data;
  boxStore.detailsModal = true;
};


// when unselecting a row
const onRowUnselect = (event) => {
  // update boxStore
  boxStore.resetStore();
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


// Sets status of EndTest
function setStatus(statusArray){
  return checkAllTrue(statusArray) ? 'PASS' : 'FAIL';
}


// Get Severity for Completed => COMPLETE = GREEN, not COMpleted = RED
function getSeverity(statusArray){
  return checkAllTrue(statusArray) ? 'success' : 'danger';
}


// Helper for Status checking
function checkAllTrue(statusArray){
  return Array.isArray(statusArray) && statusArray.every((s) => s === true);
}

// devIdHyphenated
function deviceIdHyphenated(deviceId) {
  if (!deviceId || deviceId.length % 2 !== 0) {
    throw new Error("Invalid device ID format.");
  }

  const bytes = [];

  for (let i = 0; i < deviceId.length; i += 2) {
    const hexPair = deviceId.substring(i, i + 2);
    const decimalValue = parseInt(hexPair, 16);
    bytes.push(decimalValue.toString());
  }

  return bytes.join("-");
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