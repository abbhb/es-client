export interface DevToolContent {
  id: string;

  /**
   * 文件内容
   */
  content: string;
  /**
   * 编辑器宽度
   * @default 30
   */
  size: number;
}
