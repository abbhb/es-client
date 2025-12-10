<template>
  <div ref="container" class="es-rest-client-editor"></div>
</template>
<script lang="ts" setup>
import * as monaco from "monaco-editor";
// 语言组件
import codelens from "./codelens";
// 存储
import { useGlobalStore } from "@/store/GlobalStore";
import { useEditorSettingStore } from "@/store";
// 其他
import Optional from "@/utils/Optional";
import { URL_REGEX } from "@/data/EsUrl";
import { formatRestQuery } from "$/util";

const content = defineModel({
  type: String,
  default: ""
});
const emit = defineEmits(["save", "run"]);

let instance: monaco.editor.IStandaloneCodeEditor;

let codeLensProviderDisposable: any | null = null;

const container = ref<HTMLDivElement>();

const isDark = computed(() => useGlobalStore().isDark);
const runColor = computed(() => useEditorSettingStore().getRunColor);

onMounted(() => {
  if (!container.value) {
    return;
  }

  instance = monaco.editor.create(container.value, {
    value: content.value,
    language: "http",
    automaticLayout: true,
    theme: isDark.value ? "vs-dark" : "vs",
    minimap: {
      enabled: useEditorSettingStore().getMinimap
    },
    fontFamily: "consoles",
    wordWrap: useEditorSettingStore().getWordWrap,
    fontSize: useEditorSettingStore().getFontSize
  });

  instance.onDidChangeModelContent(() => {
    content.value = instance.getValue();
    emit("save");
    return true;
  });

  let commandId = instance.addCommand(0, (...args: any[]) => {
    emit("run", args[1]);
  });
  // 增加快捷键
  instance.addCommand(monaco.KeyCode.F9, () => {
    let value = instance.getValue();
    let row = Optional.ofNullable(instance.getPosition()).attr("lineNumber").orElse(1);
    let numbers = renderValue(value);
    console.log(value, row, numbers);
    if (numbers.length === 0) {
      return;
    }
    let fail = true;
    for (let i = 0; i < numbers.length; i++) {
      if (numbers[i] > row) {
        fail = false;
        let target = i - 1;
        if (target < 0) {
          target = 0;
        }
      }
    }
    if (fail) {
      emit("run", numbers.length - 1);
    }
  });

  codeLensProviderDisposable = monaco.languages.registerCodeLensProvider(
    "http",
    codelens(Optional.ofNullable(commandId).orElse(""))
  );

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
    }
  });
});

onBeforeUnmount(() => {
  if (codeLensProviderDisposable) {
    codeLensProviderDisposable.dispose();
    codeLensProviderDisposable = null;
  }
});

function renderValue(value: string): Array<number> {
  let lineNumbers = new Array<number>();
  const lines = value.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(URL_REGEX)) {
      lineNumbers.push(i);
    }
  }
  return lineNumbers;
}
</script>
<style lang="less">
.es-rest-client-editor {
  height: 100%;
  .contentWidgets {
    a {
      color: v-bind(runColor);
    }
  }
}
</style>
