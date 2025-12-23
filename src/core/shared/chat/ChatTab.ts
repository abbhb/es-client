export type ChatTabType =
  'rest-editor'
  | 'table'
  | 'echarts'
  | 'json'
  | 'settings';

interface ChatTab {
  id: string;                // 唯一 ID（如 'tab_abc123'）
  type: ChatTabType;         // 类型：'rest-editor' | 'table' | 'echarts' | 'json' | 'settings' ...
  title: string;             // 显示名称（如 "错误趋势 (Chart)"）

  // --- 核心关联字段 ---
  sourceTabId?: string;      // 【谁创建了我】—— 指向父 tab（如 REST 编辑器 ID）
  derivedTabIds?: string[];  // 【我创建了谁】—— 子 tab 列表（如执行后生成的表格/图表 ID）

  // --- 元信息 ---
  createdAt: number;         // 创建时间（用于自动清理或排序）
  isPinned?: boolean;        // 是否固定（防止被自动关闭）
}