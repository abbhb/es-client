import { defineStore } from "pinia";
import { BaseSearchInstanceResult, useBaseSearchInstance } from "@/hooks";

export const useBaseSearchStore = defineStore("base-search", () => {
  const tabs = shallowRef([]) as Ref<Array<BaseSearchInstanceResult>>;
  const self = useBaseSearchInstance();
  tabs.value.push(self);
  return {
    tabs
  };
});
