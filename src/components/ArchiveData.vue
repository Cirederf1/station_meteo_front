<template>
  <div>
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
      <p v-if="showWind">Wind speed: {{ measurements.wind.speed }}</p>
      <p v-if="showWind">Wind direction: {{ measurements.wind.direction }}</p>
    </div>
  </div>
</template>

<script>
import store from "@/store";
export default {
  store: store,
  data() {
    return {
      search: "172.31.58.203",
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
      showPressure: false,
      showTemperature: false,
      showDate: false,
      showRain: false,
      showHumidity: false,
      showLight: false,
      showWind: false,
      stations: [],
      selectedStation: null,
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
  },
  methods: {
    async addStation() {
      this.fetchData(
        this.server,
        store.state.startDate,
        store.state.endDate,
        store.state.integerValue + store.state.timeFormat
      );
    },
    async fetchData(server, from, to, interval) {
      if (store.state.startDate != "") {
        await this.fetchArchiveData(server, from, to, interval);
      }
    },
    async fetchArchiveData(
      server,
      from,
      to = "null",
      interval /*filter = ""*/
    ) {
      try {
        const response = await fetch(
          "http://" +
            server +
            ":80/archive?from=" +
            from +
            "&to=" +
            to +
            "&interval=" +
            interval //+
          // "&filter=" +
          // filter
        );
        const data = await response.json();
        console.log("data", data);
        this.name = data.name;
        this.location = data.location;
        this.status = data.status;
        this.measurements = data.measurements;
      } catch (error) {
        console.error("Error fetching live data:", error);
      }
    },
  },
};
</script>
