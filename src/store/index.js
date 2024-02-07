import { createStore } from "vuex";

export default createStore({
  state: {
    coords: null,
    startDate: "",
    endDate: "",
    integerValue: 1,
    timeFormat: "h",
  },
  getters: {},
  mutations: {
    setCoords: (state, coords) => (state.coords = coords),
    setStartDate(state, startDate) {
      state.startDate = startDate;
    },
    setEndDate(state, endDate) {
      state.endDate = endDate;
    },
    setIntegerValue(state, integerValue) {
      state.integerValue = integerValue;
    },
    setTimeFormat(state, timeFormat) {
      state.timeFormat = timeFormat;
    },
  },
  actions: {},
  modules: {},
});
