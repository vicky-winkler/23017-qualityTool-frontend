<template>
  <!-- FILTER -->
  <div class="mb-3 flex items-center gap-8">
    <InputText 
      v-model="filterText" 
      placeholder="Search by TimeStamp and Creator Id"
      style="width: 100%;"
    />
  </div>
  <!-- DATA TABLE -->
    <DataTable ref="dataTable" v-model:selection="selectedDataSet" selectionMode="single"
        :metaKeySelection="false" 
        :value="filteredQualitySingles" 
        dataKey="id"
        :paginator="true" 
        :rows="12" 
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
        @rowSelect="onRowSelect"
        @rowUnselect="onRowUnselect">

        <Column field="id" header="Id" sortable style="min-width: 6rem; max-height: 3rem; font-size:medium;"></Column>
        <Column field="userMatrikelNumber" header="Creator Id" sortable style="min-width: 12rem; font-size:medium;"></Column>
        <!-- <Column field="timeStamp" header="Timestamp" sortable style="min-width: 10rem; font-size:x-large;"></Column> -->
        <Column header="Created" class="p-0 m-0" sortable style="width: 30%; font-size:medium;">
            <template #body="slotProps">
                <p>{{ formatTimestamp(slotProps.data.timeStamp) }}</p>
            </template>
        </Column>
        <!-- STATUS FAIL / PASS -->
        <Column header="Status" class="p-0 m-0" sortable style="width: 20%; font-size:medium;">
            <template #body="slotProps">
                <Tag :value="setStatus(slotProps.data.status)" :severity="getSeverity(slotProps.data.status)" /> 
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
import{ useSingleCellStore } from "../../../store/singleCellStore";

/* CODE STARTS HERE */
// init stores
const toast = useToast();
const isAdmin = ref(localStorage.getItem("adminToken"))

// local variables
const qualitySingles = ref();
const selectedDataSet = ref(null);
const filterText = ref("");
const singleCellStore = useSingleCellStore()

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
    const response = await API.qualitySingle.getAll();

    // console.log('API raw response:', response);
    if (Array.isArray(response)) {

      // Sort newest first (descending by timeStamp)
      response.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));

      qualitySingles.value = response;

      console.log("Loaded array of qualitySingles, count =", qualitySingles.value.length);
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


const filteredQualitySingles = computed(() => {
  if (!filterText.value.trim()) return qualitySingles.value;

  const search = filterText.value.toLowerCase();

  return qualitySingles.value.filter((b) => {
    // Convert timestamp to readable date (localized & ISO)
    const date = new Date(b.timeStamp);
    const formattedDateDE = date.toLocaleDateString("de-DE"); // e.g. "21.10.2025"
    const formattedDateISO = date.toISOString().split("T")[0]; // e.g. "2025-10-21"

    // Collect searchable fields (numbers are converted to strings)
    const fields = [
      b.userMatrikelNumber,
      formattedDateDE,
      formattedDateISO,
    ];

    // Return true if any field includes the search term
    return fields.some((val) => {
      if (val === null || val === undefined) return false;
      return val.toString().toLowerCase().includes(search);
    });
  });
});

// when selecting a row
const onRowSelect = (event) => {
  // add to singleCell
  singleCellStore.singleCell = event.data;
  console.log("Selected singleCell:", singleCellStore.singleCell);
  selectedDataSet.value = event.data;
};


// when unselecting a row
const onRowUnselect = (event) => {
  // update singleCell
  singleCellStore.resetStore();
  selectedDataSet.value = null;
};



// Format timestamp to something more readable
function formatTimestamp(timestamp){
    // parse
    const dateMs = Date.parse(timestamp);
    const date = new Date(dateMs);

    var month = "";

    if((date.getMonth()+1) < 10){
        month = "0" +  (date.getMonth() + 1);
    }
    else{
        month =(date.getMonth() + 1);
    }


    return "" + date.getDate() + "." + month + "." + date.getFullYear() + "\t" + date.getHours() + ":" + date.getMinutes();

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