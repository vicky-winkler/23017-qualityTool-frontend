<template>
    <DataTable ref="dataTable" v-model:selection="selectedDataSet" selectionMode="single"
        :metaKeySelection="false" 
        :value="orders" 
        dataKey="id"
        :paginator="true" 
        :rows="6" 
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
        @rowSelect="onRowSelect"
        @rowUnselect="onRowUnselect">

        <Column field="id" header="Id" sortable style="min-width: 6rem; max-height: 3rem; font-size:medium;"></Column>
        <Column field="orderId" header="Order Id" sortable style="min-width: 12rem; font-size:medium;"></Column>
        <Column field="kitType" header="KitType" sortable style="min-width: 6rem; font-size:medium;"></Column>
        <Column field="totalAmount" header="Total Amount" sortable style="min-width: 6rem; font-size:medium;"></Column>
        <Column field="doneAmount" header="Done Amount" sortable style="min-width: 10rem; font-size:medium;"></Column>
        <Column field="matrikelNummer" header="Creator Id" sortable style="min-width: 10rem; font-size:medium;"></Column>
        <!-- <Column field="timeStamp" header="Timestamp" sortable style="min-width: 10rem; font-size:x-large;"></Column> -->
        <Column header="Created" class="p-0 m-0" sortable style="width: 10%; font-size:medium;">
            <template #body="slotProps">
                <p>{{ formatTimestamp(slotProps.data.timeStamp) }}</p>
            </template>
        </Column>


        <!-- <Column field="completed" header="Completed" class="p-0 m-0" sortable style="width: 10%; font-size:x-large;"></Column> -->
        <!-- STATUS DONE / OPEN -->
        <Column header="Status" class="p-0 m-0" sortable style="width: 10%; font-size:medium;">
            <template #body="slotProps">
                <Tag :value="slotValueCompleted(slotProps.data.completed)" :severity="getSeverity(slotProps.data.completed)" /> 
            </template>
        </Column>


        <!-- DELETE ORDER Button (ONLY ADMIN and if no Box has been added to it!!!) -->
        <Column v-if="isAdmin === 'true'" >
            <template #body="{ data }">
                <Button v-if="showDeleteButton(data)" icon="pi pi-trash" @click="deleteOrder(data)"  severity="danger" rounded variant="text" raised></Button>
            </template>
        </Column>
        
        <!-- FOOTER -  show open orders! -->
        <div class="pr-12 footer-bottom"> 
            <div class="pr-12 pb-6">
                <p class="p-2 pt-2 font-bold bg-zinc-800 uppercase text-white text-center text-base">Open Orders: {{ openOrders }} </p>
            </div>
        </div>
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

// Messaging and Commands
import { connection } from '../../services/websocket/mainWebSocket';
import { FrontEndCommand } from '../../services/backendMessaging/commandEnums';
import { frontEndSettingsData} from '../../services/backendMessaging/backendCommands';

// Data and Stores
import { useOrdersApiStore } from '../../store/order/index';
import { useOrderStore } from '../../store/orderStore';



/* CODE STARTS HERE */
// init stores
const ordersApiStore = useOrdersApiStore();
const orderStore = useOrderStore();
const toast = useToast();
const isAdmin = ref(localStorage.getItem("adminToken"))

// local variables
const dataTable = ref();
const selectedDataSet = ref();
const orders = ref();
const orderLength = ref(0);
const openOrders = ref(0);

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
    // Fetch data from API 
    const { success, status } = await ordersApiStore.dispatchOrders("Order/");

    if (!success) {
        alert("Something went wrong");
        console.log("api Status", status);
    }
    else {
        console.log('fetch data successful');

        // Add Pre-Sorting
        const fetchedOrders = ordersApiStore.orders;

        // Sort: incomplete first, then by timestamp (newest first for completed)
        fetchedOrders.sort((a, b) => {
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1; // incomplete first
            }

            const timeA = new Date(a.timeStamp).getTime();
            const timeB = new Date(b.timeStamp).getTime();

            if (a.completed) {
                return timeB - timeA; // newest first
            } else {
                return timeB - timeA; // oldest first (optional)
            }
        });

        // assign to table
        orders.value = ordersApiStore.orders;

        // calc open orders
        orderLength.value = computed(() => orders.value.length).value;
        calcOpenOrders(orders.value);
    }

}



// when selecting a row
const onRowSelect = (event) => {

    // if not completed -> push backend and add to order Store
    if(!event.data.completed){
        // push to backend!
        sendToBackend(event.data.id, event.data.orderId);

        // add to orderStore
        orderStore.kitType = event.data.kitType;
        orderStore.totAmount = event.data.totalAmount;
        orderStore.doneAmount = event.data.doneAmount;
        orderStore.completed = event.data.completed;
        orderStore.orderId = event.data.orderId;
        
        // set Kit OrderVariables
        setOrderVariables(event.data.kitType);

    }
    // else Toast -> Already Completed
    else{
        toast.add({ severity: 'danger', summary: 'Selected Order', detail: 'This Order is completed and cannot be selected!', life: 3000 });
    }


};


// when unselecting a row
const onRowUnselect = (event) => {
    // push to backend


    // update orderStore
    orderStore.orderId = 0;
    orderStore.kitType = 'none';
    orderStore.totAmount = 0;
    orderStore.doneAmount = 0;
    orderStore.completed = true;
    
    setOrderVariables('none');
};


// send Selected Row to backend
function sendToBackend(id, orderId){
    var resultString = `${id}, ${orderId}`;

    if (connection && connection.readyState === WebSocket.OPEN) {
        frontEndSettingsData(connection, FrontEndCommand.SelectOrder, resultString);
        console.log('Select Order!');
    }
}




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



// Order Status given from completed
const slotValueCompleted = (orderCompleted) => {
    
    if(orderCompleted){
        return "DONE";
    }
    else {
        return "OPEN";
    }
}


// Get Severity for Completed => COMPLETE = GREEN, not COMpleted = RED
const getSeverity = (orderCompleted) =>{
    
    if(orderCompleted === true){
        return 'success';
    }
    else{
        return 'danger';
    }

}



// Delete Button
function deleteOrder(data){
    // send delete command to backend
    var resultString = `${data.id}, ${data.orderId}`;

    if (connection && connection.readyState === WebSocket.OPEN) {
        frontEndSettingsData(connection, FrontEndCommand.DeleteOrder, resultString);
        console.log('Delete Order!');
    }


}


// counts number of open orders
function calcOpenOrders(orders){
    var count = 0;

    for (var i = 0; i < orderLength.value; i++) {
        if(!orders[i].completed){
            count++;
        }
    }

    openOrders.value = count;

}


// disables Delete Button
function showDeleteButton(data){
    if(data.doneAmount !== 0){
        return false;
    }
    else{
        return true;
    }
}



// sets Order variables based on KitType
function setOrderVariables(kitType){

    var numberBoots = 0;
    var frontBootSize = 0;
    var backBootSize = 0;
    var numberPasternWraps = 0;
    var numberYCharger = 0;

    switch(kitType) {
        case "Kit2x2":
            numberBoots = 4;
            frontBootSize = 2;
            backBootSize = 2;
            numberPasternWraps = 2;
            numberYCharger = 2;
            break;
        case "Kit3x2":
            numberBoots = 4;
            frontBootSize = 3;
            backBootSize = 2;
            numberPasternWraps = 2;
            numberYCharger = 2;
            break;
        case "Kit3x3":
            numberBoots = 4;
            frontBootSize = 3;
            backBootSize = 3;
            numberPasternWraps = 2;
            numberYCharger = 2;
            break;
        case "Kit4x3":
            numberBoots = 4;
            frontBootSize = 4;
            backBootSize = 3;
            numberPasternWraps = 2;
            numberYCharger = 2;
            break;
        case "Kit4x4":
            numberBoots = 4;
            frontBootSize = 4;
            backBootSize = 4;
            numberPasternWraps = 2;
            numberYCharger = 2;
            break;
        case "Kit5x4":
            numberBoots = 4;
            frontBootSize = 5;
            backBootSize = 4;
            numberPasternWraps = 2;
            numberYCharger = 2;
            break;
        case "Kit5x5":
            numberBoots = 4;
            frontBootSize = 5;
            backBootSize = 5;
            numberPasternWraps = 2;
            numberYCharger = 2;
            break;
        case "Kit2x0":
            numberBoots = 2;
            frontBootSize = 2;
            backBootSize = 0;
            numberPasternWraps = 1;
            numberYCharger = 1;
            break;
        case "Kit3x0":
            numberBoots = 2;
            frontBootSize = 3;
            backBootSize = 0;
            numberPasternWraps = 1;
            numberYCharger = 1;
            break;
        case "Kit4x0":
            numberBoots = 2;
            frontBootSize = 4;
            backBootSize = 0;
            numberPasternWraps = 1;
            numberYCharger = 1;
            break;
        case "Kit5x0":
            numberBoots = 2;
            frontBootSize = 5;
            backBootSize = 0;
            numberPasternWraps = 1;
            numberYCharger = 1;
            break;
        case "none":
            numberBoots = 0;
            frontBootSize = 0;
            backBootSize = 0;
            numberPasternWraps = 0;
            numberYCharger = 0;
            break;
        } 

        orderStore.numberBoots = numberBoots;
        orderStore.frontBootSize = frontBootSize;
        orderStore.backBootSize = backBootSize;
        orderStore.numberPasternWraps = numberPasternWraps;
        orderStore.numberYCharger = numberYCharger;
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