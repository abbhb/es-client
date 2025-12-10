<template>
  <t-alert :title>
    <span>🚀 </span>
    <AppLink :event/>
    <span>{{content}}</span>
  </t-alert>
</template>
<script lang="ts" setup>
defineProps({
  title: String,
  event: {
    type: String,
    required: true
  },
  content: String
});
</script>
<style scoped lang="less">

</style>
