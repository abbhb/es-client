<template>
  <div class="abs-0 overflow-auto more-update">
    <div class="p-8px">
      <t-timeline style="margin-top: 10px;" label-position="relative">
        <t-timeline-item :label="log.time" placement="top" v-for="log in Constant.logs">
          <t-card shadow :title="log.version">
            <div class="entry">
              <update-item :log="log"/>
            </div>
          </t-card>
        </t-timeline-item>
      </t-timeline>
    </div>
    <t-back-top container=".more-update" />
  </div>
</template>
<script lang="ts" setup>
import {Constant} from "@/global/Constant";
import UpdateItem from "@/components/update-item/index.vue";


</script>
<style scoped>

</style>
