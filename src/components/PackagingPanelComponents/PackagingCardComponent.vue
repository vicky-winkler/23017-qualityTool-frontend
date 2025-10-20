<template>
    <!-- style="border-color: gray; border-width: 3px;" -->
    <div>
        <div class="imgFixed">
            <!-- IMAGE -->
             <div class="h-[180px] flex items-center justify-center">
                <!-- Image Colored -->
                <img v-bind:class="{hoverImage: toggleHover}" v-if="numberAdded === numberNeeded && numberAdded !== 0" :src="getImageUrl()" class="">
                <!-- Image Black&White-->
                <img v-else v-bind:class="{hoverImage: toggleHover}" class="packagingImageGrayscale" :src="getImageUrl()">
             </div>

            <!-- Additional INFO -->
            <!-- Additional Info when scanned -->
             <!-- Green -->
            <p v-if="imageInfo !== '' && numberAdded === numberNeeded && numberAdded !== 0" class="text-white text-lg text-center uppercase addInfoToImageGreen">{{ imageInfo }}</p>
            <!-- BlackWhite -->
            <p v-if="imageInfo !== '' " class="text-white text-lg text-center uppercase addInfoToImageBlack">{{ imageInfo }}</p>
        </div>

        <!-- Item Name -->
        <h1 v-if="itemName !== ''" class="text-white text-lg uppercase text-center">{{ itemName }}</h1>
        <!-- Track Nr. 0 / 2 -->
        <h1 v-if="toggleNumberNeeded" class="text-white text-lg uppercase text-center">{{ numberAdded }} / {{ numberNeeded }}</h1>
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
    imageInfo:{
        type: String,
        default: ''
    },
    itemName:{
        type: String,
        default: ''
    },
    numberAdded: {
        type: Number,
        default: 0,
    },
    numberNeeded: {
        type: Number,
        default: 1
    },
    toggleHover: {
        type: Boolean,
        default: false
    },
    toggleNumberNeeded: {
        type: Boolean,
        default: true,
    }

});

const imageFileName = ref(props.imageFileName);
const imageInfo = ref(props.imageInfo);
const itemName = ref(props.itemName);
const numberAdded = ref(props.numberAdded);
const numberNeeded = ref(props.numberNeeded);
const toggleHover = ref(props.toggleHover);
const toggleNumberNeeded = ref(props.toggleNumberNeeded);

watchEffect(() => {
    imageFileName.value = props.imageFileName
    imageInfo.value = props.imageInfo
    itemName.value = props.itemName
    numberAdded.value = props.numberAdded
    numberNeeded.value = props.numberNeeded
    toggleHover.value = props.toggleHover
    toggleNumberNeeded.value = props.toggleNumberNeeded
});


// increases Number Added 
function increaseNumberAdded(){
    numberAdded.value = numberAdded.value + 1;

}

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
    return new URL(`../../assets/imgs/packaging/${props.imageFileName}`, import.meta.url)
}

// reset Component -> remove number Added
function resetComponent(){
    numberAdded.value = 0;

    console.log("Name: " + imageInfo.value + " - numberAdded: " + numberAdded.value);
}


defineExpose({
    increaseNumberAdded,
    numberAdded,
    addItemName,
    toggleNumberNeeded,
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