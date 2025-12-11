<template>
  <t-loading :loading="loading" text="数据查询中">
    <t-descriptions title="概览" :column="2" class="index-manage-summary" bordered>
      <t-descriptions-item label="健康">
        <div class="health">
          <div class="dot" :style="{ backgroundColor: health }"/>
          <div>{{ health }}</div>
        </div>
      </t-descriptions-item>
      <t-descriptions-item label="状态">{{ state }}</t-descriptions-item>
      <t-descriptions-item label="节点数">{{ numberOfNodes }}</t-descriptions-item>
      <t-descriptions-item label="数据节点数">{{ numberOfDataNodes }}</t-descriptions-item>
      <t-descriptions-item label="活动主要分片">{{ activePrimaryShards }}</t-descriptions-item>
      <t-descriptions-item label="活动分片">{{ activeShards }}</t-descriptions-item>
      <t-descriptions-item label="relocating分片">{{ relocatingShards }}</t-descriptions-item>
      <t-descriptions-item label="initializing分片">{{ initializingShards }}</t-descriptions-item>
      <t-descriptions-item label="unassigned分片">{{ unassignedShards }}</t-descriptions-item>
      <t-descriptions-item label="别名" :span="2">
        <t-tag theme="primary" closable @close="removeAlias(item)" variant="outline"
               v-for="(item, idx) in aliasItems" :key="idx" style="margin-right: 5px">
          {{ item }}
        </t-tag>
        <t-button theme="primary" size="small" @click="newAlias()">新增
        </t-button>
      </t-descriptions-item>
    </t-descriptions>
  </t-loading>
</template>
<script lang="ts">
import {useIndexStore} from "@/store";
import Assert from "@/utils/Assert";
import IndexApi from "@/components/es/IndexApi";
import MessageUtil from "@/utils/model/MessageUtil";
import {mapState} from "pinia";
import MessageBoxUtil from "@/utils/model/MessageBoxUtil";
import {stringifyJsonWithBigIntSupport} from "$/util";

export default defineComponent({
  name: 'index-manage-summary',
  props: {
    index: String,
    state: String
  },
  data: () => ({
    loading: false,
    health: '',
    numberOfNodes: 0,
    numberOfDataNodes: 0,
    activePrimaryShards: 0,
    activeShards: 0,
    relocatingShards: 0,
    initializingShards: 0,
    unassignedShards: 0,
    aliasItems: new Array<string>()
  }),
  created() {
    this.init();
  },
  computed: {
    ...mapState(useIndexStore, ['indicesMap']),
  },
  watch: {
    indicesMap() {
      this.init()
    }
  },
  methods: {
    init() {
      this.loading = true;
      let indexView = useIndexStore().indicesMap.get(this.index!)!;
      Assert.notNull(indexView, "索引不存在", () => this.loading = false);

      // 获取索引健康状态
      IndexApi(this.index!).health().then(health => {
        this.health = health.status;
        this.numberOfNodes = health.number_of_nodes;
        this.numberOfDataNodes = health.number_of_data_nodes;
        this.activePrimaryShards = health.active_primary_shards;
        this.activeShards = health.active_shards;
        this.relocatingShards = health.relocating_shards;
        this.initializingShards = health.initializing_shards;
        this.unassignedShards = health.unassigned_shards;
        this.aliasItems = indexView.alias;
      }).catch(e => MessageUtil.error("索引健康值获取错误", e))
        .finally(() => this.loading = false);
    },

    newAlias() {
      MessageBoxUtil.prompt("请输入新别名", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then((value) => IndexApi(this.index!).newAlias(value)
        .then(res => {
          MessageUtil.success(stringifyJsonWithBigIntSupport(res), this.reset);
        })
        .catch(e => MessageUtil.error('新建别名错误', e)));
    },
    removeAlias(alias: string) {
      MessageBoxUtil.confirm("此操作将永久删除该别名, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => IndexApi(this.index!).removeAlias(alias)
          .then(res => MessageUtil.success(stringifyJsonWithBigIntSupport(res), this.reset))
          .catch(e => MessageUtil.error('删除别名错误', e)))
        .catch(() => console.log('取消删除别买'));
    },
    reset() {
      useIndexStore().reset();
    },
  }
});
</script>
<style scoped lang="less">
.index-manage-summary {
  margin-top: 20px;


  .health {
    display: flex;
  }


  .alias {
    margin-right: 5px;
    margin-bottom: 5px;
  }

}
</style>
