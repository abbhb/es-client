import * as monaco from 'monaco-editor';

export const restFoldingRangeProvider: monaco.languages.FoldingRangeProvider = {
  provideFoldingRanges: (
    model: monaco.editor.ITextModel,
    context: monaco.languages.FoldingContext,
    token: monaco.CancellationToken
  ): monaco.languages.FoldingRange[] => {
    const ranges: monaco.languages.FoldingRange[] = [];
    const lineCount = model.getLineCount();
    let i = 1;

    while (i <= lineCount) {
      const lineText = model.getLineContent(i).trim();

      // 忽略空行和注释
      if (lineText === '' || lineText.startsWith('--') || lineText.startsWith('//')) {
        i++;
        continue;
      }

      // 检查是否以 SELECT 开头（不区分大小写）
      if (/^\s*select\b/i.test(lineText)) {
        const startLine = i;

        // 向下查找结束位置
        let endLine = i;
        let hasSeenSemicolon = false;

        for (let j = i + 1; j <= lineCount; j++) {
          const nextLine = model.getLineContent(j).trim();

          // 如果遇到空行或新 SELECT，结束当前块
          if (nextLine === '' || nextLine.startsWith('--') || nextLine.startsWith('//')) {
            // 空行：如果已看到分号，则在此结束；否则继续（容忍空行）
            if (hasSeenSemicolon) {
              break;
            }
            // 否则跳过空行
            continue;
          }

          if (/^\s*select\b/i.test(nextLine)) {
            // 下一个 SELECT，当前块结束于上一行
            endLine = j - 1;
            break;
          }

          // 检查是否包含分号
          if (nextLine.includes(';')) {
            hasSeenSemicolon = true;
            // 分号后如果有非空内容，继续；否则可结束
            const afterSemicolon = nextLine.split(';')[1]?.trim();
            if (afterSemicolon === '') {
              // 分号在行尾，且后面无内容 → 可能是结束
              endLine = j;
              // 继续看下一行是否为空/新语句
              continue;
            }
          }

          endLine = j;
        }

        // 确保至少折叠两行
        if (endLine > startLine) {
          ranges.push({
            start: startLine - 1, // Monaco 行号从 0 开始
            end: endLine - 1,
            kind: monaco.languages.FoldingRangeKind.Region
          });
        }

        // 跳到结束行之后
        i = endLine + 1;
      } else {
        i++;
      }
    }

    return ranges;
  }
};