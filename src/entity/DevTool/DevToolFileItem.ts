
export interface DevToolFileCreateProp {

  /**
   * 名称
   */
  name: string;

  /**
   * 是否是文件夹
   */
  folder: boolean;

  /**
   * 父ID，没有是空
   */
  parentId: string;

  /**
   * 排序
   */
  sequence?: number;

}

/**
 * 开发者工具 - 文件列表
 */
export interface DevToolFileItem extends  DevToolFileCreateProp {
  id: string;
  createTime: number;
  updateTime: number;
}