<template>
  <div v-if="log">
    <ol>
      <template v-for="item in log.items">
        <li v-if="typeof item === 'string'">{{ item }}</li>
        <ol v-else-if="item instanceof Array">
          <li v-for="i in item">
            <span v-html="i"></span>
          </li>
        </ol>
        <li v-else>
          <t-tag :theme="renderTag(item.label).color" style="margin-left:5px;padding-left: 6px;padding-right: 6px">
            {{ renderTag(item.label).name }}
          </t-tag>
          <span style="margin-left:5px;">{{ item.content }}</span>
          <span v-if="item.txc"><t-link @click="open(item.txc)">@兔小巢</t-link></span>
          <span v-else-if="item.gitee">
            <t-link @click="open(item.gitee.content)">
              #{{ item.gitee.title }}
            </t-link>
          </span>
          <span v-else-if="item.pull">
            <t-tooltip content="贡献者">
              <t-link status="success" @click="open(item.pull?.url)">@ {{ item.pull?.name }}</t-link>
            </t-tooltip>
          </span>
        </li>
      </template>
    </ol>
    <t-typography-paragraph v-if="log.remark">{{ log.remark }}</t-typography-paragraph>
    <div v-if="log.doc">
      更多详细的更新信息与功能变化，请在
      <t-link target="_blank" @click="open(log?.doc)">此处</t-link>
      中查看
    </div>
  </div>
</template>
<script lang="ts">
import {Log, LogItemEnum} from "@/view/Data";
import {openUrl} from "@/utils/BrowserUtil";

export default defineComponent({
  name: 'update-item',
  props: {
    log: Object as PropType<Log>
  },
  methods: {
    renderTag(value: number): { name: string, color: "default" | "primary" | "success" | "warning" | "danger" } {
      switch (value) {
        case LogItemEnum.ADD:
          return {
            name: '新增',
            color: 'primary'
          };
        case LogItemEnum.UPDATE:
          return {
            name: '更新',
            color: 'success'
          };
        case LogItemEnum.REPAIR:
          return {
            name: '修复',
            color: 'danger'
          };
        case LogItemEnum.OPTIMIZATION:
          return {
            name: '优化',
            color: 'warning'
          };
        default:
          return {
            name: '',
            color: 'default'
          };
      }
    },
    open(url?: string) {
      if (url) {
        openUrl(url);
      }
    }
  }
});
</script>
<style scoped></style>
