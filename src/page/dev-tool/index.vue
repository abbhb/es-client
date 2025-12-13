<template>
  <div class="abs-0">
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
</style>
