<template>
  <vxe-table
    ref="tableRef"
    :data="records"
    :height="height"
    :column-config="columnConfig"
    :row-config="rowConfig"
    empty-text="什么也没有"
  >
    <vxe-column type="checkbox" width="60"></vxe-column>
    <vxe-column type="expand" width="80" title="详细">
      <template #content="{ row }">
        <div class="expand-wrapper h-300px">
          <MonacoView :value="row['_source']" />
        </div>
      </template>
    </vxe-column>
    <vxe-column
      v-for="column in columns"
      :key="column.title"
      :field="column.field"
      :title="column.title"
      :visible="column.show"
      :width="column.field === '_id' ? 180 : column.width"
      show-overflow="tooltip"
    />
  </vxe-table>
</template>
<script lang="ts" setup>
import { searchResultToTable } from "$/elasticsearch-client/components/SearchResultToTable";
import { columnConfig, rowConfig } from "@/page/data-browse/component/DbContainer/args";
import MonacoView from "@/components/view/MonacoView/index.vue";
import { DataSearchColumnConfig } from "$/elasticsearch-client";

const props = defineProps({
  data: Object as PropType<string>,
  height: { type: Number, default: 500 }
});

// 显示的列
const columns = ref<Array<DataSearchColumnConfig>>([]);
// 数据
const records = ref<Array<Record<string, any>>>([]);
const total = ref(0);

watch(
  () => props.data,
  (value) => {
    columns.value = [];
    records.value = [];
    total.value = 0;
    if (value) {
      const res = searchResultToTable(value);
      columns.value = res.columns;
      records.value = res.records;
      total.value = res.total;
    }
  }
);
</script>
<script lang="ts">
export default {
  name: "TableViewer"
};
</script>
<style scoped lang="less"></style>
