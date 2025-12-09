import * as monaco from "monaco-editor";
import {esSqlLanguage} from "@/components/SqlEditor/language/language";
import {configuration} from "@/components/SqlEditor/language/configuration";
import {createESQLCompletionProvider} from "@/components/SqlEditor/language/provider";
import {restFoldingRangeProvider} from "@/components/SqlEditor/language/foldingRange";
import {useIndexStore} from "@/store";

export {default as SqlEditor} from "./SqlEditor.vue";

export interface SqlEditorFunc {
  getInstance: () => monaco.editor.IStandaloneCodeEditor | undefined;
}

export function registerLanguageForSql() {
  monaco.languages.register({id: 'es-sql'});
  // 语法高亮
  monaco.languages.setMonarchTokensProvider('es-sql', esSqlLanguage);
  // 语言括号配置
  monaco.languages.setLanguageConfiguration('es-sql', configuration);
  // 语法提示
  monaco.languages.registerCompletionItemProvider('es-sql', createESQLCompletionProvider({
    listTableNames: async () => {
      const tableName = new Set<string>();
      useIndexStore().list.forEach((index) => {
        [...index.alias, index.name].forEach(i => tableName.add(i));
      })
      return Array.from(tableName);
    },
    getFields: async (tableName: string) => {
      const index = useIndexStore().list.find(i => i.name === tableName || i.alias.includes(tableName));
      if (!index) return [];
      return index.fields.map(i => i.label);
    }
  }));
  // 代码折叠
  monaco.languages.registerFoldingRangeProvider('es-sql', restFoldingRangeProvider)

  // 语法高亮主题
  monaco.editor.defineTheme('es-sql-enhanced-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      {token: 'function.concat', foreground: '4EC9B0', fontStyle: 'bold'},
      {token: 'function.date_format', foreground: 'C586C0', fontStyle: 'bold'},
      {token: 'string.format', foreground: 'CE9178', fontStyle: 'italic'}, // 格式串斜体
      {token: 'identifier.backtick', foreground: '999999', fontStyle: 'italic'}
    ],
    colors: {}
  });
  // 亮色
  monaco.editor.defineTheme('es-sql-enhanced-light', {
    base: 'vs',
    inherit: true,
    rules: [
      {token: 'function.concat', foreground: '4EC9B0', fontStyle: 'bold'},
      {token: 'function.date_format', foreground: 'C586C0', fontStyle: 'bold'},
      {token: 'string.format', foreground: 'CE9178', fontStyle: 'italic'},
      {token: 'identifier.backtick', foreground: '999999', fontStyle: 'italic'}
    ],
    colors: {}
  })
}