<script>
import { Line, createTypedChart } from "vue-chartjs";

export default createTypedChart("line-chart", Line, {
  props: ["chartData"],
  mounted() {
    this.renderChart(this.chartData, {
      responsive: true,
      maintainAspectRatio: false,
    });
  },
});
</script>
