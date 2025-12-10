import {DATA_BROWSER_VIEW_KEY, DataBrowserView} from "@/entity/DataBrowser/DataBrowserView";
import {listByAsync, removeOneByAsync, saveListByAsync} from "@/utils/utools/DbStorageUtil";

export async function listDataBrowserViews(id: number) {
  const {list} = await listByAsync<DataBrowserView>(DATA_BROWSER_VIEW_KEY(id));
  return list;
}

export async function addDataBrowserView(id: number, view: DataBrowserView) {
  const {list} = await listByAsync<DataBrowserView>(DATA_BROWSER_VIEW_KEY(id));
  list.push(view);
  await saveListByAsync(DATA_BROWSER_VIEW_KEY(id), list);
}

export async function deleteDataBrowserView(id: number, viewId: string) {
  const {list} = await listByAsync<DataBrowserView>(DATA_BROWSER_VIEW_KEY(id));
  list.splice(list.findIndex(e => e.id === viewId), 1);
  await saveListByAsync(DATA_BROWSER_VIEW_KEY(id), list);
}

export function clearDataBrowserViews(id: number) {
  return  removeOneByAsync(DATA_BROWSER_VIEW_KEY(id));
}
