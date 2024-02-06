<template>
  <div>
    <h1>This is a test page</h1>
    <h1>Counter: {{ count }}</h1>
    <button @click="increment">Increment</button>
    <button @click="decrement">Decrement</button>
    <l-map
      style="height: 300px"
      ref="map"
      v-model:zoom="zoom"
      :center="[47.41322, -1.219482]"
    >
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
      ></l-tile-layer>
    </l-map>
    <LiveData />
  </div>
</template>

<script>
import store from "@/store";
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer } from "@vue-leaflet/vue-leaflet";
import LiveData from "@/components/liveData.vue";

export default {
  store: store,
  components: {
    LMap,
    LTileLayer,
    LiveData,
  },
  data() {
    return {
      zoom: 13,
    };
  },
  computed: {
    count() {
      return store.state.count;
    },
  },
  methods: {
    increment() {
      store.commit("increment");
    },
    decrement() {
      store.commit("decrement");
    },
  },
};
</script>

<style></style>
