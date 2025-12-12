<template>
  <div class="base-spin material-card">
    <div v-for="tab in tabs" :key="tab.id" class="base-search">
      <!-- 主要显示区域 -->
      <div class="base-search-main full-screen">
        <!-- 顶部菜单栏 -->
        <base-search-header :tab />
        <div class="base-search-container">
          <!-- 核心查询区 -->
          <base-search-display :tab />
          <!-- 数据显示区 -->
          <base-search-view :tab />
        </div>
        <t-back-top container=".base-search-container" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// 内部组件
import BaseSearchHeader from "./layout/BaseSearchHeader/BaseSearchHeader.vue";
import BaseSearchDisplay from "./layout/BaseSearchDisplay/BaseSearchDisplay.vue";
import BaseSearchView from "./layout/BaseSearchView/BaseSearchView.vue";
import { useBaseSearchStore } from "@/store/components/BaseSearchStore";

const { tabs } = useBaseSearchStore();
</script>

<style lang="less">
@import url(index.less);
</style>
