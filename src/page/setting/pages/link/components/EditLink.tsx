import {
  Button,
  DialogPlugin,
  Form,
  FormItem,
  Input,
  LoadingPlugin,
  Radio,
  RadioButton,
  RadioGroup,
  Space,
  Switch
} from "tdesign-vue-next";
import {getDefaultUrl, Url} from "@/entity/Url";
import "./EditLink.less";
import {useUrlStore} from "@/store";
import MessageUtil from "@/utils/model/MessageUtil";
import {cloneDeep} from "es-toolkit";
import NotificationUtil from "@/utils/model/NotificationUtil";
import {buildEsRequestConfig, useRequestJson} from "@/plugins/native/axios";

export function openAddLink() {
  const link = ref(getDefaultUrl());

  function submit() {
    if (!link.value.name) {
      MessageUtil.error("请填写名称");
      return;
    }
    if (!link.value.value) {
      MessageUtil.error("请填写链接");
      return;
    }
    if (!link.value.version) {
      MessageUtil.error("请先进行测试");
      return;
    }

    useUrlStore()
      .add(cloneDeep(link.value))
      .then(() => {
        MessageUtil.success("新增成功");
        modalReturn.destroy();
      })
      .catch((e) => MessageUtil.error("新增失败", e));
  }

  const modalReturn = DialogPlugin({
    header: "新增链接",
    placement: "center",
    draggable: true,
    default: () => buildForm(link),
    footer: () => buildFooter(link, 0, submit)
  });
}

export function openUpdateLink(record: Url) {
  const link = ref(cloneDeep({...record, platform: record.platform || "elasticsearch"}));

  function submit() {
    useUrlStore()
      .update(record.id, cloneDeep(link.value))
      .then(() => {
        MessageUtil.success("修改成功");
        modalReturn.destroy();
      })
      .catch((e) => MessageUtil.error("修改失败", e));
  }

  const modalReturn = DialogPlugin({
    header: "新增链接",
    placement: "center",
    draggable: true,
    default: () => buildForm(link),
    footer: () => buildFooter(link, record.id, submit)
  });
}

function buildForm(link: Ref<Url>) {
  const authUser = computed(() => {
    if (link.value.authType === 1) {
      return "用户名";
    } else if (link.value.authType === 2) {
      return "请求头键";
    } else {
      return "";
    }
  });
  const authPassword = computed(() => {
    if (link.value.authType === 2) {
      return "请求头值";
    } else if (link.value.authType === 3) {
      return "Cookie值";
    } else {
      return "密码";
    }
  });

  return (
    <Form data={link.value} layout={"vertical"}>
      <FormItem label={"名称"} labelAlign={"top"}>
        <Input v-model={link.value.name} clearable/>
      </FormItem>
      <FormItem label={"链接"} labelAlign={"top"}>
        {{
          default: () => <Input v-model={link.value.value} clearable/>,
          help: () =>
            link.value.value.endsWith("/") && (
              <span style={{color: "rgb(var(--danger-6))"}}>
                检测到链接以/结尾，可能造成报错，建议删除结尾的/
              </span>
            )
        }}
      </FormItem>
      <FormItem label={"平台"} labelAlign={"top"}>
        <RadioGroup variant="primary-filled" v-model={link.value.platform} defaultValue={"elasticsearch"}>
          <RadioButton value={"elasticsearch"}>elasticsearch</RadioButton>
          <RadioButton value={"opensearch"} disabled>
            opensearch
          </RadioButton>
          <RadioButton value={"easysearch"} disabled>
            easysearch
          </RadioButton>
        </RadioGroup>
      </FormItem>
      <FormItem label={"版本"} labelAlign={"top"}>
        <Input v-model={link.value.version} readonly/>
      </FormItem>
      <FormItem label={"是否认证"} labelAlign={"top"}>
        <Switch v-model={link.value.isAuth}/>
      </FormItem>
      {link.value.isAuth && (
        <>
          <FormItem label={"认证方式"} labelAlign={"top"}>
            <RadioGroup v-model={link.value.authType}>
              <Radio value={1}>基础认证</Radio>
              <Radio value={2}>请求头认证</Radio>
              <Radio value={3}>Cookie认证</Radio>
            </RadioGroup>
          </FormItem>
          {link.value.authType !== 3 && (
            <FormItem label={authUser.value} labelAlign={"top"}>
              <Input v-model={link.value.authUser} clearable/>
            </FormItem>
          )}
          <FormItem label={authPassword.value} labelAlign={"top"}>
            <Input type={"password"} v-model={link.value.authPassword}/>
          </FormItem>
        </>
      )}
    </Form>
  );
}

function buildFooter(link: Ref<Url>, id: number, submit: () => void) {
  const loading = ref(false);

  function test() {
    if (loading.value) return;
    loading.value = true;
    const lp = LoadingPlugin({content: "正在加载中"});
    useRequestJson("/", buildEsRequestConfig({}, cloneDeep(link.value)))
      .then((response) => {
        link.value.version = `${response.version.number}`;
        NotificationUtil.success(
          () => (
            <div>
              <div>名称：{response.name.name}</div>
              <div>版本：{response.version.number}</div>
              <div>Lucene版本：{response.version.lucene_version}</div>
            </div>
          ),
          "测试成功"
        );
      })
      .catch((e) => {
        NotificationUtil.error(`链接不可用: ${e}`, "测试失败");
      })
      .finally(() => {
        loading.value = false;
        lp.hide();
      });
  }

  return (
    <Space>
      <Button variant={"outline"} onClick={test}>
        测试
      </Button>
      <Button theme={"primary"} onClick={submit}>
        {id === 0 ? "新增" : "修改"}
      </Button>
    </Space>
  );
}
