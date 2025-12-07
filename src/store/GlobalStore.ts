import {defineStore} from "pinia";
import {useColorMode} from "@/hooks";

export const useGlobalStore = defineStore('global', () => {
  const size = useWindowSize();
  const loading = ref(false);
  const loadingText = ref('');

  const height = computed(() => size.height);
  const width = computed(() => size.width);

  const { isDark } = useColorMode();

  return {
    size,
    loading,
    loadingText,
    height,
    width,
    isDark
  };
});
