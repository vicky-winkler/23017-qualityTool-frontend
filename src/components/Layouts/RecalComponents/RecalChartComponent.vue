<template>
    <div class="pl-6 pr-6 pb-6 pt-2  border rounded border-b dark:bg-zinc-800 dark:border-gray-800"
        style="height: 100%;">
        <div id="chart">
            <apexchart height="500px" type="line" ref="chart" :options="chartOptions" :series="series">
            </apexchart>
        </div>
    </div>
</template>

<script setup>
// VUE
import { ref, onMounted, onUnmounted } from 'vue';

// Messaging and Commands
import { Buffer } from 'buffer';



/* CODE STARTS HERE */
window.Buffer = window.Buffer || Buffer;

onMounted(() => {
   chartUpdateReady.value = true;
})


onUnmounted(() => {

})



// ====================== CONFIG ======================
const MAX_X = 4096;
const MAX_Y = 6500;


// ====================== CHART SETUP ======================
const chart = ref(null);
const chartUpdateReady = ref(true);
const numSeries = 7;

// Each line’s data array
let chartDataSet = Array.from({ length: numSeries }, () => []);


// Set Data 1024 values per line
function setChartValues(data){
  // Payload example: [ [4096], [4096], ..., [4096] ] (7 arrays total)
  if (!Array.isArray(data) || data.length !== numSeries) {
    console.error("Invalid payload format");
    return;
  }

  chartDataSet = /// TODO

  updateChart();
}



function resetChart() {
  chartDataSet = Array.from({ length: numSeries }, () => []);
  updateChart();
}



// accessible from parent component
defineExpose({
    resetChart,
    setChartValues,
});





// ====================== CHART UPDATE ======================
function updateChart() {
  if (!chart.value || !chartUpdateReady.value) return;

  chartUpdateReady.value = false;
  chart.value
    .updateSeries(
      chartDataSet.map((data, i) => ({
        name: `Sensor ${i + 1}`,
        data,
      }))
    )
    .then(() => {
      chartUpdateReady.value = true;
    });
}


// Initialize empty series
const series = ref(
  Array.from({ length: numSeries }, (_, i) => ({
    name: `Sensor ${i + 1}`,
    data: [],
  }))
);


// Base chart options
const chartOptions = ref({
  colors: ["#e61919", "#3cb44b", "#ffe119", "#4363d8", "#f58231", "#00ced1", "#42d4f4"],
  chart: {
    id: "sensorChart",
    type: "line",
    animations: {
      enabled: true,
      easing: "linear",
      speed: 200,
    },
    toolbar: { show: false },
    zoom: { enabled: false },
  },
  dataLabels: { enabled: false },
  stroke: { curve: "straight", width: 2 },
  markers: { size: 0 },
  xaxis: {
    type: "numeric",
    labels: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    min: 0,
    max: MAX_Y,
    title: {
      text: `ADC Counts (0 - ${MAX_Y})`,
      style: { fontSize: "14px" },
    },
    labels: { show: false },
  },
  legend: {
    position: "bottom",
    horizontalAlign: "center",
    fontSize: "14px",
  },
});

</script>