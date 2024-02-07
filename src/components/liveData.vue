<template>
  <div>
    <p>Station name: {{ name }}</p>
    <p>Location: {{ location.coords }}</p>
    <p>Status: {{ status ? "On" : "Off" }}</p>
    <p>Pression: {{ measurements.pressure }}</p>
    <p>Temperature: {{ measurements.temperature }}</p>
    <p>Date: {{ measurements.date }}</p>
    <p>Rain: {{ measurements.rain }}</p>
    <p v-if="measurements.humidity">Humidity: {{ measurements.humidity }}</p>
    <p v-if="measurements.light">Light: {{ measurements.light }}</p>
    <p v-if="measurements.wind">Wind speed: {{ measurements.wind.speed }}</p>
    <p v-if="measurements.wind">
      Wind direction: {{ measurements.wind.direction }}
    </p>
    <input type="checkbox" v-model="ptdrData" @change="fetchData" />
    <label for="ptdrData">PTDR Only</label>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: null,
      location: { date: null, coords: null },
      status: null,
      measurements: {
        pressure: null,
        temperature: null,
        date: null,
        rain: null,
        light: null,
        humidity: null,
        wind: { speed: null, direction: null },
      },
      ptdrData: false,
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      if (this.ptdrData) {
        await this.fetchLiveDataPTDR();
      } else {
        await this.fetchLiveData();
      }
    },
    async fetchLiveData() {
      try {
        // const response = await fetch("http://172.31.58.203:3000/live");

        // const response = await fetch("http://172.31.43.125:3001/live");
        const response = await fetch("live.json");

        console.log("response", response);
        const data = await response.json();
        this.name = data.name;
        this.location = data.location;
        this.status = data.status;
        this.measurements = data.measurements;
        this.$store.commit("setCoords", data.location.coords);
      } catch (error) {
        console.error("Error fetching live data:", error);
      }
    },
    async fetchLiveDataPTDR() {
      try {
        // const response = await fetch("http://172.31.58.203:3000/live?ptdr");
        const response = await fetch("livePTDR.json");

        console.log("response", response);
        const data = await response.json();
        this.name = data.name;
        this.location = data.location;
        this.status = data.status;
        this.measurements = data.measurements;
        this.$store.commit("setCoords", data.location.coords);
      } catch (error) {
        console.error("Error fetching PTDR live data:", error);
      }
    },
  },
};
</script>

<style></style>
