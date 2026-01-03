export interface ChatRequest {
  // 必填：当前对话上下文（按 OpenAI 格式）
  messages: Array<{
    role: 'user' | 'assistant' | 'tool';
    content?: string;           // user / assistant 文本
    tool_calls?: Array<{        // assistant 发起的工具调用
      id: string;
      type: 'function';
      function: {
        name: string;          // 工具名，如 "list_indices"
        arguments: string;     // JSON 字符串，如 "{}"
      };
    }>;
    tool_call_id?: string;      // tool 消息必须有此字段
  }>;

  // 可选：指定模型（默认 gpt-4o-mini）
  model?: string;

  // 可选：是否流式响应（MVP 可先不支持）
  stream?: boolean;
}

/*
// 工具调用
{
  "done": false,
  "message": {
    "role": "assistant",
    "tool_calls": [
      {
        "id": "call_2",
        "type": "function",
        "function": {
          "name": "get_mapping",
          "arguments": "{\"index\": \"nginx-2025-12-15\"}"
        }
      }
    ]
  },
  "quota_used": 1,
  "quota_remaining": 98
}
// 最终回复
{
  "done": true,
  "message": {
    "role": "assistant",
    "content": "今天共发现 120 条 ERROR 级别日志。以下是 DSL 查询和图表配置：...",
    "tool_calls": null
  },
  "quota_used": 1,
  "quota_remaining": 97
}
*/
export interface ChatResponse {
  // 是否完成（无 tool_calls 表示最终回答）
  done: boolean;

  // 助手回复（最终回答 or 工具调用指令）
  message: {
    role: 'assistant';
    content?: string;           // 最终自然语言回答（可选）
    tool_calls?: Array<{        // 下一步要调用的工具
      id: string;
      type: 'function';
      function: {
        name: string;
        arguments: string;     // JSON 字符串
      };
    }>;
  };

  // 扣费信息（用于前端显示）
  quota_used: number;          // 本次消耗额度（如 1）
  quota_remaining: number;     // 用户剩余总额度
}

/**
 * 获取支持的全部模型列表
 */
export async function models(): Promise<Array<string>> {
  return []
}

/**
 * 聊天接口
 * @param request 请求参数
 * @return 响应结果
 */
export async function chat(request: ChatRequest): Promise<ChatResponse> {
  return Promise.reject("");
}