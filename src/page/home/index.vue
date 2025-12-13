<template>
  <div class="abs-0" style="background-color: var(--td-bg-color-container)">
    <!-- 上面的搜索条件 -->
    <div class="flex justify-between my-8px mx-12px">
      <t-input-group>
        <!-- 输入框 -->
        <t-input v-model="keyword" placeholder="请输入索引名称" style="width: 45vw;height: 32px;" clearable/>
        <t-select v-model="status" type="button" auto-width>
          <t-option :value="Status.NONE" label="忽略">忽略</t-option>
          <t-option :value="Status.OPEN" label="开启">开启</t-option>
          <t-option :value="Status.CLOSE" label="关闭">关闭</t-option>
        </t-select>
      </t-input-group>
      <!-- 新增索引 -->
      <t-button theme="primary" style="margin-left: 10px" @click="indexAdd()" :disabled="!url">
        新建
      </t-button>
    </div>
    <!-- 索引容器 -->
    <t-list size="small" :scroll="{ type: 'virtual', rowHeight: 109, bufferSize: 10, threshold: 20 }"
            :split="false" style="height: calc(100vh - 98px)">
      <a-list-item v-for="{item} in results" :key="item.name">
        <index-item :index="item"/>
      </a-list-item>
    </t-list>
    <empty-result v-if="results.length === 0" title="空空如也"/>
    <t-back-top container=".t-list"/>
  </div>
</template>

<script lang="ts" setup>
import {useIndexStore, useUrlStore} from '@/store';
import IndexItem from "./components/index-item.vue";
import {useFuse} from "@vueuse/integrations/useFuse";
import {Status, useHomeStore} from "@/store/components/HomeStore";
import {indexAdd} from "@/page/home/components/IndexAdd";

const keyword = useHomeStore().keyword;
const status = useHomeStore().status;

const url = computed(() => useUrlStore().url);
const indices = computed(() => useIndexStore().list);

const {results} = useFuse(keyword, indices, {
  matchAllWhenSearchEmpty: true,
  fuseOptions: {
    keys: [{
      name: 'name'
    }, {
      name: 'alias'
    }]
  }
});

</script>

<style lang="less">
</style>
