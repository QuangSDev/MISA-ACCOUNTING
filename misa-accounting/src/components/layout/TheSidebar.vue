<template>
  <div class="sidebar">
    <div class="sidebar__header">
      <div class="sidebar__header-logo-container">
        <div class="sidebar__header-menu-icon"></div>
        <div class="sidebar__header-logo">
          <img
            src="https://actappg2.misacdn.net/img/Logo_Module_TiengViet_White.66947422.svg"
          />
        </div>
      </div>
      <button class="sidebar__header-add-btn">Thêm nhanh</button>
    </div>
    <div class="sidebar__menu">
      <router-link v-for="item in menuList" :to="item.url" :key="item.text">
        <div
          class="sidebar__menu-items"
          :class="
            router.path === item.url ? 'sidebar__menu-items--selected' : ''
          "
        >
          <div class="sidebar__menu-icon" :class="item.icon"></div>
          <span>{{ item.text }}</span>
        </div>
      </router-link>
    </div>
    <!-- <div class="sidebar__footer">
      <div class="sidebar__menu-icon sidebar__chevron-left-icon"></div>
      <span>Thu gọn</span>
    </div> -->
  </div>
</template>
<script>
import { useRoute } from "vue-router";

export default {
  name: "TheSidebar",
  setup() {
    const menuList = [
      {
        icon: "sidebar__overview-icon",
        text: "Tổng quan",
        url: "/overview",
      },
      {
        icon: "sidebar__money-icon",
        text: "Tiền mặt",
        url: "/employee",
      },
      {
        icon: "sidebar__deposit-icon",
        text: "Tiền gửi",
        url: "/deposit",
      },
      {
        icon: "sidebar__shopping-icon",
        text: "Mua hàng",
        url: "/shopping",
      },
      {
        icon: "sidebar__sell-icon",
        text: "Bán hàng",
        url: "sale",
      },
      {
        icon: "sidebar__storage-icon",
        text: "Kho",
        url: "storage",
      },
      {
        icon: "sidebar__tool-icon",
        text: "Công cụ dụng cụ",
        url: "tool",
      },
      {
        icon: "sidebar__fixed-assets-icon",
        text: "Tài sản cố định",
        url: "fixed-assets",
      },
      {
        icon: "sidebar__salary-icon",
        text: "Tiền lương",
        url: "salary",
      },
      {
        icon: "sidebar__tax-icon",
        text: "Thuế",
        url: "/tax",
      },
      {
        icon: "sidebar__price-icon",
        text: "Giá thành",
        url: "/price",
      },
      {
        icon: "sidebar__composition-icon",
        text: "Tổng hợp",
        url: "/composition",
      },
      {
        icon: "sidebar__budget-icon",
        text: "Ngân sách",
        url: "/budget",
      },
      {
        icon: "sidebar__report-icon",
        text: "Báo cáo",
        url: "/report",
      },
      {
        icon: "sidebar__finacial-analysis-icon",
        text: "Phân tích tài chính",
        url: "/finance",
      },
    ];

    const router = useRoute();

    return { menuList, router };
  },
};
</script>
