<template>
  <div class="container">
    <div>
      <p>Choix des dates</p>
      <input type="date" v-model="startDate" :max="maxDate" :min="minDate" />
      <input type="date" v-model="endDate" :max="maxDate" :min="minDate" />

      <p>Choix de l'interval</p>
      <input type="number" v-model="integerValue" min="0" />

      <select v-model="timeFormat">
        <option value="s">Seconds</option>
        <option value="m">Minutes</option>
        <option value="h">Hours</option>
        <option value="D">Days</option>
        <option value="M">Months</option>
        <option value="Y">Years</option>
      </select>
    </div>
    <div>
      <ArchiveData />
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: space-around;
  flex-direction: column;
}
</style>

<script>
import store from "@/store";
import ArchiveData from "@/components/ArchiveData.vue";
export default {
  store: store,
  components: {
    ArchiveData,
  },
  created() {
    const today = new Date();
    const formattedToday = today.toISOString().split("T")[0];
    store.commit("setStartDate", formattedToday);
  },
  computed: {
    startDate: {
      get() {
        return store.state.startDate;
      },
      set(value) {
        store.commit("setStartDate", value);
      },
    },
    endDate: {
      get() {
        return store.state.endDate;
      },
      set(value) {
        store.commit("setEndDate", value);
      },
    },
    integerValue: {
      get() {
        return store.state.integerValue;
      },
      set(value) {
        store.commit("setIntegerValue", value);
      },
    },
    timeFormat: {
      get() {
        return store.state.timeFormat;
      },
      set(value) {
        store.commit("setTimeFormat", value);
      },
    },
    minDate() {
      const today = new Date();
      const oneYearAgo = new Date(
        today.getFullYear() - 1,
        today.getMonth(),
        today.getDate()
      );
      return oneYearAgo.toISOString().split("T")[0];
    },
    maxDate() {
      const today = new Date();
      return today.toISOString().split("T")[0];
    },
  },
  methods: {
    validateSelection() {
      console.log("selection validated");
    },
  },
};
</script>
