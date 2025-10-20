<template>
    <div >
        <!-- Advice to use QRCode or Barcode Scanner for autocompletion -->
         <div class="flex justify-between items-center pb-6">
            <label class="flex text-base">Use BarCode Scanner to Scan QR-Code (complete order) or Order Id!</label>
            <img class="flex " :src="qrCodeImage" style="width: 7%">
         </div>

        <!-- Input Fields -->
        <div class="flex flex-col gap-4">
            <!-- Order ID -->
            <div>
                <label class="text-base">Order ID</label>
                <InputNumber v-model="orderID" inputId="withoutgrouping" :useGrouping="false" v-on:input="updateOnOrderIdChange()" :disabled="orderIDDisabled" placeholder="Order Id - Scan BarCode" size="small" class="w-full" />
            </div>
            <!-- Total Amount -->
            <div>
                <label class="text-base">Amount</label>
                <InputNumber v-model="amount" inputId="withoutgrouping" :useGrouping="false" v-on:input="updateOnAmountChange()" :disabled="amountDisabled" placeholder="Amount of Boxes" size="small" class="w-full"/>
            </div>
            <!-- Front Size -->
            <div>
                <label class="text-base">Front Size</label>
                <Select v-model="selectedFrontSize" :options="frontSizes" v-on:change="updateOnFrontSizeChange()" :disabled="frontSizeDisabled" placeholder="Select Front Size" size="small" class=" w-full text-white text-sm" />
            </div>
            <!-- Back Size -->
            <div class="pb-12">
                <label class="text-base">Back Size</label>
                <Select v-model="selectedBackSize" :options="backSizes" v-on:change="updateOnBackSizeChange()" :disabled="backSizeDisabled" placeholder="Select Back Size" size="small" class=" w-full text-white text-sm" />
            </div>
        </div>

        <!-- Error Message -->
        <h1 class="text-red-600 text-base" v-if="errorMessage !== ''">{{ errorMessage }}</h1>

        <!-- Submit Button -->
        <div class="">
            <Button class="rounded-none text-white font-semibold text-center"
                @click="submitForm()" 
                style="border-radius: 0px; width: 100%; height: 50px;" >
                Submit
            </Button>
        </div>

  </div>
  
</template>
    
<script setup>
// VUE
import { ref, onMounted, onUnmounted, defineProps, watchEffect } from 'vue';


// Primevue Component
import Select from 'primevue/select';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from "primevue/button";

// Messaging & Commands
import { connection } from '../../services/websocket/mainWebSocket';
import { FrontEndCommand } from '../../services/backendMessaging/commandEnums';
import { frontEndCommand, frontEndIntArrayData, frontEndNackCommand, frontEndSettingsData } from '../../services/backendMessaging/backendCommands';

// Images
import qrCodeImage from '../../assets/imgs/order/QR_Code_example.png';


/* CODE STARTS HERE */


// local variables
const selectedFrontSize = ref();
const selectedBackSize = ref();
const amount = ref();
const orderID = ref();

const frontSizes = ref([2, 3, 4, 5]);
const backSizes = ref([0, 2, 3, 4, 5,]);

const errorMessage = ref('');
const backSizeDisabled = ref(true);
const frontSizeDisabled = ref(false);
const amountDisabled = ref(false);
const orderIDDisabled = ref(false);

  
onMounted(() => {
  // Send Enable Scanner Command
  if (connection) {
    frontEndCommand(connection, FrontEndCommand.Scanner);
  }
})


onUnmounted(() => {
  // Send Disable Scanner Command
  if (connection) {
    frontEndNackCommand(connection, FrontEndCommand.Scanner);
  }
})




// message IntArray = [orderID, KitTypeInt1 (front), KitTypeInt2 (back), TotalAmount]
function submitForm(){
    console.log('submitForm ' + orderID.value);
    errorMessage.value = '';

    // validate form
    if(orderID.value > 5000000 && orderID.value < 9999999) { // TODO greater length e.g. 5.000.000
        if(amount.value > 0) {
            if(selectedFrontSize.value > 0 && selectedFrontSize.value < 6){
                if(selectedBackSize.value <= selectedFrontSize.value && selectedBackSize.value >= 0){
                    // valid!
                    sendToBackend();
                }
                else{
                    errorMessage.value = "Please select a valid Back Size";
                }
            }
            else{
                errorMessage.value = "Please select a valid Front Size";
            }
        }
        else{
            errorMessage.value = "Please enter a valid Amount";
        }
    }
    else {
        errorMessage.value = "Please enter a valid Order ID (between 5000000 and 7000000)";
    }      

}


// send data to backend: [orderID, KitTypeInt1 (front), KitTypeInt2 (back), TotalAmount]
function sendToBackend(){

    var resultArray = [orderID.value, selectedFrontSize.value, selectedBackSize.value, amount.value]
    var resultString = `${orderID.value}, ${selectedFrontSize.value}, ${selectedBackSize.value}, ${amount.value}`;

    console.log(orderID.value);

    if (connection && connection.readyState === WebSocket.OPEN) {
        frontEndSettingsData(connection, FrontEndCommand.AddOrder, resultString);
        console.log('Add Order!');
    }


}



// updates each time OrderID changes
function updateOnOrderIdChange(){
    console.log("orderID changed");
}

// updates each time OrderID changes
function updateOnAmountChange(){
    console.log("amount changed");
}

// updates each time front size changes
function updateOnFrontSizeChange(){
    console.log("front changed");
    backSizeDisabled.value = false;
    selectedBackSize.value = 0;

    var tempSizes = [0];

    //for loop over frontSizes!
    for (var i = 0; i < frontSizes.value.length; i++) {
        // front size equal 
        if(selectedFrontSize.value === frontSizes.value[i]){
           tempSizes.push(frontSizes.value[i]);
        }
        // front size one smaller
        else if(selectedFrontSize.value -1 === frontSizes.value[i]){
            tempSizes.push(frontSizes.value[i]);
        }
    }

    backSizes.value = tempSizes;
}


// updates each time back size changes
function updateOnBackSizeChange(){
    console.log("back changed");
}



// set OrderID from outside component => BarCodeScanner
function setOrderID(orderId){
    
    if(orderId > 5000000){
        orderID.value = orderId;
    }
    
}



// set OrderID, TotAmount, FrontSize, BackSize from outside component => QRCodeScanner
function setOrderFromQR(orderId, totAmount, frontSize, backSize){
    
    console.log('setOrderFromQR: '+ orderId + ", " + totAmount + ", " + frontSize + ", " + backSize);

    if(orderId > 5000000 && totAmount > 0 ){
        if(frontSize <= 5 && frontSize >= 2){
            if(frontSize === backSize || ((frontSize-1) === backSize && backSize >= 2) || backSize === 0){
                // Valid data
                orderID.value = orderId;
                amount.value = totAmount;
                selectedFrontSize.value = frontSize;
                selectedBackSize.value = backSize;
                
                // ENABLE FIELD
                // if(backSize !== 0){
                //     backSizeEnabled.value = false;
                // }

                // DISABLE FIELDS
                frontSizeDisabled.value = true;
                amountDisabled.value = true;

                orderIDDisabled.value = true;
                backSizeDisabled.value = true;


            }
        }
    }
    
}




// accessible from parent component
defineExpose({
    setOrderID,
    setOrderFromQR
});


</script>


<style>



</style>