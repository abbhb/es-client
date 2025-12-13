import { TableRowData, PrimaryTableCol } from "tdesign-vue-next";
import { useUrlStore } from "@/store";

export interface CatTableResult {
  columns: Array<PrimaryTableCol>;
  records: Array<TableRowData>;
}

/**
 * cat一个属性
 * @param url 链接
 */
export async function cat(url: string): Promise<CatTableResult> {
  const { client } = useUrlStore();
  if (!client) return Promise.reject("请选择链接");
  const rsp = await client.getText(url);

  const columns = new Array<PrimaryTableCol>();
  const records = new Array<TableRowData>();

  // 第一排是标题
  const lines = rsp.split("\n");
  if (lines.length == 0) {
    return { columns, records };
  }
  const headerStr = lines[0];
  const headers = headerStr.split(" ").filter((e) => e.trim() !== "");
  headers.forEach((header) => {
    const column: PrimaryTableCol = {
      title: header,
      colKey: header,
      width: Math.max(30, header.length * 16)
    };
    if (header === "index") {
      // 索引增加排序
      column.sortType = "all";
    }
    columns.push(column);
  });
  if (lines.length == 1) {
    return { columns, records };
  }
  const recordsStr = lines.slice(1);
  for (const recordStr of recordsStr) {
    if (!recordStr) continue;
    const recordItems = recordStr.split(" ").filter((e) => e.trim() !== "");
    const record: TableRowData = {};
    for (let i = 0; i < recordItems.length; i++) {
      record[headers[i] || ""] = recordItems[i];
      columns[i].width = Math.max((columns[i].width as number) || 30, recordItems[i].length * 13);
    }
    records.push(record);
  }
  return { columns, records };
}

interface Url {
  title: string;
  key: string;
}

// =^.^=
// /_cat/allocation
// /_cat/shards
// /_cat/shards/{index}
// /_cat/master
// /_cat/nodes
// /_cat/tasks
// /_cat/indices
// /_cat/indices/{index}
// /_cat/segments
// /_cat/segments/{index}
// /_cat/count
// /_cat/count/{index}
// /_cat/recovery
// /_cat/recovery/{index}
// /_cat/health
// /_cat/pending_tasks
// /_cat/aliases
// /_cat/aliases/{alias}
// /_cat/thread_pool
// /_cat/thread_pool/{thread_pools}
// /_cat/plugins
// /_cat/fielddata
// /_cat/fielddata/{fields}
// /_cat/nodeattrs
// /_cat/repositories
// /_cat/snapshots/{repository}
// /_cat/templates

const urls = [
  "allocation",
  "shards",
  "shards/{index}",
  "master",
  "nodes",
  "tasks",
  "indices",
  "indices/{index}",
  "segments",
  "segments/{index}",
  "count",
  "count/{index}",
  "recovery",
  "recovery/{index}",
  "health",
  "pending_tasks",
  "aliases",
  "thread_pool",
  "plugins",
  "fielddata",
  "nodeattrs",
  "repositories",
  "templates"
];

export const tabs: Array<Url> = urls.map((e) => ({ title: e, key: `/_cat/${e}?v` }));
