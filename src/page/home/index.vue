<template>
  <div class="abs-0" style="background-color: var(--td-bg-color-container)">
    <!-- 上面的搜索条件 -->
    <div class="flex justify-between my-8px mx-12px">
      <!-- 输入框 -->
      <t-input v-model="keyword" :placeholder="$t('home.index_list.placeholder')" style="width: 45vw;height: 32px;"
               clearable/>
      <div class="flex" style="gap: 8px; margin-left: 10px">
        <!-- 批量删除模式切换 -->
        <t-button :theme="batchMode ? 'warning' : 'default'" variant="outline" @click="toggleBatchMode">
          {{ batchMode ? $t('home.index_list.cancel_batch') : $t('home.index_list.batch_select') }}
        </t-button>
        <!-- 批量删除确认按钮 -->
        <t-button v-if="batchMode" theme="danger" :disabled="selectedIndices.length === 0" @click="batchDelete">
          {{ $t('home.index_list.batch_delete') }}({{ selectedIndices.length }})
        </t-button>
        <!-- 新增索引 -->
        <t-button theme="primary" @click="indexAdd()" :disabled="!url">
          {{ $t('home.index_list.create') }}
        </t-button>
      </div>
    </div>
    <!-- 索引容器 -->
    <t-list size="small" :scroll="{ type: 'virtual', rowHeight: 109, bufferSize: 10, threshold: 20 }"
            :split="false" style="height: calc(100vh - 98px)">
      <t-list-item v-for="{item} in results" :key="item.name">
        <index-item :index="item" :batch-mode="batchMode" :selected="selectedIndices.includes(item.name)"
                    @toggle-select="toggleSelect(item.name)"/>
      </t-list-item>
    </t-list>
    <empty-result v-if="results.length === 0" :title="$t('home.index_list.empty')"/>
    <t-back-top container=".t-list"/>
  </div>
</template>

<script lang="ts" setup>
import {useIndexStore, useUrlStore} from '@/store';
import IndexItem from "./components/index-item.vue";
import {useFuse} from "@vueuse/integrations/useFuse";
import {useHomeStore} from "@/store/components/HomeStore";
import {indexAdd} from "@/page/home/components/IndexAdd";
import MessageBoxUtil from "@/utils/model/MessageBoxUtil";
import MessageUtil from "@/utils/model/MessageUtil";
import {useI18n} from "vue-i18n";

const {t} = useI18n();
const homeStore = useHomeStore();
const keyword = homeStore.keyword;
const batchMode = homeStore.batchMode;
const selectedIndices = homeStore.selectedIndices;

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

function toggleBatchMode() {
  batchMode.value = !batchMode.value;
  if (!batchMode.value) {
    selectedIndices.value = [];
  }
}

function toggleSelect(name: string) {
  const idx = selectedIndices.value.indexOf(name);
  if (idx === -1) {
    selectedIndices.value.push(name);
  } else {
    selectedIndices.value.splice(idx, 1);
  }
}

function batchDelete() {
  const {client} = useUrlStore();
  if (!client) return MessageUtil.error(t('home.index_item.select_link'));
  MessageBoxUtil.confirm(
    t('home.index_list.batch_delete_confirm', {count: selectedIndices.value.length}),
    t('home.index_item.prompt'),
    {
      confirmButtonText: t('home.index_item.confirm'),
      cancelButtonText: t('home.index_item.cancel'),
    }
  ).then(() => {
    const names = [...selectedIndices.value];
    client.deleteBatchIndex(names)
      .then(() => {
        MessageUtil.success(t('home.index_list.batch_delete_success'));
        names.forEach(name => useIndexStore().removeIndex(name));
        selectedIndices.value = [];
        batchMode.value = false;
      })
      .catch(e => MessageUtil.error(t('home.index_item.delete_index_error'), e));
  });
}
</script>

<style lang="less">
</style>
