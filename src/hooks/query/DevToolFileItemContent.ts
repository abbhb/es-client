import type {Ref} from "vue";
import {parseRestRequests} from "$/util";
import {useUrlStore} from "@/store";
import {useQueryApi} from "@/hooks";
import MessageUtil from "@/utils/model/MessageUtil";
import {getFromOne, saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {DevToolContent} from "@/entity";

export interface UseSeniorFileItemContent {
  id: string;
  /**
   * 编辑器宽度
   */
  size: Ref<number>;
  /**
   * 脚本内容
   */
  content: Ref<string>;
  /**
   * 加载中
   */
  init: Ref<boolean>;
  /**
   * 加载中
   */
  loading: Ref<boolean>;
  /**
   * 查询结果
   */
  data: Ref<string | undefined>;
  /**
   * 保存操作
   */
  // save: () => Promise<void>;

  /**
   * 执行查询
   */
  run: (index: number) => void;
}

export const useDevToolFileItemContent = (id: string): UseSeniorFileItemContent => {
  const content = ref("");
  const size = ref(400);
  const init = ref(false);

  const {reload, data, loading} = useQueryApi((index: number) => {
    const requests = parseRestRequests(content.value);
    const request = requests[index];
    if (!request) {
      return Promise.reject(new Error("请求块无法识别"));
    }
    const {client} = useUrlStore();
    if (!client) return Promise.reject(new Error("请选择链接"));
    return client.seniorSearch(request);
  });

  getFromOne<DevToolContent>(`${LocalNameEnum.ITEM_DEV_TOOL_FILE_ITEM}/${id}`)
    .then(res => {
      if (res) {
        content.value = res.record.content;
        size.value = res.record.size;
      }
    }).finally(() => init.value = true);

  watchDebounced([content, size], () => {
    saveOneByAsync(`${LocalNameEnum.ITEM_DEV_TOOL_FILE_ITEM}/${id}`, {
      id,
      content: content.value,
      size: size.value
    }).catch(e => MessageUtil.error("保存失败", e));
  }, {debounce: 500})

  return {
    id,
    content,
    init,
    loading,
    size,
    data,
    run: (index: number) => {
      reload(index).then(() => MessageUtil.success("执行成功"));
    }
  };
};
