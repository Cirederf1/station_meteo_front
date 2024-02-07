<template>
  <div>
    <!-- <h1>This is a test page</h1>
    <button @click="increment">Increment</button>
    <button @click="decrement">Decrement</button> -->
    <h1>Counter: {{ count }}</h1>
    <LiveData />

    <l-map
      v-if="coords"
      style="height: 300px"
      ref="map"
      v-model:zoom="zoom"
      :center="coords"
    >
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
      ></l-tile-layer>

      <l-marker v-if="coords" :lat-lng="coords"></l-marker>
    </l-map>
  </div>
</template>

<script>
import store from "@/store";
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
import LiveData from "@/components/liveData.vue";

export default {
  store: store,
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LiveData,
  },
  data() {
    return {
      zoom: 13,
    };
  },
  computed: {
    coords() {
      return store.state.coords;
    },
  },
  methods: {},
};
</script>

<style></style>
