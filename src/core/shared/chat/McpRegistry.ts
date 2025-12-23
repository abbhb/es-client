import {isTauri} from "@tauri-apps/api/core"

export type MCP = {
  name: string;
  description: string;
  // JSON Schema
  parameters: Record<string, any>;
  // 可选平台限制
  platform?: 'browser' | 'tauri' | 'all';
  // 标记为元数据查询
  isQuery: boolean;
};

// mcpRegistry.ts
export const mcpRegistry: Record<string, MCP> = {
  // 元数据查询型（不创建标签，结果缓存）
  get_index_list: {
    name: "get_index_list",
    description: "获取所有可用索引列表（含文档数、字段数）",
    parameters: {},
    platform: "all",
    isQuery: true
  },
  get_mapping: {
    name: "get_mapping",
    description: "获取指定索引的 mapping 结构",
    parameters: {index: {type: "string", required: true}},
    platform: "all",
    isQuery: true
  },

  // 结果渲染型（创建/更新标签）
  table: {
    name: "table",
    description: "以表格形式展示查询结果",
    parameters: {
      dsl: {type: "object", required: true},
      index: {type: "string", required: true},
      tabStrategy: { // 关键：AI 控制标签行为
        type: "string",
        enum: ["new", "reuse", "reuse-if-same-type"],
        default: "reuse-if-same-type"
      }
    },
    platform: "all",
    isQuery: false
  },
  chart: {
    name: "chart",
    description: "生成 ECharts 图表",
    parameters: {
      dsl: {type: "object", required: true},
      index: {type: "string", required: true},
      chartType: {type: "string", enum: ["line", "bar", "pie"]},
      tabStrategy: {
        type: "string",
        enum: ["new", "reuse", "reuse-if-same-type"],
        default: "reuse-if-same-type"
      }
    },
    platform: "all",
    isQuery: false
  }
};

// 根据当前平台过滤
const currentPlatform = isTauri() ? 'tauri' : 'browser';
const availableTools = Object.values(mcpRegistry)
  .filter(mcp => !mcp.platform || mcp.platform === currentPlatform || mcp.platform === 'all');

// 构造 OpenAI-style tools
const tools = availableTools.map(mcp => ({
  type: "function",
  function: {
    name: mcp.name,
    description: mcp.description,
    parameters: mcp.parameters
  }
}));