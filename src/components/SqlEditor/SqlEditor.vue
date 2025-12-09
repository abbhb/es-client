<template>
  <div ref="container" class="sql-editor"></div>
</template>
<script lang="ts" setup>
import * as monaco from 'monaco-editor';
import {SqlCodelens} from "./language/codelens";
import {useGlobalStore} from "@/store/GlobalStore";
import useEditorSettingStore from "@/store/setting/EditorSettingStore";
import Optional from "@/utils/Optional";
import {formatRestQuery} from "$/util";

const modelValue = defineModel({
  type: String,
  default: ''
})
const emit = defineEmits<{
  (e: 'run', args: { instance: monaco.editor.IStandaloneCodeEditor, index?: number }): void
}>();

let instance: monaco.editor.IStandaloneCodeEditor;

let codeLensProviderDisposable: any | null = null;

const container = ref<HTMLDivElement>();

const isDark = computed(() => useGlobalStore().isDark);
const runColor = computed(() => useEditorSettingStore().getRunColor);

watch(modelValue, val => {
  if (!instance) {
    return;
  }
  const model = instance.getModel();
  if (!model) {
    return;
  }
  if (val !== model.getValue()) {
    model.setValue(val);
  }
})

onMounted(() => {

  if (!container.value) {
    return
  }

  instance = monaco.editor.create(container.value, {
    value: modelValue.value,
    language: 'es-sql',
    automaticLayout: true,
    theme: isDark.value ? 'es-sql-enhanced-dark' : 'es-sql-enhanced-light',
    minimap: {
      enabled: useEditorSettingStore().getMinimap
    },
    fontFamily: "consoles",
    wordWrap: useEditorSettingStore().getWordWrap,
    fontSize: useEditorSettingStore().getFontSize
  });


  instance.onDidChangeModelContent(() => {
    modelValue.value = instance.getValue();
    return true;
  });

  let commandId = instance.addCommand(0, (...args: any[]) => {
    emit('run', {instance, index: args[1]})
  });

  codeLensProviderDisposable = monaco.languages.registerCodeLensProvider('http', SqlCodelens(Optional.ofNullable(commandId).orElse("")));

  // 增加一个动作：格式化文档
  instance.addAction({
    // An unique identifier of the contributed action.
    id: "format rest",
    // A label of the action that will be presented to the user.
    label: "格式化文档",
    // An optional array of keybindings for the action.
    keybindings: [],
    contextMenuGroupId: "navigation",
    contextMenuOrder: 1.5,
    // Method that will be executed when the action is triggered.
    // @param editor The editor instance is passed in as a convenience
    run: function (ed) {
      ed.setValue(formatRestQuery(ed.getValue()));
    },
  });

  watch(isDark, value => {
    instance.updateOptions({theme: value ? 'es-sql-enhanced-dark' : 'es-sql-enhanced-light'});
  })

});

onBeforeUnmount(() => {
  if (codeLensProviderDisposable) {
    codeLensProviderDisposable.dispose();
    codeLensProviderDisposable = null;
  }
  instance?.dispose();
});

defineExpose({
  getInstance: () => instance
})

</script>
<style scoped lang="less">
.sql-editor {
  height: 100%;
  :deep(.contentWidgets) {
    a {
      color: v-bind(runColor);
    }
  }
}
</style>
