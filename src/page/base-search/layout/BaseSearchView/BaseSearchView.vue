<template>
  <div class="base-search-view hljs">
    <monaco-view :value="result" height="calc(100vh - 108px)" />
  </div>
</template>
<script setup lang="ts">
import { BaseSearchInstanceResult } from "@/hooks";

const props = defineProps({
  tab: {
    type: Object as PropType<BaseSearchInstanceResult>,
    required: true
  }
});
const { result } = props.tab;
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
