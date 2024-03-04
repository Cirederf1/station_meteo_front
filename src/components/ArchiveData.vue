<template>
  <div>
    <div>
      <p>Choix de la station</p>
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
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    </div>

    <div>
      <p>Station name: {{ name }}</p>
      <p>Status: {{ status ? "On" : "Off" }}</p>

      <table>
        Filtre:
        <button @click="updateGraph">Update Graph</button>
        <tr>
          <th>
            <input
              type="radio"
              id="pressure"
              value="Pressure"
              v-model="selectedOption"
            />
            <label for="pressure">Pressure</label>
          </th>
          <th>
            <input
              type="radio"
              id="temperature"
              value="Temperature"
              v-model="selectedOption"
            />
            <label for="temperature">Temperature</label>
          </th>
          <th>
            <input
              type="radio"
              id="rain"
              value="Rain"
              v-model="selectedOption"
            />
            <label for="rain">Rain</label>
          </th>
        </tr>
        <tr>
          <th>
            <input
              type="radio"
              id="humidity"
              value="Humidity"
              v-model="selectedOption"
            />
            <label for="humidity">Humidity</label>
          </th>
          <th>
            <input
              type="radio"
              id="light"
              value="Light"
              v-model="selectedOption"
            />
            <label for="light">Light</label>
          </th>
          <th>
            <input
              type="radio"
              id="wind"
              value="Wind"
              v-model="selectedOption"
            />
            <label for="wind">Wind</label>
          </th>
        </tr>
      </table>

      <div>
        <LineChart :data="chartData" :options="chartOptions" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.error {
  color: red;
  font-weight: bold;
  margin: 10px 0;
}

th {
  padding-top: 10px;
  text-align: left;
}

th input[type="checkbox"] {
  margin-right: 5px;
}
</style>

<script>
import store from "@/store";
import LineChart from "@/components/ChartComponent.vue";

export default {
  components: { LineChart },
  store: store,
  data() {
    return {
      search: "",
      errorMessage: null,
      name: null,
      location: { date: null, coords: null },
      status: null,
      measurements: [],
      selectedOption: "",
      chartData: {
        labels: [],
        datasets: [],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
          },
          title: {
            display: true,
          },
          tooltip: {
            enabled: true,
          },
          backgroundColor: "#ffffff",
        },
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
    integerValue: {
      get() {
        return store.state.integerValue;
      },
    },
    timeFormat: {
      get() {
        return store.state.timeFormat;
      },
    },
  },
  mounted() {
    if (this.selectedStation) {
      this.changeSelectedStation();
    }
  },
  watch: {
    integerValue() {
      if (this.selectedStation)
        this.fetchData(
          this.selectedStation,
          store.state.startDate,
          store.state.endDate,
          store.state.integerValue + store.state.timeFormat
        );
    },
    timeFormat() {
      if (this.selectedStation)
        this.fetchData(
          this.selectedStation,
          store.state.startDate,
          store.state.endDate,
          store.state.integerValue + store.state.timeFormat
        );
    },
    watch: {
      selectedStation() {
        this.changeSelectedStation();
      },
    },
  },
  methods: {
    async addStation() {
      if (!this.stations.find((station) => station.address === this.server)) {
        this.fetchData(
          this.server,
          store.state.startDate,
          store.state.endDate,
          store.state.integerValue + store.state.timeFormat
        );
      }
    },
    changeSelectedStation() {
      console.log(this.selectedStation);
      this.$store.commit("setSelectedStation", this.selectedStation);
      this.fetchData(
        this.selectedStation,
        store.state.startDate,
        store.state.endDate,
        store.state.integerValue + store.state.timeFormat
      );
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
    async fetchArchiveData(server, from, to = "", interval = "", filter = "") {
      try {
        let lien = "http://" + server + ":80/archive?from=" + from;
        // let lien = server + "Archive.json";
        if (to != "") {
          lien += "&to=" + to;
        }
        if (interval != "") {
          lien += "&interval=" + interval;
        }
        if (filter != "") {
          lien += "&filter=" + filter;
        }
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
    updateGraph() {
      this.chartData = {
        labels: this.measurements.date,
        datasets: [],
      };

      if (this.selectedOption == "Pressure") {
        this.chartData.datasets.push({
          label: "Pressure (hPa)",
          data: this.measurements.pressure,
        });
      }
      if (this.selectedOption == "Temperature") {
        this.chartData.datasets.push({
          label: "Temperature (°C)",
          data: this.measurements.temperature,
        });
      }
      if (this.selectedOption == "Rain") {
        this.chartData.datasets.push({
          label: "Rain (mm / m2 / h)",
          data: this.measurements.rain,
        });
      }
      if (this.selectedOption == "Humidity") {
        this.chartData.datasets.push({
          label: "Humidity (%)",
          data: this.measurements.humidity,
        });
      }
      if (this.selectedOption == "Light") {
        this.chartData.datasets.push({
          label: "Light (lux)",
          data: this.measurements.light,
        });
      }
      if (this.selectedOption == "Wind") {
        this.chartData.datasets.push({
          label: "Wind Speed (m/s)",
          data: this.measurements.wind.speed,
        });
      }
    },
  },
};
</script>
