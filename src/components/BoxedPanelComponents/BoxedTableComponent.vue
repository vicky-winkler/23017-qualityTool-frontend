<template>
  <DataTable ref="dataTable" v-model:selection="selectedDataSet" selectionMode="single"
    :metaKeySelection="false" 
    :value="boxes" dataKey="id" 
    :paginator="true" 
    :rows="7" 
    :filters="filters"
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    :rowsPerPageOptions="[7, 24, 48, 96]"
    currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" 
    @rowSelect="onRowSelect"
    @rowUnselect="onRowUnselect">

    <Column field="id" header="Id" sortable style="min-width: 6rem; max-height: 3rem; font-size:x-large;"></Column>
    <Column field="orderId" header="Order Id" sortable style="min-width: 12rem; font-size:x-large;"></Column>
    <Column field="kitType" header="KitType" sortable style="min-width: 6rem; font-size:x-large;"></Column>
    <Column field="serialNumber" header="Serial Number" sortable style="min-width: 6rem; font-size:x-large;"></Column>
    <Column field="matrikelNummer" header="Operator Id" sortable style="min-width: 10rem; font-size:x-large;"></Column>
    <Column field="sensorTestIds" header="Sensor Ids" sortable style="min-width: 10rem; font-size:x-large;"></Column>
    <Column field="sensorTestRFIDs" header="Sensor Rfids" sortable style="min-width: 10rem; font-size:x-large;"></Column>

    <Column header="Timestamp" class="p-0 m-0" sortable style="width: 10%; font-size:x-large;">
      <template #body="slotProps">
        <p>{{ formatTimestamp(slotProps.data.timeStamp) }}</p>
      </template>
    </Column>

    <!-- DELETE BOX Button (ONLY ADMIN) -->
    <Column v-if="isAdmin === 'true'" >
      <template #body="{ data }">
        <Button icon="pi pi-trash" @click="openDeleteModal(data)"  severity="danger" rounded variant="text" raised></Button>
      </template>
    </Column>

    <!-- FOOTER -  show completed Boxes! -->
    <template #footer> Completed Boxes: {{ boxes ? boxes.length : 0 }} </template>

  </DataTable>

  <!-- Confirm Delete Modal -->
  <template>
    <Dialog v-model:visible="enableDeleteModal" modal header="Delete Box" :style="{ width: '35%' }">
      <p class="pb-6">Do you really wish to delete this entry?</p>
      <Button severity="danger" type="button" label="Delete" @click="deleteBox()"></Button>
    </Dialog>
  </template>


</template>

<script setup>
// VUE
import { ref, onMounted, onBeforeMount } from 'vue';

// Primevue Components
import { FilterMatchMode } from '@primevue/core/api';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';

// Messaging and Commands
import { connection } from '../../services/websocket/mainWebSocket';
import { FrontEndCommand } from '../../services/backendMessaging/commandEnums';
import { frontEndSettingsData} from '../../services/backendMessaging/backendCommands';


// Data and Stores
import { useBoxesApiStore } from '../../store/boxed/index';




/* CODE STARTS HERE */
const boxesApiStore = useBoxesApiStore();
const isAdmin = ref(localStorage.getItem("adminToken"))

// local variables
const dataTable = ref();
const selectedDataSet = ref();
const boxes = ref();
const selectedID = ref(-1);
const enableDeleteModal = ref(false);
const currentData = ref();


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



// Fetch and Load Data from DB
async function loadData(){
  console.log('fetch data...');
  // Fetch data from API 
  const { success, status } = await boxesApiStore.dispatchBoxes("Box/");

  if (!success) {
      alert("Something went wrong");
      console.log("api Status", status);
  }
  else {
      console.log('fetch data successful');
      boxes.value = boxesApiStore.boxes;
  }
}



// when selecting a row
const onRowSelect = (event) => {
  selectedID.value = event.data.id
};

// when unselecting a row
const onRowUnselect = (event) => {
  selectedID.value = -1
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


// opens delete Modal => which on confirmation deletes the entry
function openDeleteModal(data){
  currentData.value = data;
  enableDeleteModal.value = true;

}




// Delete Button
function deleteBox(){

  enableDeleteModal.value = false;

  // send delete command to backend
  var resultString = `${currentData.value.id}, ${currentData.value.orderId}`;

  if (connection && connection.readyState === WebSocket.OPEN) {
      frontEndSettingsData(connection, FrontEndCommand.DeleteBox, resultString);
      console.log('Delete Order!');
  }


}


defineExpose({
    loadData,
});


</script>