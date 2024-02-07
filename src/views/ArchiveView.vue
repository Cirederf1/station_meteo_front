<template>
  <div>
    <h1>Choix des dates</h1>
    <input type="date" v-model="startDate" :max="maxDate" :min="minDate" />
    <input type="date" v-model="endDate" :max="maxDate" :min="minDate" />

    <h1>Choix de l'interval</h1>
    <input type="number" v-model="integerValue" min="0" />

    <select v-model="timeFormat">
      <option value="hour">Hours</option>
      <option value="day">Days</option>
      <option value="week">Weeks</option>
      <option value="month">Months</option>
      <option value="year">Years</option>
    </select>

    <LiveData v-if="selectionValidated" />
  </div>
</template>

<script>
import store from "@/store";
import LiveData from "@/components/liveData.vue";
export default {
  store: store,
  components: {
    LiveData,
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
    selectionValidated() {
      if (store.state.startDate != "" && store.state.endDate != "") return true;
      else return false;
    },
  },
  methods: {
    validateSelection() {
      console.log("selection validated");
    },
  },
};
</script>
