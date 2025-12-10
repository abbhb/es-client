<template>
  <div class="setting-global">
    <div style="overflow: auto;height: calc(100vh - 47px);" id="setting-global-scroller">
      <t-form :model="instance" style="padding: 8px">

        <t-divider id="new">新建索引</t-divider>
        <t-form-item label-align="top" label="默认分片数" id="defaultShard">
          <t-input-number v-model="instance.defaultShard"></t-input-number>
        </t-form-item>
        <t-form-item label-align="top" label="默认副本数" id="defaultReplica">
          <t-input-number v-model="instance.defaultReplica"></t-input-number>
        </t-form-item>


        <t-divider id="global-search">
          全局索引查询条件（修改后请
          <span class="like-red">刷新</span>
          索引）
        </t-divider>
        <t-form-item label-align="top" label="状态" id="homeSearchState">
          <t-radio-group v-model="instance.homeSearchState">
            <t-radio :value="0">不设置</t-radio>
            <t-radio :value="1">打开</t-radio>
            <t-radio :value="2">关闭</t-radio>
          </t-radio-group>
        </t-form-item>
        <t-form-item label-align="top" id="homeExcludeIndices" class="w-full" help="回车新增">
          <template #label>
            <span>排除指定索引</span>
            <t-tooltip content="支持正则表达式" placement="top" effect="light">
              <icon-question-circle style="margin-left: 5px;"/>
            </t-tooltip>
          </template>
          <t-tag-input v-model="instance.homeExcludeIndices" allow-clear/>
        </t-form-item>
        <t-form-item label-align="top" id="homeIncludeIndices" class="w-full" help="回车新增">
          <template #label>
            <span>显示指定索引</span>
            <t-tooltip content="支持正则表达式" placement="top" effect="light">
              <icon-question-circle style="margin-left: 5px;"/>
            </t-tooltip>
          </template>
          <t-tag-input v-model="instance.homeIncludeIndices" allow-clear style=""/>
        </t-form-item>
        <t-divider id="time">track_total_hits设置</t-divider>
        <t-alert theme="info" title="track_total_hits介绍">
          <p>
            track_total_hits 是
            Elasticsearch（ES）中用于控制搜索请求是否<b>精确计算并返回匹配文档总数</b>的参数。它在 ES
            7.0 版本中引入，主要背景是 Lucene 8 的优化更新（如 WAND 算法），旨在提升查询性能。
          </p>
          <ul>
            <li>true: 精确计算所有匹配文档的总数，性能开销大</li>
            <li>false: 不计算总数，性能最佳</li>
            <li>自定义: 整数（如 100000） 精确计算到该数量为止，超过则返回近似值</li>
          </ul>
        </t-alert>
        <t-form-item label-align="top" label="track_total_hits模式" name="trackTotalHitsMode"
                     help="默认为true，当版本低于v7则不会生效">
          <t-radio-group v-model="instance.trackTotalHitsMode" default-value="true">
            <t-radio :value="'true'">true</t-radio>
            <t-radio :value="'false'">false</t-radio>
            <t-radio :value="'custom'">自定义</t-radio>
          </t-radio-group>
        </t-form-item>
        <t-form-item
          v-if="instance.trackTotalHitsMode === 'custom'"
          label-align="top"
          label="track_total_hits值"
          name="trackTotalHitsValue"
        >
          <t-input-number
            v-model="instance.trackTotalHitsValue"
            :min="0"
            :step="1000"
            class="w-240px"
          />
        </t-form-item>


        <t-divider id="time">时间相关设置</t-divider>
        <t-form-item label-align="top" label="超时时间" id="timeout">
          <t-input-number v-model="instance.timeout" :min="0" :step="1000"
                          placeholder="超时时间" style="width: 180px">
            <template #suffix>ms</template>
          </t-input-number>
        </t-form-item>
        <t-form-item label-align="top" label="通知关闭时间" id="notificationTime">
          <t-input-number v-model="instance.notificationTime" :min="0" :step="1000"
                          placeholder="单位（ms）" style="width: 180px">
            <template #suffix>ms</template>
          </t-input-number>
        </t-form-item>


        <t-divider id="display">显示设置</t-divider>
        <t-form-item label-align="top" label="默认分页大小" id="pageSize">
          <t-input-number v-model="instance.pageSize"></t-input-number>
        </t-form-item>
        <t-form-item label-align="top" label="基础查询 - 默认视图" id="baseDefaultViewer">
          <t-radio-group v-model="instance.baseDefaultViewer">
            <t-radio label="表格视图" :value="ViewTypeEnum.TABLE">表格视图</t-radio>
            <t-radio label="编辑器视图" :value="ViewTypeEnum.EDITOR">编辑器视图</t-radio>
          </t-radio-group>
        </t-form-item>
        <t-form-item label-align="top" label="高级查询 - 默认视图" id="seniorDefaultViewer">
          <t-radio-group v-model="instance.seniorDefaultViewer">
            <t-radio label="表格视图" :value="ViewTypeEnum.TABLE">表格视图</t-radio>
            <t-radio label="编辑器视图" :value="ViewTypeEnum.EDITOR">编辑器视图</t-radio>
          </t-radio-group>
        </t-form-item>


        <t-divider id="other">其他设置</t-divider>
        <t-form-item label-align="top" id="lastUrl">
          <template #label>
            <span>保存上次选择的连接</span>
            <t-tooltip content="保存后，下一次打开es-client自动选中该链接" placement="top" effect="light">
              <icon-question-circle style="margin-left: 5px;"/>
            </t-tooltip>
          </template>
          <t-switch v-model="instance.lastUrl" >
            <template #label="checked">{{checked.value?'保存': '忽略'}}</template>
          </t-switch>
        </t-form-item>

      </t-form>
    </div>
    <div class="extend">
      <ActiveExtend/>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {useGlobalSettingStore} from "@/store";
import ViewTypeEnum from "@/enumeration/ViewTypeEnum";
import {storeToRefs} from "pinia";

const {globalSetting: instance} = storeToRefs(useGlobalSettingStore());

</script>
<style lang="less">
.home-exclude-index {
  margin-left: 5px;

  &:first-child {
    margin-left: 0;
  }
}

.home-exclude-item {
  margin-left: 5px;
}

.like-red {
  color: rgb(var(--orange-6));
}

.setting-global {
  margin-top: 7px;
  height: calc(100vh - 47px);

  .toc {
    position: fixed;
    top: 108px;
    right: 24px;
    max-height: calc(100vh - 176px);
    overflow: auto;
    background-color: var(--color-neutral-2);
    border: 1px solid var(--color-neutral-3);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    z-index: 2;
  }

  .arco-form-item-wrapper-col {
    width: 350px;
  }

  .w-full {

    .arco-form-item-wrapper-col {
      width: 100%;
    }
  }
}

.extend {
  position: absolute;
  right: 16px;
  bottom: 0;
}
</style>
