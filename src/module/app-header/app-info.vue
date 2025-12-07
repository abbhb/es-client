<!-- 此处是右上角详情 -->
<template>
  <t-dropdown trigger="click" @click="handleCommand" :max-height="600">
    <t-button variant="text" theme="primary" shape="square" :class="className" :disabled="selfDisabled">
      <template #icon>
        <info-circle-icon />
      </template>
    </t-button>
    <t-dropdown-menu>
      <t-dropdown-item value="info">信息</t-dropdown-item>
      <t-dropdown-item value="status">状态</t-dropdown-item>
      <t-dropdown-item value="node_status">节点状态</t-dropdown-item>
      <t-dropdown-item value="cluster_nodes">集群节点</t-dropdown-item>
      <t-dropdown-item value="plugin">插件</t-dropdown-item>
      <t-dropdown-item value="cluster_status">集群状态</t-dropdown-item>
      <t-dropdown-item value="cluster_health">集群健康值</t-dropdown-item>
      <t-dropdown-item value="template">模板</t-dropdown-item>
    </t-dropdown-menu>
  </t-dropdown>
</template>
<script lang="ts">
import {mapState} from "pinia";
import {useUrlStore} from "@/store";
import clusterApi from "@/components/es/ClusterApi";
import {showJsonDialogByAsync} from "@/utils/model/DialogUtil";
import {InfoCircleIcon} from "tdesign-icons-vue-next";
import {DropdownOption} from "tdesign-vue-next";

export default defineComponent({
  name: 'home-info',
  components: {InfoCircleIcon},
  emits: ['command'],
  props: {
    className: {
      type: String,
      required: false,
      default: ''
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: () => ({
    title: '',
    dialog: false,
    data: {},
    previewMode: true,
    nodeStatsDialog: false
  }),
  computed: {
    ...mapState(useUrlStore, ['url']),
    selfDisabled(): boolean {
      if (!this.url) {
        return true;
      }
      return this.disabled;
    }
  },
  methods: {
    handleCommand(dropdownItem: DropdownOption) {
      const {value: command} = dropdownItem;
      switch (command) {
        case 'info':
          this.info();
          break;
        case 'status':
          this.state();
          break;
        case 'node_status':
          this.node_stats();
          break;
        case 'cluster_nodes':
          this.cluster_nodes();
          break;
        case 'plugin':
          this.plugin();
          break;
        case 'cluster_status':
          this.cluster_status();
          break;
        case 'cluster_health':
          this.cluster_health();
          break;
        case 'template':
          this.template();
          break;
      }
    },
    async info() {
      showJsonDialogByAsync('信息', clusterApi.info());
    },
    async state() {
      showJsonDialogByAsync('状态', clusterApi._stats());
    },
    async node_stats() {
      showJsonDialogByAsync('节点状态', clusterApi._nodes_stats());
    },
    async cluster_nodes() {
      showJsonDialogByAsync('集群节点', clusterApi._nodes());
    },
    async plugin() {
      showJsonDialogByAsync('插件1', clusterApi._nodes_plugins());
    },
    async cluster_status() {
      showJsonDialogByAsync('集群状态', clusterApi._cluster_state());
    },
    async cluster_health() {
      showJsonDialogByAsync('集群健康值', clusterApi._cluster_health());
    },
    async template() {
      showJsonDialogByAsync('模板', clusterApi._template());
    }
  }
});
</script>
<style>
</style>
