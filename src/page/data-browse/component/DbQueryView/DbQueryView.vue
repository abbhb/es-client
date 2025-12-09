<template>
  <div class="abs-0">
    <!-- tab -->
    <TabChrome v-model="current" :tabs="tabs"/>
    <!-- 表格 -->
    <div v-for="instance in instances" :key="instance.id" v-show="current === instance.id">
      <DbQueryTable :columns="instance.columns.value" :records="instance.records.value"/>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {UseDataBrowserQueryInstance} from "@/hooks/query/DataBrowserQueryInstance";
import {SelectOption} from "$/shared/common";
import DbQueryTable from "@/page/data-browse/component/DbQueryView/DbQueryTable.vue";

const props = defineProps({
  instances: {
    type: Object as PropType<Array<UseDataBrowserQueryInstance>>,
    required: true
  }
});

const current = ref<string>('');

const tabs = computed<Array<SelectOption>>(() => {
  if (tabs.value.length === 0) return [];
  current.value = props.instances[0].id;
  return props.instances.map((e, i) => ({
    label: `结果-${i + 1}`,
    value: e.id
  }));
})

</script>
<style scoped lang="less">

</style>
