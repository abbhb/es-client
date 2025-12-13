<template>
  <div class="base-search-view hljs">
    <TableViewer v-if="view === ViewTypeEnum.TABLE" :data="result" :height="height" :show-meta="baseSearchShowMeta"/>
    <monaco-view v-else :value="result" :height="`${height}px`"/>
  </div>
</template>
<script setup lang="ts">
import {BaseSearchInstanceResult} from "@/hooks";
import {useGlobalSettingStore} from "@/store";
import ViewTypeEnum from "@/enumeration/ViewTypeEnum";

const props = defineProps({
  tab: {
    type: Object as PropType<BaseSearchInstanceResult>,
    required: true
  }
});

const size = useWindowSize();

const height = computed(() => size.height.value - 108);

const {result} = props.tab;
const view = computed(() => useGlobalSettingStore().baseDefaultViewer);
const baseSearchShowMeta = computed(() => useGlobalSettingStore().baseSearchShowMeta);
</script>
<style lang="less">
.base-search-view {
  width: 100%;
  border-radius: 4px;
  position: relative;
  overflow-x: auto;
  height: calc(100vh - 108px);

  &.json-wrap {
    .CompCssDJsonViewTree {
      .wjv-line {
        flex-flow: wrap;
      }
    }

    pre.hljs {
      white-space: pre-wrap; /* css-3 */
      word-wrap: break-word; /* Internet Explorer 5.5+ */
      word-break: break-all;
    }
  }

  .json-view-copy {
    position: absolute;
    top: 0;
    right: 15px;
  }

  &.table-viewer-show {
    height: calc(100vh - 108px);
    overflow: hidden;
    padding: 0;
    border: 0;
  }
}
</style>
