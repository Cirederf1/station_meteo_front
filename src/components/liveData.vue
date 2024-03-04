<template>
  <div>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    <input type="text" v-model="search" @keyup.enter="addStation" />
    <button @click="addStation">Add station</button>
    <select v-model="selectedStation" @change="changeSelectedStation">
      <option
        v-for="station in stations"
        :key="station.name"
        :value="station.address"
      >
        {{ station.name }}
      </option>
    </select>
  </div>

  <div>
    <input type="checkbox" v-model="ptdrData" @change="handleChange" />
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
    <p v-if="measurements.wind">Wind speed: {{ measurements.wind.speed }}</p>
    <p v-if="measurements.wind">
      Wind direction: {{ measurements.wind.direction }}
    </p>
  </div>
</template>

<style scoped>
.error {
  color: red;
}
</style>

<script>
import store from "@/store";

export default {
  store: store,
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
      errorMessage: null,
    };
  },
  computed: {
    server() {
      // return "http://" + this.search + ":3000";
      return this.search;
    },
    stations() {
      return this.$store.state.stations;
    },
    selectedStation: {
      get() {
        return this.$store.state.selectedStation;
      },
      set(value) {
        this.$store.commit("setSelectedStation", value);
      },
    },
  },
  methods: {
    addStation() {
      if (!this.stations.find((station) => station.address === this.server)) {
        this.fetchData(this.server);
      }
    },
    checkStation(data) {
      let stationsList;
      if (this.$store.state.stations) {
        stationsList = this.stations;
      } else {
        stationsList = [];
      }
      if (!stationsList.find((station) => station.name === this.name)) {
        stationsList.push({
          id: stationsList.length + 1,
          name: this.name,
          address: this.server,
          coords: data.location.coords,
        });
        this.$store.commit("setStations", stationsList);
        this.$store.commit("setSelectedStation", this.server);
      }
    },
    changeSelectedStation() {
      this.fetchData(this.selectedStation);
      this.$store.commit("setSelectedStation", this.selectedStation);
    },
    handleChange() {
      if (this.selectedStation) {
        this.fetchData(this.selectedStation);
      }
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
        const response = await fetch(server + ".json");
        // const response = await fetch(server + "/live");
        const data = await response.json();

        this.name = data.name;
        this.location = data.location;
        this.status = data.status;
        this.measurements = data.measurements;
        this.$store.commit("setCoords", data.location.coords);
        this.checkStation(data);
        this.errorMessage = null;
      } catch (error) {
        console.error("Error fetching live data:", error);
        this.errorMessage = "Station not found";
      }
    },
    async fetchLiveDataPTDR(server) {
      try {
        const response = await fetch(server + "PTDR.json");
        // const response = await fetch(server + "/live?ptdr");

        const data = await response.json();
        this.name = data.name;
        this.location = data.location;
        this.status = data.status;
        this.measurements = data.measurements;
        this.$store.commit("setCoords", data.location.coords);
        this.checkStation(data);
        this.errorMessage = null;
      } catch (error) {
        console.error("Error fetching PTDR live data:", error);
        this.errorMessage = "Station not found";
      }
    },
  },
};
</script>

<style></style>
