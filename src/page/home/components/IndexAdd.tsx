import {
  Button,
  DialogInstance,
  DialogPlugin,
  Form,
  FormItem,
  Input,
  InputNumber,
  Option,
  Select,
  TabPanel,
  Tabs
} from "tdesign-vue-next";
import {IndexCreate} from "@/domain/es/IndexCreate";
import {getDefaultIndexInstance, IndexInstance} from "@/domain/IndexInstance";
import {useSeniorSearchStore} from "@/store/components/SeniorSearchStore";
import MessageUtil from "@/utils/model/MessageUtil";
import indexApi from "@/components/es/IndexApi";
import {useIndexStore} from "@/store";
import useLoadingStore from "@/store/LoadingStore";
import MonacoEditor from "@/components/monaco-editor/index.vue";
import {formatJsonString, parseJsonWithBigIntSupport, stringifyJsonWithBigIntSupport} from "$/util";
import {copyText} from "@/utils/BrowserUtil";
import AlertExtend from "@/components/AppExtend/AlertExtend.vue";

/**
 * 索引创建
 *
 * 名字限制
 * - 不能是大写。
 * - 不能包含 \，/，*，?，"，<，>，|，(空格)，,，#等字符。
 * - 7.0 之后的版本不能再包含 : （冒号）字符了。
 * - 不能以 -，_，+ 开头。名字不能是 . 或者 ..。
 * - 不能长于 255 字节。需要注意的是某些字符是需要多个字节来表示的。
 */
export function indexAdd(): void {
  const index: Ref<IndexInstance> = ref<IndexInstance>(getDefaultIndexInstance());
  // 名字是否正确
  const nameError = ref(0);
  const activeKey = ref("1");
  const fromIndex = ref<string | undefined>();

  const indices = computed(() => useIndexStore().list);
  const disabled = computed(() => !fromIndex.value);

  watch(() => index.value.name, value => {

    if (value.trim() === '') {
      nameError.value = 0;
      return;
    }

    if (/[A-Z]+/.test(value)) {
      nameError.value = 1;
      return;
    }

    if (/[\\\/*?"<>|\s#]+/.test(value)) {
      nameError.value = 2;
      return;
    }
    if (/^[_\-+]+/.test(value)) {
      nameError.value = 3;
      return;

    }
    nameError.value = 0;
  });


  function copy() {
    if (fromIndex.value) {
      const sourceIndex = useIndexStore().indicesMap.get(fromIndex.value);
      if (!sourceIndex) {
        MessageUtil.warning("找不到源索引");
        return;
      }
      index.value = {
        name: index.value.name,
        settings: index.value.settings,
        mappings: formatJsonString(stringifyJsonWithBigIntSupport(sourceIndex.indexInfo.mappings))
      };
    }
  }

  let modalReturn = DialogPlugin({
    header: "新建索引",
    width: "850px",
    draggable: true,
    dialogClassName: "home-index-add",
    placement: "center",
    default: () => <>
      <Form data={index.value}>
        <AlertExtend title={"手动建索引太麻烦？"} content={"提供可视化创建索引向导，轻松搞定复杂配置！"}
                     event={"新建索引"}/>
        <FormItem label="名称" labelAlign={"top"}>
          {{
            default: () => <Input v-model={index.value.name} style="width: 300px;" maxlength={255}
                                  clearable/>,
            help: () => {
              if (nameError.value === 1) {
                return <span>不能是大写。</span>
              } else if (nameError.value === 2) {
                return <span>不能包含 \，/，*，?，"，&lt;，&gt;，|，(空格)，,，#等字符。</span>
              } else if (nameError.value === 3) {
                return <span>不能以 -，_，+ 开头。</span>
              }
            }
          }}
        </FormItem>
      </Form>
      <Tabs v-model={activeKey.value}>
        {{
          default: () => <>
            <TabPanel label="设置" value="1">
              <Form data={index.value.settings} layout="vertical" class={"mt-8px"}>
                <FormItem label="分片数">
                  <InputNumber v-model={index.value.settings.number_of_shards}/>
                </FormItem>
                <FormItem label="副本数">
                  <InputNumber v-model={index.value.settings.number_of_replicas}/>
                </FormItem>
              </Form>
            </TabPanel>
            <TabPanel label="映射设置" value="2">
              <MonacoEditor v-model={index.value.mappings} language="json"
                            height={'calc(80vh - 336px)'} class={"mt-8px"}/>
            </TabPanel>
          </>,
          action: () => activeKey.value == "2" && <>
            <Select clearable filterable v-model={fromIndex.value}>
              {indices.value.map(idx =>
                <Option value={idx.name}>{idx.name}</Option>)}
            </Select>
            <Button variant="text" theme={"primary"} disabled={disabled.value} onClick={copy}>拷贝mapper</Button>
          </>
        }}
      </Tabs>
    </>,
    footer: () => <>
      <Button variant="text" theme={"primary"}
              onClick={() => jumpToSeniorSearch(index, modalReturn)}>跳转到高级查询</Button>
      <Button variant="text" theme={"primary"} onClick={() => copyIndex(index, modalReturn)}>复制到剪切板</Button>
      <Button theme="default" onClick={() => modalReturn.destroy()}>取消</Button>
      <Button theme="primary" onClick={() => addIndex(index, modalReturn)}>新增</Button>
    </>,
  });
}

function jumpToSeniorSearch(index: Ref<IndexInstance>, modalReturn: DialogInstance) {
  // 构建数据
  // 高级查询数据填充
  useSeniorSearchStore().loadEvent({
    link: '/' + index.value.name,
    method: 'PUT',
    body: stringifyJsonWithBigIntSupport(getIndexCreate(index))
  });
  modalReturn.destroy();
}

function copyIndex(index: Ref<IndexInstance>, modalReturn: DialogInstance) {
  // 执行拷贝
  copyText(stringifyJsonWithBigIntSupport(getIndexCreate(index)));
  MessageUtil.success("已成功复制到剪切板");
  modalReturn.destroy();
}

function addIndex(index: Ref<IndexInstance>, modalReturn: DialogInstance) {
  useLoadingStore().start("正在新增索引")
  // 新增
  indexApi(index.value.name).create(getIndexCreate(index))
    .then(res => MessageUtil.success(res, useIndexStore().reset))
    .catch(e => MessageUtil.error('索引创建错误', e))
    .finally(useLoadingStore().close);
  modalReturn.destroy()
}


function getIndexCreate(index: Ref<IndexInstance>): IndexCreate {
  return {
    settings: index.value.settings,
    mappings: parseJsonWithBigIntSupport(index.value.mappings)
  };
}
