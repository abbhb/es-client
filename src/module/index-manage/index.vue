<template>
  <t-drawer :header="index" class="index-manage-drawer" v-model:visible="drawer" size="960px" destroy-on-close>
    <div class="index-manage">
      <t-tabs v-model="active" class="tab">
        <t-tab-panel label="总览" value="1"/>
        <t-tab-panel label="设置" value="2"/>
        <t-tab-panel label="映射" value="3"/>
        <t-tab-panel label="统计信息" value="4"/>
      </t-tabs>
      <t-loading :loading="loading" text="加载中" class="h-full">
        <div class="content">
          <t-alert v-if="active === '3'" title="Mapping 看得头疼？" style="margin-bottom: 8px;">
            <span>🌳</span>
            <AppLink event="查看mapping"/>
            <span>用树形表格清晰展示 Mapping 结构，一目了然！</span>
          </t-alert>
          <monaco-view :value="pretty" v-show="jsonViewShow" read-only
                       :height="active === '3' ? 'calc(100vh - 268px)' : 'calc(100vh - 176px)'"/>
          <index-manage-summary v-if="drawer" ref="indexManageSummary" v-show="!jsonViewShow" :index="index"
                                :state="state"/>
        </div>
      </t-loading>
    </div>
    <template #footer>
      <t-dropdown trigger="click" @select="indexManage">
        <t-button theme="primary">
          管理
          <template #suffix>
            <chevron-up-icon/>
          </template>
        </t-button>
        <t-dropdown-menu>
          <t-dropdown-item value="open" v-if="state === 'close'">打开索引</t-dropdown-item>
          <t-dropdown-item value="close" v-else-if="state === 'open'">关闭索引</t-dropdown-item>
          <t-dropdown-item disabled value="merge">强制合并索引</t-dropdown-item>
          <t-dropdown-item value="refresh">刷新索引</t-dropdown-item>
          <t-dropdown-item value="clear">清除索引缓存</t-dropdown-item>
          <t-dropdown-item value="flush">flush索引</t-dropdown-item>
          <t-dropdown-item disabled value="freeze">冻结索引</t-dropdown-item>
          <t-dropdown-item value="remove">删除索引</t-dropdown-item>
          <t-dropdown-item disabled value="lifecycle">增加生命周期</t-dropdown-item>
        </t-dropdown-menu>
      </t-dropdown>
    </template>
  </t-drawer>
</template>
<script lang="ts">
import {contains} from "@/utils/ArrayUtil";
import IndexApi from "@/components/es/IndexApi";
import Assert from "@/utils/Assert";
import IndexManageSummary from "@/module/index-manage/summary.vue";
import MessageUtil from "@/utils/model/MessageUtil";
import {useIndexStore} from "@/store";
import Optional from "@/utils/Optional";
import {mapState} from "pinia";
import {useIndexManageEvent} from "@/global/BeanFactory";
import MessageBoxUtil from "@/utils/model/MessageBoxUtil";
import MonacoEditor from "@/components/monaco-editor/index.vue";
import {formatJsonString, stringifyJsonWithBigIntSupport} from "$/util";
import {ChevronUpIcon} from "tdesign-icons-vue-next";

export default defineComponent({
  name: 'index-manage',
  emits: ['update:modelValue'],
  components: {ChevronUpIcon, MonacoEditor, IndexManageSummary},
  data: () => ({
    drawer: false,
    active: '1',
    data: '',
    loading: false,
    index: ''
  }),
  watch: {
    active(newValue: string) {
      this.assignJson(newValue);
    },
    index() {
      this.$nextTick(() => {
        this.assignJson(this.active);
      })
    }
  },
  computed: {
    jsonViewShow() {
      return contains(['2', '3', '4'], this.active);
    },
    ...mapState(useIndexStore, ['indicesMap']),
    state(): 'open' | 'close' | '' {
      let indexView = useIndexStore().indicesMap.get(this.index);
      return Optional.ofNullable(indexView).map(e => e.state).orElse('');
    },
    pretty() {
      return formatJsonString(this.data);
    }
  },
  created() {
    useIndexManageEvent.on(index => {
      this.drawer = true;
      this.index = index;
    })
  },
  methods: {
    assignJson(newValue: string) {
      switch (newValue) {
        case '2':
          this.setting();
          break;
        case '3':
          this.mapping();
          break;
        case '4':
          this.stats();
          break;
      }
    },
    setting() {
      Assert.notNull(this.index, "索引名称不存在");
      this.loading = true;
      IndexApi(this.index)._settings().then(result => {
        this.data = stringifyJsonWithBigIntSupport(result[this.index]);
      }).catch(e => {
        MessageUtil.error('索引设置查询错误', e);
        this.data = '{}';
      }).finally(() => {
        this.loading = false;
      })
    },
    mapping() {
      Assert.notNull(this.index, "索引名称不存在");
      this.loading = true;
      IndexApi(this.index)._mappings().then(result => {
        this.data = stringifyJsonWithBigIntSupport(result[this.index!]);
      }).catch(e => {
        MessageUtil.error('索引映射查询错误', e);
        this.data = '{}';
      }).finally(() => {
        this.loading = false;
      })
    },
    stats() {
      Assert.notNull(this.index, "索引名称不存在");
      this.loading = true;
      IndexApi(this.index)._stats().then(result => {
        this.data = stringifyJsonWithBigIntSupport(result);
      }).catch(e => {
        MessageUtil.error('索引状态查询错误', e);
        this.data = '{}';
      }).finally(() => {
        this.loading = false;
      })
    },
    indexManage(command: any) {
      this.execCommand(command).then(() => {
        // 1. 发送索引更新事件
        useIndexStore().reset();
        // 3. 更新本组件
        this.assignJson(this.active);
      }).catch(e => console.error(e));
    },
    execCommand(command: string): Promise<void> {
      return new Promise<void>((resolve, reject) => {
        switch (command) {
          case 'open':
            IndexApi(this.index)._open()
              .then(res => MessageUtil.success(res, resolve))
              .catch(e => MessageUtil.error('打开索引错误', e, () => reject(e)));
            break;
          case 'close':
            IndexApi(this.index)._close()
              .then(res => MessageUtil.success(res, resolve))
              .catch(e => MessageUtil.error('关闭索引错误', e, () => reject(e)));
            break;
          case 'merge':
            break;
          case 'refresh':
            IndexApi(this.index)._refresh()
              .then(res => MessageUtil.success(res, resolve))
              .catch(e => MessageUtil.error('刷新索引失败', e, () => reject(e)));
            break;
          case 'clear':
            IndexApi(this.index)._cacheClear()
              .then(res => MessageUtil.success(res, resolve))
              .catch(e => MessageUtil.error('清理缓存失败', e, () => reject(e)));
            break;
          case 'flush':
            IndexApi(this.index)._flush()
              .then(res => MessageUtil.success(res, resolve))
              .catch(e => MessageUtil.error('flush刷新失败', e, () => reject(e)));
            break;
          case 'freeze':
            break;
          case 'remove':
            MessageBoxUtil.confirm("此操作将永久删除该索引, 是否继续?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消"
            }).then(() => IndexApi(this.index).delete()
              .then(res => MessageUtil.success(res, resolve))
              .catch(e => MessageUtil.error('索引删除错误', e, () => reject(e))));
            break;
          case 'lifecycle':
            break;
        }
      })
    }
  }
});
</script>
<style lang="less">
.index-manage-drawer {
  .index-manage {
    position: absolute;
    top: 56px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;

    .tab {
      position: absolute;
      top: 5px;
      left: 20px;
      right: 20px;
    }

    .content {
      position: absolute;
      top: 54px;
      left: 20px;
      right: 20px;
      bottom: 0;
      overflow: auto;
    }

  }

  .arco-drawer-footer {
    text-align: left !important;
  }
}
</style>
