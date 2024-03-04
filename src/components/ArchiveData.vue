<template>
  <div>
    <div>
      <input type="text" v-model="search" @keyup.enter="addStation" />
      <button @click="addStation">Add station</button>
      <select v-model="selectedStation" @change="changeSelectedStation">
        <option
          v-for="station in stations"
          :key="station.name"
          :value="station.address"
        >
          {{ station.address }}
        </option>
      </select>
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    </div>

    <div>
      <p>Station name: {{ name }}</p>
      <p>Location: {{ location.coords }}</p>
      <p>Status: {{ status ? "On" : "Off" }}</p>
      <p>Date: {{ location.date }}</p>

      <div>
        <input type="checkbox" id="pressure" v-model="showPressure" />
        <label for="pressure">Pressure</label>
      </div>
      <div>
        <input type="checkbox" id="temperature" v-model="showTemperature" />
        <label for="temperature">Temperature</label>
      </div>
      <div>
        <input type="checkbox" id="date" v-model="showDate" />
        <label for="date">Date</label>
      </div>
      <div>
        <input type="checkbox" id="rain" v-model="showRain" />
        <label for="rain">Rain</label>
      </div>
      <div>
        <input type="checkbox" id="humidity" v-model="showHumidity" />
        <label for="humidity">Humidity</label>
      </div>
      <div>
        <input type="checkbox" id="light" v-model="showLight" />
        <label for="light">Light</label>
      </div>
      <div>
        <input type="checkbox" id="wind" v-model="showWind" />
        <label for="wind">Wind</label>
      </div>

      <p v-if="showPressure">Pression: {{ measurements.pressure }}</p>
      <p v-if="showTemperature">Temperature: {{ measurements.temperature }}</p>
      <p v-if="showDate">Date: {{ measurements.date }}</p>
      <p v-if="showRain">Rain: {{ measurements.rain }}</p>
      <p v-if="showHumidity">Humidity: {{ measurements.humidity }}</p>
      <p v-if="showLight">Light: {{ measurements.light }}</p>
      <p v-if="showWind">
        Wind speed: {{ measurements.wind ? measurements.wind.speed : "" }}
      </p>
      <p v-if="showWind">
        Wind direction:
        {{ measurements.wind ? measurements.wind.direction : "" }}
      </p>

      <div v-if="clicked">
        <LineChart />
      </div>
    </div>
  </div>
</template>

<style scoped>
.error {
  color: red;
}
</style>

<script>
import store from "@/store";
import LineChart from "@/components/ChartComponent.vue";

export const data = {
  labels: location.date,
  datasets: [
    {
      label: "Data One",
      backgroundColor: "#f87979",
      data: [40, 39, 10, 40, 39, 80, 40],
    },
    {
      label: "Data 2",
      backgroundColor: "#ffffff",
      data: [12, 12, 12, 12, 12, 12, 12],
    },
  ],
};

export const options = {
  responsive: true,
  maintainAspectRatio: false,
};

export default {
  components: { LineChart },
  store: store,
  data() {
    return {
      search: "",
      clicked: false,
      errorMessage: null,
      name: null,
      location: { date: null, coords: null },
      status: null,
      measurements: [],
      showPressure: false,
      showTemperature: false,
      showDate: false,
      showRain: false,
      showHumidity: false,
      showLight: false,
      showWind: false,
      chartData: {
        labels: [],
        datasets: [],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
  computed: {
    selectionValidated() {
      if (store.state.startDate != "" && store.state.endDate != "") return true;
      else return false;
    },
    server() {
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
    async addStation() {
      this.fetchData(
        this.server,
        store.state.startDate,
        store.state.endDate,
        store.state.integerValue + store.state.timeFormat
      );
      this.clicked = true;
    },
    changeSelectedStation() {
      this.fetchData(this.selectedStation);
      this.$store.commit("setSelectedStation", this.selectedStation);
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
    async fetchData(server, from, to, interval) {
      if (store.state.startDate != "") {
        await this.fetchArchiveData(server, from, to, interval);
      }
    },
    async fetchArchiveData(
      server
      /*from , to = "", interval = "", filter = ""*/
    ) {
      try {
        // let lien = "http://" + server + ":80/archive?from=" + from;
        let lien = server + "Archive.json";
        // if (to != "") {
        //   lien += "&to=" + to;
        // }
        // if (interval != "") {
        //   lien += "&interval=" + interval;
        // }
        // if (filter != "") {
        //   lien += "&filter=" + filter;
        // }
        const response = await fetch(lien);
        const data = await response.json();
        console.log("data", data);
        this.name = data.name;
        this.location = data.location;
        this.status = data.status;
        this.measurements = data.measurements;
        this.checkStation(data);
        this.errorMessage = null;
      } catch (error) {
        console.error("Error fetching live data:", error);
        this.errorMessage = "Station not found";
      }
    },
  },
};
</script>
