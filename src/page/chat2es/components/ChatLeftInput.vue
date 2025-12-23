<template>
  <div class="chat-left-input">
    <t-textarea
      v-model="inputValue"
      :autosize="{ minRows: 1, maxRows: 8 }"
      placeholder="输入消息..."
    ></t-textarea>
    <div class="input-controls">
      <div class="left-controls">
        <t-dropdown trigger="click" placement="top">
          <t-button variant="text" theme="primary" shape="square" size="small" @click="handleAt">
            @
          </t-button>
          <t-dropdown-menu>
            <t-dropdown-item v-for="idx in indices" :key="idx.name" :value="idx.name">@{{ idx.name }}</t-dropdown-item>
          </t-dropdown-menu>
        </t-dropdown>
      </div>
      <div class="right-controls">
        <t-select v-model="selectedModel" size="small" auto-width>
          <t-option value="gpt-4">GPT-4</t-option>
          <t-option value="gpt-3.5">GPT-3.5</t-option>
          <t-option value="claude">Claude</t-option>
        </t-select>
        <t-button variant="text" theme="primary" shape="square" size="small" class="shrink-0" :disabled="empty"
                  @click="handleSend">
          <t-icon name="send"/>
        </t-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {useIndexStore, useUrlStore} from "@/store";

const inputValue = ref('');
const selectedModel = ref('gpt-4');

const indices = computed(() => useIndexStore().list)
const empty = computed(() => useUrlStore().empty)

const handleEnter = (event: KeyboardEvent) => {
  if (!event.shiftKey) {
    event.preventDefault();
    handleSend();
  }
};

const handleSend = () => {
  if (inputValue.value.trim()) {
    // 触发发送事件
    emit('send', {message: inputValue.value, model: selectedModel.value});
    inputValue.value = '';
  }
};

const handleAt = () => {
  // 触发@事件
  emit('at');
};

// 定义组件事件
const emit = defineEmits(['send', 'at']);
</script>

<style scoped lang="less">
.chat-left-input {
  position: relative;

  .t-textarea {
    flex: 1;
    min-height: 60px;
    resize: vertical;

    // 限制最大高度
    :deep(.t-textarea__inner) {
      overflow-y: auto;
      padding-bottom: 2rem;
    }
  }

  .input-controls {
    position: absolute;
    left: 4px;
    right: 4px;
    bottom: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
    padding-top: 8px;

    .left-controls, .right-controls {
      display: flex;
      align-items: center;
      gap: 4px;
    }

  }
}
</style>