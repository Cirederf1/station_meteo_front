<template>
  <div>
    <input type="text" v-model="search" @keyup.enter="addStation" />
    <button @click="addStation">Add station</button>
    <select v-model="selectedStation">
      <option v-for="station in stations" :key="station.id" :value="station">
        {{ station.name }}
      </option>
    </select>
  </div>

  <div>
    <input type="checkbox" v-model="ptdrData" @change="click" />
    <label for="ptdrData">PTDR Only</label>
    <p>Station name: {{ name }}</p>
    <p>Location: {{ location.coords }}</p>
    <p>Status: {{ status ? "On" : "Off" }}</p>
    <p>Pression: {{ measurements.pressure }} hPa</p>
    <p>Temperature: {{ measurements.temperature }}</p>
    <p>Date: {{ measurements.date }}</p>
    <p>Rain: {{ measurements.rain }}</p>
    <p v-if="measurements.humidity">Humidity: {{ measurements.humidity }}</p>
    <p v-if="measurements.light">Light: {{ measurements.light }} lux</p>
    <p v-if="measurements.wind.speed">
      Wind speed: {{ measurements.wind.speed }}
    </p>
    <p v-if="measurements.wind.direction">
      Wind direction: {{ measurements.wind.direction }}
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: "",
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
      stations: [],
      selectedStation: null,
    };
  },
  computed: {
    server() {
      return "http://" + this.search + ":80";
    },
  },
  methods: {
    checkStation(data) {
      if (!this.stations.find((station) => station.name === this.name)) {
        this.stations.push({
          id: this.stations.length + 1,
          name: this.name,
          coords: data.location.coords,
        });
      }
    },
    addStation() {
      this.fetchData(this.server);
    },
    async fetchData(server) {
      if (this.ptdrData) {
        await this.fetchLiveDataPTDR(server);
      } else {
        await this.fetchLiveData(server);
      }
    },
    async fetchLiveData(server) {
      try {
        // const response = await fetch("http://172.31.58.203:3000/live");

        // const response = await fetch("http://172.31.43.125:3001/live");
        const response = await fetch(server + "/live");
        const data = await response.json();
        // console.log("data", data);
        this.name = data.name;
        this.location = data.location;
        this.status = data.status;
        this.measurements = data.measurements;
        this.$store.commit("setCoords", data.location.coords);
        this.checkStation(data);
      } catch (error) {
        console.error("Error fetching live data:", error);
      }
    },
    async fetchLiveDataPTDR(server) {
      try {
        // const response = await fetch("http://172.31.58.203:3000/live?ptdr");
        const response = await fetch(server + "/live?ptdr");

        const data = await response.json();
        // console.log("data", data);
        this.name = data.name;
        this.location = data.location;
        this.status = data.status;
        this.measurements = data.measurements;
        this.$store.commit("setCoords", data.location.coords);
        this.stations.push({ id: this.stations.length + 1, name: this.name });
      } catch (error) {
        console.error("Error fetching PTDR live data:", error);
      }
    },
  },
};
</script>

<style></style>
