import {Alert, Input, DialogPlugin} from "tdesign-vue-next";
import AppLink from "@/components/AppLink/AppLink.vue";

export function indexAliasAdd(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const name = ref('')
    const d = DialogPlugin.confirm({
      default: () => <div class="domain-prompt">
        <div>请输入新别名</div>
        <Input type="text" v-model={name.value} style={{marginTop: '8px'}}/>
        <Alert title={"别名功能不够用？"} style={{marginTop: '8px'}}>
          <span>⚙️ </span>
          <AppLink event="新建别名"/>
          <span>支持完整别名参数设置（如 routing、filter），满足高级需求！</span>
        </Alert>
      </div>,
      header: '提示',
      placement: "center",
      draggable: true,
      onConfirm: () => {
        resolve(name.value);
        d.destroy();
      },
      onCancel: () => {
        reject('cancel');
        d.destroy();
      },
      onClose: () => {
        reject('close');
        d.destroy();
      }
    })
  })
}