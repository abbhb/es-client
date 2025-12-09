<template>
  <vxe-table
    ref="tableRef"
    :data="records"
    :height="height"
    :column-config="columnConfig"
    :row-config="rowConfig"
    empty-text="什么也没有"
  >
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
import {columnConfig, rowConfig} from "@/page/data-browse/component/DbContainer/args";
import {DataSearchColumnConfig} from "$/elasticsearch-client";

defineProps({
  columns: {
    type: Object as PropType<Array<DataSearchColumnConfig>>,
    default: () => ([])
  },
  records: {
    type: Object as PropType<Array<Record<string, any>>>,
    default: () => ([])
  },
  height: {type: Number, default: 500}
});

</script>
<script lang="ts">
export default {
  name: "TableViewer"
};
</script>
<style scoped lang="less"></style>
