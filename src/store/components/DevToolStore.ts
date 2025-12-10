import { defineStore } from "pinia";
import { DevToolFileItem } from "@/entity";
import {
  UseSeniorFileItemContent,
  useDevToolFileItemContent
} from "@/hooks/query/DevToolFileItemContent";
import {useUrlStore} from "@/store";

interface TabOption {
  label: string;
  value: string;
}

export const useDevToolStore = defineStore("dev-tool", () => {
  // 所在目录
  const parentId = ref('');
  // 所有打开的文件
  const activeIds = ref(new Array<TabOption>());
  // 当前显示的文件
  const activeId = ref('');
  const contentMap = new Map<string, UseSeniorFileItemContent>();

  watch(() => useUrlStore().id, () => {
    // 每次变化时清空
    activeIds.value = [];
    contentMap.clear();
  })

  const contents = computed<Array<UseSeniorFileItemContent>>(() =>
    activeIds.value.map((e) => {
      const source = contentMap.get(e.value);
      if (source) return source;
      else {
        const target = useDevToolFileItemContent(e.value);
        contentMap.set(e.value, target);
        return target;
      }
    })
  );

  const onFileItemClick = (item: DevToolFileItem) => {
    if (item.folder) {
      parentId.value = item.id;
    } else {
      // 文件点击，打开
      if (!activeIds.value.find((e) => e.value === item.id)) {
        activeIds.value.push({
          label: item.name,
          value: item.id
        });
      }
      activeId.value = item.id;
    }
  };
  const onFileItemClose = (id: string) => {
    activeIds.value = activeIds.value.filter((i) => i.value !== id);
    contentMap.delete(id);
    if (activeId.value === id)
      activeId.value = activeIds.value[activeIds.value.length - 1]?.value || '';
  };

  const getFileContent = (id: string): UseSeniorFileItemContent => {
    const source = contentMap.get(id);
    if (source) return source;
    const target = useDevToolFileItemContent(id);
    contentMap.set(id, target);
    return target;
  };

  // TODO: 需要允许临时文件的存在，并且第一个也是临时文件
  const loadEvent = (props: { link: string; method: string; body: string }) => {
    console.log("props", props);
  };

  return {
    parentId,
    activeId,
    activeIds,
    contents,
    onFileItemClick,
    onFileItemClose,
    getFileContent,
    loadEvent
  };
});
