<template>
  <div class="container">
    <div>
      <LiveData />
    </div>
    <l-map
      v-if="coords"
      style="height: 400px; width: 50%"
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

<style scoped>
.container {
  display: flex;
  justify-content: space-around;
}
</style>

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
    selectedStation() {
      return this.$store.state.selectedStation;
    },
  },
  watch: {
    selectedStation() {
      this.zoom = 13;
    },
  },
  methods: {},
};
</script>

<style></style>
