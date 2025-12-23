<template>
  <div class="abs-8 !right-0 material-card p-8px flex flex-col">
    <div class="flex justify-between items-center">
      <div>CHAT2ES</div>
      <div class="flex">
        <t-button size="small" theme="primary" variant="text" shape="square">
          <template #icon>
            <chat-bubble-add-icon />
          </template>
        </t-button>
        <t-button size="small" theme="primary" variant="text" shape="square">
          <template #icon>
            <chat-bubble-history-icon />
          </template>
        </t-button>
      </div>
    </div>
    <div class="flex-1">
    </div>
    <div>
      <chat-left-input />
    </div>
  </div>
</template>
<script lang="ts" setup>
import {ChatBubbleAddIcon, ChatBubbleHistoryIcon} from "tdesign-icons-vue-next";
import ChatLeftInput from "@/page/chat2es/components/ChatLeftInput.vue";
</script>
<style scoped lang="less">

</style>
