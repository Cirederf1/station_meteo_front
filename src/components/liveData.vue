<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>Index</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(value, index) in liveData" :key="index">
          <td>{{ index }}</td>
          <td>{{ value }}</td>
        </tr>
      </tbody>
    </table>
    <p>{{ name }}</p>
    <p>{{ location.coords }}</p>
    <p>{{ measurements.wind.speed }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      liveData: null,
      name: null,
      location: { date: null, coords: null },
      status: null,
      measurements: {
        rain: null,
        temperature: null,
        light: null,
        humidity: null,
        pressure: null,
        wind: { speed: null, direction: null },
      },
    };
  },
  mounted() {
    this.fetchLiveData();
  },
  methods: {
    async fetchLiveData() {
      try {
        const response = await fetch("http://172.31.58.203:3000/live");
        // const response = await fetch("live.json");

        console.log("response", response);
        const data = await response.json();
        this.liveData = data;
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

<style></style>
