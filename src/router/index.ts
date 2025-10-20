import { createRouter, createWebHashHistory } from "vue-router";

import MainModeLayout from "../components/Layouts/MainModeLayout.vue"
import LoginView from "../views/LoginView.vue"
import MainScreenView from "../views/MainScreenView.vue"
import BoxedView from "../views/BoxedView.vue"
import OrderView from "../views/OrderView.vue"
import PackagingView from "../views/PackagingView.vue"
import StockView from "../views/StockView.vue";


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
        path: "/boxedView",
        name: "boxedView",
        component: BoxedView,
        meta: {
          requiresAuth: true,
          requiresAdmin: true,
        },
      },
      {
        path: "/orderView",
        name: "orderView",
        component: OrderView,
        meta: {
          requiresAuth: true,
          requiresAdmin: false,
        },
      },
      {
        path: "/packagingView",
        name: "packagingView",
        component: PackagingView,
        meta: {
          requiresAuth: true,
          requiresAdmin: false,
        },
      },{
        path: "/stockView",
        name: "stockView",
        component: StockView,
        meta: {
          requiresAuth: true,
          requiresAdmin: true,
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