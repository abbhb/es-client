import { TreeOptionData } from "tdesign-vue-next";
import { DevToolFileItem } from "@/entity";
import { ListToTree } from "$/util/lang/TreeUtil";

export function listToTree(list: Array<DevToolFileItem>): Array<TreeOptionData> {
  const transformer = new ListToTree<DevToolFileItem>({
    idKey: "id",
    parentIdKey: "parentId",
    labelKey: "name",
    rootNodeId: "0",
    handle: (item: DevToolFileItem) => {
      return {
        icon: item.folder ? "folder" : "file",
        _source: item
      };
    }
  });

  return transformer.transform(list);
}
