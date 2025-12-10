<template>
  <t-aside :collapsed="collapsed" :width="collapsed ? '64px' : '232px'"
           style="border-right: 1px solid var(--td-border-level-1-color)">
    <t-menu :collapsed="collapsed" v-model="selectedKeys">
      <t-menu-item :value="PageNameEnum.HOME">
        <template #icon>
          <home-icon/>
        </template>
        概览
      </t-menu-item>
      <t-menu-item :value="PageNameEnum.DATA_BROWSE">
        <template #icon>
          <table2-icon/>
        </template>
        数据浏览
      </t-menu-item>
      <t-menu-item :value="PageNameEnum.BASE_SEARCH">
        <template #icon>
          <search-icon/>
        </template>
        基础搜索
      </t-menu-item>
      <t-menu-item :value="PageNameEnum.DEV_TOOL">
        <template #icon>
          <code-icon />
        </template>
        开发者工具
      </t-menu-item>
      <t-submenu :value="PageNameEnum.DASHBOARD">
        <template #icon>
          <dashboard-icon/>
        </template>
        <template #title>仪表盘</template>
        <t-menu-item :value="PageNameEnum.DASHBOARD_INFO">
          信息
        </t-menu-item>
        <t-menu-item :value="PageNameEnum.DASHBOARD_NODE">
          节点
        </t-menu-item>
        <t-menu-item :value="PageNameEnum.DASHBOARD_SHARD_AND_REPLICA">
          副本与分片
        </t-menu-item>
        <t-menu-item :value="PageNameEnum.DASHBOARD_CAT">
          _cat
        </t-menu-item>
        <t-menu-item :value="PageNameEnum.DASHBOARD_ANALYSIS">
          分析
        </t-menu-item>
      </t-submenu>
      <t-submenu :value="PageNameEnum.SETTING">
        <template #icon>
          <setting-icon/>
        </template>
        <template #title>设置</template>
        <t-menu-item :value="PageNameEnum.SETTING_GLOBAL">
          全局设置
        </t-menu-item>
        <t-menu-item :value="PageNameEnum.SETTING_LINK">
          链接管理
        </t-menu-item>
      </t-submenu>
      <t-submenu :value="PageNameEnum.MORE">
        <template #icon>
          <ellipsis-icon/>
        </template>
        <template #title>更多</template>
        <t-menu-item :value="PageNameEnum.MORE_UPDATE">
          更新日志
        </t-menu-item>
        <t-menu-item :value="PageNameEnum.MORE_PRIVACY">
          隐私协议
        </t-menu-item>
        <t-menu-item :value="PageNameEnum.MORE_ABOUT">
          关于
        </t-menu-item>
      </t-submenu>
      <t-menu-item :value="PageNameEnum.SENIOR_SEARCH">
        <template #icon>
          <filter-icon/>
        </template>
        高级搜索
      </t-menu-item>
      <template #operations>
        <t-button variant="text" shape="square" @click="changeCollapsed()">
          <template #icon>
            <view-list-icon/>
          </template>
        </t-button>
      </template>
    </t-menu>
  </t-aside>
</template>
<script lang="ts" setup>
import PageNameEnum from "@/enumeration/PageNameEnum";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {
  CodeIcon,
  DashboardIcon,
  EllipsisIcon,
  FilterIcon,
  HomeIcon,
  SearchIcon,
  SettingIcon,
  Table2Icon,
  ViewListIcon
} from "tdesign-icons-vue-next";

const route = useRoute();
const router = useRouter();

const collapsed = useLocalStorage(LocalNameEnum.KEY_COLLAPSED, true);
const selectedKeys = ref<PageNameEnum>(PageNameEnum.HOME);

const changeCollapsed = useToggle(collapsed)

watch(selectedKeys, value => router.push(value));
watch(() => route.path, value => selectedKeys.value = value as PageNameEnum);

</script>
<style scoped>

</style>
