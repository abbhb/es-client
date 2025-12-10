<template>
  <div class="setting-url">
    <div class="setting-url-toolbar">
      <t-input v-model="keyword" style="width: 40vw;" placeholder="链接名称" clearable/>
      <t-space size="small">
        <t-button theme="primary" @click="openAddLink">
          新增
        </t-button>
        <t-dropdown trigger="click">
          <t-button theme="primary" shape="square">
            <template #icon>
              <more-icon/>
            </template>
          </t-button>
          <t-dropdown-menu>
            <t-dropdown-item @click="exportUrlToJson()">
              <template #prefix-icon>
                <file-export-icon/>
              </template>
              数据导出
            </t-dropdown-item>
            <t-dropdown-item @click="importUrlByJson()">
              <template #prefix-icon>
                <file-import-icon/>
              </template>
              数据导入
            </t-dropdown-item>
          </t-dropdown-menu>
        </t-dropdown>
      </t-space>
    </div>
    <t-table ref="urlTable" :data="urls" class="data" style="height: 100%;" :columns="linkTableColumn" row-key="id"
             :maxHeight="virtualListProps.height">
    </t-table>
  </div>
</template>
<script lang="ts" setup>
import {useUrlStore} from "@/store";
import {getDefaultUrl} from "@/entity/Url";
import MessageUtil from "@/utils/model/MessageUtil";
import {useFuse} from "@vueuse/integrations/useFuse";
import {download} from "@/utils/BrowserUtil";
import {Constant} from "@/global/Constant";
import {openAddLink} from "@/page/setting/pages/link/components/EditLink";
import {parseJsonWithBigIntSupport, stringifyJsonWithBigIntSupport} from "$/util";
import {FileExportIcon, FileImportIcon, MoreIcon} from "tdesign-icons-vue-next";
import {linkTableColumn} from "@/page/setting/pages/link/components/LinkTableColumn";

const size = useWindowSize();

const keyword = ref('');

const items = computed(() => useUrlStore().urls);
const {results} = useFuse(keyword, items, {
  matchAllWhenSearchEmpty: true,
  fuseOptions: {
    keys: [{
      name: 'name'
    }, {
      name: 'value'
    }]
  }
});
const urls = computed(() => results.value.map(e => e.item));

const virtualListProps = computed(() => ({
  height: size.height.value - 144
}))

// -------------------------------------- 方法 --------------------------------------

function onDragSort({newData}: { newData: Array<any> }) {
  useUrlStore().save(newData.map(item => toRaw(item)));
}

// 导入导出

function exportUrlToJson() {
  download(stringifyJsonWithBigIntSupport({
    version: Constant.version,
    records: useUrlStore().urls
  }), "链接导出.json", "application/json");
}

const importFile = useFileSystemAccess({
  dataType: 'Text',
  types: [{
    accept: {
      'application/json': ['.json']
    },
    description: "JSON文件"
  }]
});

function importUrlByJson() {
  const rsp = importFile.open() as Promise<void>;
  rsp.then(() => {
    const value = importFile.data.value;
    if (!value) {
      MessageUtil.error("没有解析到数据，请确认上传文件是否正确")
    }
    handlerJson(value)
      .then(() => MessageUtil.success("导入成功"))
      .catch(e => MessageUtil.error("导入失败", e));
  })
}

async function handlerJson(json?: string) {
  if (!json) {
    return Promise.reject("没有解析到数据，请确认上传文件是否正确");
  }
  let value;
  try {
    value = parseJsonWithBigIntSupport(json);
  } catch (e) {
    return Promise.reject("JSON文件解析失败");
  }
  if (!value) {
    return Promise.reject("JSON未解析到数据");
  }
  let records = value.records;
  if (!records) {
    return Promise.reject("链接记录不存在");
  }
  if (!(records instanceof Array)) {
    return Promise.reject("数据格式错误，无法导入");
  }
  await useUrlStore().addByBatch(records.map(e => getDefaultUrl(e)))
}
</script>
<style lang="less">
.setting-url {
  .setting-url-toolbar {
    display: flex;
    justify-content: space-between;
    margin: 8px 5px;
  }

  .url-copy {
    display: inline;
    margin-left: 10px;
    color: #0052d9;
    cursor: pointer;
  }
}
</style>