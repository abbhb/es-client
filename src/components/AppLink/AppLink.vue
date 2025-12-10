<template>
  <t-link :href="Constant.url.home" theme="primary" hover="underline" target="_blank" @click="onClick">App 专业版</t-link>
</template>
<script lang="ts" setup>
import {Constant} from "@/global/Constant";
import {useUmami} from "@/plugins/umami";
const props = defineProps({
  event: {
    type: String,
    required: true
  }
});

function onClick() {
  // 记录
  useUmami.track("APP引流", props.event)
}
</script>
<style scoped lang="less">

</style>
