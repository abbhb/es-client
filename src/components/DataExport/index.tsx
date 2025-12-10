import ConditionExportEvent, {
  ApiType,
  ExportConfig,
  ExportMode,
  ExportScope,
  ExportSource,
  ExportType
} from "@/components/DataExport/domain";
import {
  Alert,
  DrawerPlugin,
  Form,
  FormItem,
  Input,
  InputGroup,
  InputNumber,
  Option,
  Radio,
  RadioGroup,
  Select
} from "tdesign-vue-next";
import {exportData} from "@/components/DataExport/func";
import useLoadingStore from "@/store/LoadingStore";
import MessageUtil from "@/utils/model/MessageUtil";
import AppLink from "@/components/AppLink/AppLink.vue";

const allowExportTypes: Array<ExportType> = [ExportType.JSON];

/**
 * 显示导出组件
 * @param config 配置项
 */
export function showDataExportDrawer(config: ConditionExportEvent) {

  const instance: Ref<ExportConfig> = ref<ExportConfig>(getDefaultConfig(config));

  // 显示对话框
  DrawerPlugin({
    header: "数据导出",
    size: "600px",
    default: () => <Form data={instance.value}>
      <Alert title={"导出卡顿？"}>
        <span>👉 想一键导出 10 万+ 行到 CSV/Excel/JSON？试试 </span>
        <AppLink event="导出"/>
        <span>！</span>
      </Alert>
      <FormItem label="文件名" labelAlign={"top"}>
        <Input v-model={instance.value.name}/>
      </FormItem>
      <FormItem label="文件类型" labelAlign={"top"}>
        <Select v-model={instance.value.type}>
          <Option value={ExportType.JSON} label={"JSON文件(*.json)"}>JSON文件(*.json)</Option>
          <Option value={ExportType.XLSX} label={"表格(*.xlsx)"}>表格(*.xlsx)</Option>
          <Option value={ExportType.CSV} label={"CSV(*.csv)"}>CSV(*.csv)</Option>
          <Option value={ExportType.TSV} label={"管道分隔(*.txt)"}>管道分隔(*.txt)</Option>
          <Option value={ExportType.TXT} label={"文本文件(*.txt)"}>文本文件(*.txt)</Option>
        </Select>
      </FormItem>
      {isText(instance)}
      <FormItem label="导出范围" labelAlign={"top"}>
        <Select v-model={instance.value.scope}>
          <Option value={ExportScope.CURRENT} label={"当前页面"}>当前页面</Option>
          <Option value={ExportScope.ALL} label={"全部"}>全部</Option>
          <Option value={ExportScope.CUSTOM} label={"自定义范围"}>自定义范围</Option>
        </Select>
      </FormItem>
      {isCustom(instance)}
      {isCurrent(instance)}
      <FormItem label="来源" labelAlign={"top"}>
        <Select v-model={instance.value.source}>
          <Option value={ExportSource.ALL} label={"全部"}
                  disabled={!allowExportTypes.includes(instance.value.type)}>全部
          </Option>
          <Option value={ExportSource.HIT} label={"只导出hits"}>只导出hits</Option>
          <Option value={ExportSource.SOURCE} label={"只导出_source内容"}>只导出_source内容</Option>
        </Select>
      </FormItem>
      <FormItem label="API类型" labelAlign={"top"}>
        {{
          default: () => <RadioGroup v-model={instance.value.apiType} theme="button"
                                     disabled={instance.value.scope != ExportScope.ALL}>
            <Radio value={ApiType.BASE}>基础API</Radio>
            <Radio value={ApiType.SCROLL}>scroll api</Radio>
          </RadioGroup>,
          help: () => {
            if (instance.value.scope != ExportScope.ALL) {
              return <span>只有导出范围是全部才可以选择API</span>
            } else if (instance.value.apiType === ApiType.BASE) {
              return <span>基础分页API</span>
            } else if (instance.value.apiType === ApiType.SCROLL) {
              return <span>scroll api，适合导出大批量数据，没有10000条限制</span>
            }
          }
        }}
      </FormItem>
      {isScroll(instance)}
    </Form>,
    onConfirm() {
      // 打开
      useLoadingStore().start('开始导出');
      exportData(instance.value)
        .then(() => MessageUtil.success("导出成功"))
        .catch(e => MessageUtil.error("导出失败", e))
        .finally(() => useLoadingStore().close());
    }
  });
}

function getDefaultConfig(config: ConditionExportEvent): ExportConfig {
  return {
    name: config.name,
    type: ExportType.JSON,
    separator: '',
    scope: ExportScope.CURRENT,
    customStart: 1,
    customEnd: 2,
    source: ExportSource.ALL,
    fields: [],
    size: 1000,
    mode: ExportMode.DOWNLOAD,
    search: config.search,
    index: config.index,
    apiType: ApiType.BASE,
    scrollTime: "1m"
  }
}

function isText(instance: Ref<ExportConfig>) {
  if (instance.value.type === ExportType.TXT) {
    return <FormItem label="分隔符" labelAlign={"top"}>
      <Input v-model={instance.value.separator}/>
    </FormItem>;
  }
}

function isCustom(instance: Ref<ExportConfig>) {
  if (instance.value.scope === ExportScope.CUSTOM) {
    return <FormItem label="范围" labelAlign={"top"}>
      <InputGroup>
        <InputNumber v-model={instance.value.customStart} min={1}/>
        <span> - </span>
        <InputNumber v-model={instance.value.customEnd} min={instance.value.customStart}/>
      </InputGroup>
    </FormItem>;
  }
}

function isCurrent(instance: Ref<ExportConfig>) {
  if (instance.value.scope !== ExportScope.CURRENT) {
    return <FormItem label="每页大小" labelAlign={"top"}>
      <InputNumber v-model={instance.value.size} min={1}/>
    </FormItem>
  }
}

function isScroll(instance: Ref<ExportConfig>) {
  if (instance.value.apiType === ApiType.SCROLL) {
    return <FormItem label="滚动时间" labelAlign={"top"}>
      {{
        default: () => <Input v-model={instance.value.scrollTime}/>,
        help: () => {
          return <span>如果使用滚动API报错，可以适当加大此参数</span>
        }
      }}
    </FormItem>
  }
}
