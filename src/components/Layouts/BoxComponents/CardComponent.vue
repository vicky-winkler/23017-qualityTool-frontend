<template>
    <!-- style="border-color: gray; border-width: 3px;" -->
    <div>
        <div class="imgFixed">
            <!-- IMAGE -->
             <div class="h-[180px] flex items-center justify-center">
                <!-- Image Colored -->
                <img v-bind:class="{hoverImage: toggleHover}" :src="getImageUrl()" class="">
             </div>

            <!-- Additional INFO -->
            <!-- Additional Info when scanned -->
             <!-- RFID -->
            <p v-if="imageInfo !== ''" class="text-white text-lg text-center uppercase addInfoToImageGreen">{{ imageInfo }}</p>
        </div>

        <!-- Item Name Shoe SerialNumber -->
        <h1 v-if="itemName !== ''" class="text-white text-lg uppercase text-center">{{ itemName }}</h1>
        <!-- Item Name Shoe SerialNumber -->
        <h1 v-if="ecuDeviceId !== ''" class="text-white text-lg uppercase text-center">{{ ecuDeviceId }}</h1>
    </div>
  
</template>
    
<script setup>
// VUE
import { ref, defineProps, watchEffect } from 'vue';



/* CODE STARTS HERE */
const props = defineProps({
    imageFileName:{
        type: String, 
        default: ''
    },
    imageInfo:{     // RFID 
        type: String,
        default: ''
    },
    itemName:{    // SerialNumber Shoe
        type: String,
        default: ''
    },
    toggleHover: {
        type: Boolean,
        default: false
    },
    ecuDeviceId:{
        type: String,
        default: ''
    },


});

const imageFileName = ref(props.imageFileName);
const imageInfo = ref(props.imageInfo);
const itemName = ref(props.itemName);
const toggleHover = ref(props.toggleHover);
const ecuDeviceId = ref(props.ecuDeviceId);


watchEffect(() => {
    imageFileName.value = props.imageFileName
    imageInfo.value = props.imageInfo
    itemName.value = props.itemName
    toggleHover.value = props.toggleHover
    ecuDeviceId.value = props.ecuDeviceId

});



// add itemName
function addItemName(someName){
    itemName.value = someName;
}

// add ImageInfo name
function addImageInfo(someName){
    imageInfo.value = someName;
}

// set Url for Image
function getImageUrl(){
  return new URL(`../../../assets/imgs/packaging/${props.imageFileName}`, import.meta.url)
}

// reset Component -> remove number Added
function resetComponent(){
    
}


defineExpose({
    addItemName,
    resetComponent,
    addImageInfo,
});


</script>


<style scoped>

img, p {
    width: 100%;
}

.imgFixed{
    position: relative;
    height: 180px;
    overflow: hidden;
}


/* packaging Image Black&White style */
.packagingImageGrayscale{
  filter: grayscale(100%);
}

.addInfoToImageBlack{
    position: absolute;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 6px;
    bottom: 0;
    left: 0;
    box-sizing: border-box;
    color: #fff;
    margin: 0;
}


.addInfoToImageGreen{
    position: absolute;
    background-color: rgba(0, 128, 0, 0.5);
    padding: 6px;
    bottom: 0;
    left: 0;
    box-sizing: border-box;
    color: #fff;
    margin: 0;
}

.hoverImage:hover {
    opacity: 0.5;
}

</style>