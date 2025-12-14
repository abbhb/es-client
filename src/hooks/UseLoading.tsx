import NotificationUtil from "@/utils/model/NotificationUtil";
import {LoadingPlugin} from "tdesign-vue-next";

export interface UseLoadingResult {
  close: () => void;
  start: (text: string) => void;
}

export const useLoading = (text = '加载中'): UseLoadingResult => {

  const value = ref(text);

  const plugin = LoadingPlugin({
    text: () => <span>{value.value}</span>,
  });
  let timer: ReturnType<typeof setTimeout> | null = null;

  // 创建新的定时器
  function addTimeout(timeout: number) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      NotificationUtil.confirm("检测到全局加载已超过10秒，是否立即关闭全局加载框", "警告", {
        confirmButtonText: '关闭',
        cancelButtonText: '忽略'
      }).catch(() => {
        console.log('忽略提示');
        addTimeout(20);
      })
    }, timeout * 1000);
  }

  addTimeout(10);

  return {
    close: () => {
      plugin.hide();
      if (timer != null) {
        clearTimeout(timer);
      }
    },
    start: (text: string) => {
      value.value = text;
      addTimeout(10);
    },
  }
}