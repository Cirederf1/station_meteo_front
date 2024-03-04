import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/live",
  },
  {
    path: "/live",
    name: "live",
    component: () =>
      import(/* webpackChunkName: "live" */ "../views/LiveView.vue"),
  },
  {
    path: "/archive",
    name: "archive",
    component: () =>
      import(/* webpackChunkName: "archive" */ "../views/ArchiveView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
