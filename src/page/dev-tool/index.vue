<template>
  <div class="senior-search">
    <SplitPanel v-model="size">
      <template #left>
        <dev-tool-file />
      </template>
      <template #right>
        <dev-tool-container />
      </template>
    </SplitPanel>
  </div>
</template>
<script lang="ts" setup>
import DevToolFile from "@/page/dev-tool/layout/DevToolFile/DevToolFile.vue";
import DevToolContainer from "@/page/dev-tool/layout/DevToolContainer/DevToolContainer.vue";
import LocalNameEnum from "@/enumeration/LocalNameEnum";

const size = useSessionStorage(LocalNameEnum.KEY_DEV_TOOL_SIZE, 400);
</script>
<style scoped lang="less">
.senior-search {
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  bottom: 8px;
  background-color: var(--td-bg-color-container);
  color: var(--td-text-color-primary);
  border-radius: var(--td-radius-medium);
  overflow: hidden;

}
</style>
