<template>
  <Line :data="data" :options="options" />
</template>

<script>
import { Line } from "vue-chartjs";
import * as chartConfig from "@/components/ArchiveData.vue";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default {
  name: "LineChart",
  components: { Line },
  data() {
    return chartConfig;
  },
};
</script>
