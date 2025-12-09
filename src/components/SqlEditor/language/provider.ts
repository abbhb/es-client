import * as monaco from 'monaco-editor';

interface CompletionContext {
  listTableNames: () => Promise<string[]>;
  getFields: (tableName: string) => Promise<string[]>;
}

type PositionContext =
  | { type: 'unknown' }
  | { type: 'from' }
  | { type: 'select_field' | 'where_field' | 'order_by_field'; table: string };

export function createESQLCompletionProvider(ctx: CompletionContext): monaco.languages.CompletionItemProvider {
  return {
    provideCompletionItems: async (model, position) => {
      const word = model.getWordAtPosition(position);
      const currentWord = word ? word.word : '';

      // 获取当前行和前文（用于上下文分析）
      const lineContent = model.getLineContent(position.lineNumber).slice(0, position.column - 1);
      const fullTextUpToCursor = model.getValueInRange({
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column
      });

      // 尝试从 SQL 中提取 FROM 的表名（简化版，不依赖完整 AST）
      const table = extractTableNameFromSQL(fullTextUpToCursor);

      // 判断当前上下文
      const context = determineContext(lineContent, table);

      const suggestions: monaco.languages.CompletionItem[] = [];

      // 1. 提示关键字
      const KEYWORDS = [
        'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'AS', 'ORDER', 'BY',
        'LIMIT', 'OFFSET', 'IS', 'NOT', 'NULL', 'LIKE', 'TERM', 'MATCH'
      ];
      for (const kw of KEYWORDS) {
        if (kw.toLowerCase().startsWith(currentWord.toLowerCase())) {
          suggestions.push({
            label: kw,
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: kw,
            range: wordRange(word, position),
          });
        }
      }

      // 2. 提示函数（带 snippet）
      const FUNCTIONS = [
        { name: 'CONCAT', snippet: 'CONCAT(${1:field1}, ${2:\'string\'})', detail: 'Concatenate values' },
        { name: 'DATE_FORMAT', snippet: 'DATE_FORMAT(${1:field}, ${2:\'%Y-%m-%d\'})', detail: 'Format date field' }
      ];
      for (const fn of FUNCTIONS) {
        if (fn.name.toLowerCase().startsWith(currentWord.toLowerCase())) {
          suggestions.push({
            label: `${fn.name}(...)`,
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: fn.snippet,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: fn.detail,
            range: wordRange(word, position),
          });
        }
      }

      // 3. 根据上下文提示表名或字段名
      if (context.type === 'from') {
        // FROM 后提示表名
        const tables = await ctx.listTableNames();
        for (const table of tables) {
          if (table.toLowerCase().startsWith(currentWord.toLowerCase())) {
            suggestions.push({
              label: table,
              kind: monaco.languages.CompletionItemKind.Class, // 表用 Class 图标
              insertText: table,
              range: wordRange(word, position),
            });
          }
        }
      } else if (
        context.type === 'select_field' ||
        context.type === 'where_field' ||
        context.type === 'order_by_field'
      ) {
        // SELECT / WHERE / ORDER BY 中提示字段
        if (context.table) {
          const fields = await ctx.getFields(context.table);
          for (const field of fields) {
            if (field.toLowerCase().startsWith(currentWord.toLowerCase())) {
              suggestions.push({
                label: field,
                kind: monaco.languages.CompletionItemKind.Field,
                insertText: field,
                range: wordRange(word, position),
              });
            }
          }
        }
      }

      return { suggestions };
    }
  };
}

// ========================
// 辅助函数
// ========================

function wordRange(word: monaco.editor.IWordAtPosition | null, pos: monaco.Position) {
  if (word) {
    return {
      startLineNumber: pos.lineNumber,
      startColumn: word.startColumn,
      endLineNumber: pos.lineNumber,
      endColumn: word.endColumn
    };
  }
  return {
    startLineNumber: pos.lineNumber,
    startColumn: pos.column,
    endLineNumber: pos.lineNumber,
    endColumn: pos.column
  };
}

// 简化版：从 SQL 片段中提取 FROM 后的表名（不处理 JOIN/子查询）
function extractTableNameFromSQL(sql: string): string | null {
  // 移除注释和字符串干扰（简化）
  const cleanSQL = sql
    .replace(/--.*$/gm, '')
    .replace(/\/\/.*$/gm, '')
    .replace(/'.*?'/g, '""')
    .replace(/`.*?`/g, '""');

  const fromMatch = cleanSQL.match(/from\s+([a-zA-Z_][a-zA-Z0-9_]*)/i);
  return fromMatch ? fromMatch[1] : null;
}

// 判断当前光标位置的上下文
function determineContext(linePrefix: string, table: string | null): PositionContext {
  const upperLine = linePrefix.trim().toUpperCase();

  // FROM 后（且无表名）
  if (/FROM\s*$/.test(upperLine)) {
    return { type: 'from' };
  }

  // SELECT 字段列表中
  if (/SELECT\s+(?!FROM)/.test(upperLine) && !/FROM\s/.test(upperLine)) {
    return table ? { type: 'select_field', table } : { type: 'unknown' };
  }

  // WHERE 条件中
  if (upperLine.includes('WHERE ')) {
    return table ? { type: 'where_field', table } : { type: 'unknown' };
  }

  // ORDER BY 后
  if (upperLine.includes('ORDER BY ')) {
    return table ? { type: 'order_by_field', table } : { type: 'unknown' };
  }

  return { type: 'unknown' };
}