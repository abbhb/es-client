import { DialogPlugin, Paragraph } from "tdesign-vue-next";

export function showFieldType() {
  DialogPlugin({
    header: "字段类型分析",
    placement: "center",
    default: () => (
      <Paragraph>此功能可以帮助您对文本进行分析，展示文本分析器会对文本产生什么结果。</Paragraph>
    ),
    draggable: true,
    footer: false
  });
}

export function showAnalyzer() {
  DialogPlugin({
    header: "分析器分析",
    placement: "center",
    default: () => (
      <Paragraph>此功能可以帮助您对文本进行分析，展示文本分析器会对文本产生什么结果。</Paragraph>
    ),
    draggable: true,
    footer: false
  });
}
