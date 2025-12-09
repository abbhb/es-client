<template>
  <div class="flex justify-between p-8px items-center base-search-header">
    <div class="flex gap-8px items-center">
      <!-- 索引选择 -->
      <t-select
        v-model="index"
        style="width: 40vw"
        clearable
        filterable
        creatable
        :options="indexOptions"
        placeholder="请选择索引"
      />
      <!-- 搜索 -->
      <t-button theme="success" shape="square" :disabled="index === ''" title="搜索" @click="run()">
        <template #icon>
          <search-icon/>
        </template>
      </t-button>
      <!-- 索引管理 -->
      <t-button
        theme="primary"
        shape="square"
        :disabled="!hasIndexManage"
        title="索引信息"
        @click="openIndex()"
      >
        <template #icon>
          <info-circle-icon/>
        </template>
      </t-button>
      <t-button
        theme="primary"
        variant="outline"
        shape="square"
        :disabled="index === ''"
        title="打印"
        @click="printHandler()"
      >
        <template #icon>
          <print-icon/>
        </template>
      </t-button>
    </div>
    <bs-operator :tab/>
  </div>
</template>
<script lang="ts" setup>
import BsOperator from "@/page/base-search/layout/BaseSearchHeader/operator/BsOperator.vue";
import {useIndexStore} from "@/store";
import {InfoCircleIcon, PrintIcon, SearchIcon} from "tdesign-icons-vue-next";
import {useUmami} from "@/plugins/umami";
import {BaseSearchInstanceResult} from "@/hooks";
import MessageUtil from "@/utils/model/MessageUtil";
import {decodeIndexType} from "$/elasticsearch-client/utils";
import {useIndexManageEvent} from "@/global/BeanFactory";
import {showDataExportDrawer} from "@/components/DataExport";
import {parseJsonWithBigIntSupport} from "$/util";

const props = defineProps({
  tab: {
    type: Object as PropType<BaseSearchInstanceResult>,
    required: true
  }
});

const {index, run, total, buildData} = props.tab;

const indexOptions = computed(() => useIndexStore().indexOptions);
const hasIndexManage = computed(() => {
  const {mappingMap} = useIndexStore();
  return mappingMap.has(index.value);
});

function printHandler() {
  useUmami.track("func_base_search", "打印");
  // 选择了索引
  if (!index.value) {
    MessageUtil.error("请选择索引");
    return;
  }
  // 有记录
  if (total.value === 0) {
    MessageUtil.warning("数据为空");
    return;
  }
  const {index: idx} = decodeIndexType(index.value);
  // 显示导出对话框
  showDataExportDrawer({
    index: idx,
    name: idx,
    search: parseJsonWithBigIntSupport(buildData()),
  });
}

function openIndex() {
  useUmami.track("func_base_search", "索引管理");
  if (useIndexStore().mappingMap.has(index.value)) {
    const {index: idx} = decodeIndexType(index.value);
    useIndexManageEvent.emit(idx);
  }
}
</script>
<style scoped lang="less">
.base-search-header {
  border-bottom: 1px solid var(--td-border-level-2-color);
}
</style>
