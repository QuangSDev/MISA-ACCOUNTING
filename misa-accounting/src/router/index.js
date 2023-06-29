import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/overview",
    component: () => import("../views/OverviewView.vue"),
  },
  {
    path: "/employee",
    component: () => import("../views/EmployeeView.vue"),
  },
  {
    name: "deposit",
    path: "/deposit",
    component: () => import("../views/DepositView.vue"),
  },
  {
    name: "shopping",
    path: "/shopping",
    component: () => import("../views/ShoppingView.vue"),
  },
  {
    name: "sale",
    path: "/sale",
    component: () => import("../views/SaleView.vue"),
  },
  {
    name: "storage",
    path: "/storage",
    component: () => import("../views/StorageView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_path),
  routes,
});

export default router;
