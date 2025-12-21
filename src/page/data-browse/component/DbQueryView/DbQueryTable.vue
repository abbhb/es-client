<template>
  <vxe-table
    ref="tableRef"
    :data="records"
    stripe
    :height="height"
    :column-config="columnConfig"
    :row-config="rowConfig"
    :loading="loading"
    :menu-config="menuConfig(false)"
    :virtual-y-config="virtualYConfig"
    empty-text="什么也没有"
    @menu-click="contextMenuClickEvent"
  >
    <vxe-column field="_id" title="_id" fixed="left" :width="200" show-overflow="tooltip" />
    <vxe-column type="expand" width="80" title="详细" fixed="left">
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
import {
  columnConfig,
  menuConfig,
  rowConfig,
  virtualYConfig
} from "@/page/data-browse/component/DbContainer/args";
import { DataSearchColumnConfig } from "$/elasticsearch-client";
import MonacoView from "@/components/view/MonacoView/index.vue";
import { buildQueryContextMenuClickEvent } from "@/page/data-browse/component/DbContainer/func";
import { VxeTableInstance } from "vxe-table";
import { UseDataBrowserQueryInstance } from "@/hooks/query/DataBrowserQueryInstance";

const props = defineProps({
  tab: {
    type: Object as PropType<UseDataBrowserQueryInstance>,
    required: true
  },
  columns: {
    type: Object as PropType<Array<DataSearchColumnConfig>>,
    // eslint-disable-next-line vue/require-valid-default-prop
    default: () => []
  },
  records: {
    type: Object as PropType<Array<Record<string, any>>>,
    // eslint-disable-next-line vue/require-valid-default-prop
    default: () => []
  },
  loading: { type: Boolean, default: false },
  height: { type: Number, default: 500 }
});

const tableRef = ref<VxeTableInstance | null>(null);

// 菜单点击事件
const contextMenuClickEvent = buildQueryContextMenuClickEvent(tableRef, props.tab);
</script>
<script lang="ts">
export default {
  name: "TableViewer"
};
</script>
<style scoped lang="less"></style>
