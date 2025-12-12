<template>
  <div class="more material-card">
    <router-view/>
  </div>
</template>

<script lang="ts" setup>
</script>

<style lang="less">
.more {
  position: absolute;
  top: 7px;
  left: 7px;
  right: 7px;
  bottom: 7px;
  padding: 0;
  overflow: auto;
}
</style>
