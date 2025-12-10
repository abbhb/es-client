import {Button, Link, Popconfirm, Space, Tag, TdPrimaryTableProps} from "tdesign-vue-next";
import { openUpdateLink } from "@/page/setting/pages/link/components/EditLink";
import MessageUtil from "@/utils/model/MessageUtil";
import {copyText} from "@/utils/BrowserUtil";

export const linkTableColumn: TdPrimaryTableProps["columns"] = [
  {
    title: "名称",
    colKey: "name",
    width: 120,
    fixed: "left"
  },
  {
    title: "链接",
    colKey: "value",
    cell: (_h, { row }) => (
      <Link theme={"primary"}
        onClick={() => {
          copyText(row.value);
          MessageUtil.success("已复制到剪切板");
        }}
      >
        {row.value}
      </Link>
    )
  },
  {
    title: "平台",
    colKey: "platform",
    cell: (_h, { row }) => (
      <Tag theme={"primary"}>{row.platform || 'elasticsearch'}</Tag>
    )
  },
  {
    title: "版本",
    colKey: "version"
  },
  {
    title: "认证",
    colKey: "isAuth",
    width: 100,
    cell: (_h, { row }) => <div>{row.isAuth ? "是" : "否"}</div>
  },
  {
    title: "操作",
    colKey: "action",
    width: 170,
    fixed: "right",

    cell: (_h, { row }) => (
      <Space>
        <Button theme={"primary"} size={"small"} onClick={() => openUpdateLink(row as any)}>
          修改
        </Button>
        <Popconfirm confirmBtn={"删除"} content={"是否删除链接，删除后将无法恢复"}>
          <Button theme={"danger"} size={"small"}>删除</Button>
        </Popconfirm>
      </Space>
    )
  }
];
