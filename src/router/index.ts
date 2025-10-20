import { createRouter, createWebHashHistory } from "vue-router";

import MainModeLayout from "../components/Layouts/MainModeLayout.vue"
import LoginView from "../views/LoginView.vue"
import MainScreenView from "../views/MainScreenView.vue"
import BoxView from "../views/BoxView.vue";
import BootView from "../views/BootView.vue";
import MeasurementMultiView from "../views/MeasurementMultiView.vue";
import MeasurementSingleView from "../views/MeasurementSingleView.vue";


const routes = [
  {
    path: "/",
    component: MainModeLayout,
    children: [
      {
        path: "/",
        name: "loginView",
        component: LoginView,
        meta: {
          requiresAuth: false,
          requiresAdmin: false,
        },
      },
      {
        path: "/mainScreenView",
        name: "mainScreenView",
        component: MainScreenView,
        meta: {
          requiresAuth: true,
          requiresAdmin: false,
        },
      },
      {
        path: "/boxView",
        name: "boxView",
        component: BoxView,
        meta: {
          requiresAuth: true,
          requiresAdmin: false,
        },
      },
      {
        path: "/bootView",
        name: "bootView",
        component: BootView,
        meta: {
          requiresAuth: true,
          requiresAdmin: false,
        },
      },
      {
        path: "/measurementSingleView",
        name: "measurementSingleView",
        component: MeasurementSingleView,
        meta: {
          requiresAuth: true,
          requiresAdmin: false,
        },
      },{
        path: "/measurementMultiView",
        name: "measurementMultiView",
        component: MeasurementMultiView,
        meta: {
          requiresAuth: true,
          requiresAdmin: false,
        },
      },
      
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      if (to.meta.requiresAdmin) {
        const adminToken = localStorage.getItem("adminToken");
        if (adminToken) {
          next();
        } else {
          next("/");
        }
      } else {
        next();
      }
    } else {
      next("/");
    }
  } else {
    next();
  }
});

export default router;