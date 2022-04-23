import Vue from "vue";
import VueRouter from "vue-router";
import Movie from "@/views/Movie";
import MovieDetail from "@/views/MovieDetail";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Movie",
    component: Movie,
  },
  {
    path: "/movie/:id",
    name: "MovieDetail",
    component: MovieDetail,
  },
];

const router = new VueRouter({
  routes,
  base: "/",
  mode: "history",
});

export default router;
