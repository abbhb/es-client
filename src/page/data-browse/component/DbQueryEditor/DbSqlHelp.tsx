import { DrawerPlugin, Alert, Paragraph, Text, Title, Table, Link } from "tdesign-vue-next";
import { Constant } from "@/global/Constant";

export function openDbSqlHelp() {
  const columns = [
    {
      title: "函数",
      colKey: "function",
      width: 200
    },
    {
      title: "说明",
      colKey: "description",
      width: 250
    },
    {
      title: "示例",
      colKey: "example"
    }
  ];

  const functionData = [
    {
      function: <Text code>CONCAT(...)</Text>,
      description: "拼接任意数量的字段、字符串或数字",
      example: <Text code>CONCAT(name, ': ', score)</Text>
    },
    {
      function: <Text code>DATE_FORMAT(field, format?)</Text>,
      description: "格式化日期字段（第二个参数可选）",
      example: <Text code>DATE_FORMAT(created_at, '%Y-%m-%d')</Text>
    }
  ];

  const featureColumns = [
    {
      title: "功能",
      colKey: "feature",
      width: 150
    },
    {
      title: "说明",
      colKey: "description"
    }
  ];

  const featureData = [
    {
      feature: "语法高亮",
      description: "关键字、函数、字符串、字段名等自动着色，提升可读性"
    },
    {
      feature: "智能提示",
      description: (
        <>
          <Paragraph>
            - 输入 <Text code>SELECT</Text> 后自动提示<Text strong>字段名</Text>
          </Paragraph>
          <Paragraph>
            - 输入 <Text code>FROM</Text> 后提示<Text strong>可用表名</Text>
          </Paragraph>
          <Paragraph>- 函数名自动补全 + snippet 占位符</Paragraph>
        </>
      )
    },
    {
      feature: "代码折叠",
      description: (
        <>
          每个 <Text code>SELECT</Text> 查询块可折叠/展开，便于浏览长脚本
        </>
      )
    },
    {
      feature: "括号匹配",
      description: (
        <>
          自动高亮匹配的 <Text code>()</Text>，避免语法错误
        </>
      )
    },
    {
      feature: "选区执行",
      description: "选中部分 SQL 后可单独执行（需前端集成）"
    }
  ];

  DrawerPlugin({
    header: () => (
      <div class={"flex gap-8px"}>
        <div>ESQL 编辑器使用说明</div>
        <Link theme={"primary"} target={"_blank"} href={Constant.doc.dataBrowserSql}>
          详细介绍
        </Link>
      </div>
    ),
    placement: "right",
    size: "800px",
    footer: false,
    default: () => (
      <div>
        <Title level="h2" style="margin-bottom: 16px">
          ESQL 编辑器使用说明
        </Title>
        <Paragraph>
          欢迎使用 <Text strong>ESQL 智能编辑器</Text>！本编辑器专为 Elasticsearch
          SQL（ESQL）场景设计，提供语法高亮、智能提示、代码折叠等开发体验，帮助您高效编写和调试查询语句。
        </Paragraph>

        <div style="margin: 24px 0">
          <Title level="h3" style="margin-bottom: 16px">
            支持的 SQL 语法
          </Title>
          <Paragraph>
            当前编辑器支持以下 <Text strong>Elasticsearch SQL 兼容语法</Text>：
          </Paragraph>

          <Title level="h4" style="margin: 16px 0 8px">
            1. 基础查询结构
          </Title>
          <Paragraph>
            <pre style="background: var(--td-bg-color-component); padding: 12px; border-radius: 4px">
              {`SELECT field1, field2
FROM index_name
WHERE condition
ORDER BY field [ASC|DESC]
LIMIT N
OFFSET M`}
            </pre>
          </Paragraph>

          <Title level="h4" style="margin: 16px 0 8px">
            2. 条件操作符
          </Title>
          <ul style="margin-left: 20px; margin-bottom: 16px">
            <li style="margin-bottom: 4px">
              比较：<Text code>=</Text>、<Text code>!=</Text>、<Text code>&lt;&gt;</Text>、
              <Text code>&lt;</Text>、<Text code>&lt;=</Text>、<Text code>&gt;</Text>、
              <Text code>&gt;=</Text>
            </li>
            <li style="margin-bottom: 4px">
              逻辑：<Text code>AND</Text>、<Text code>OR</Text>、<Text code>NOT</Text>
            </li>
            <li style="margin-bottom: 4px">
              空值判断：<Text code>IS NULL</Text>、<Text code>IS NOT NULL</Text>
            </li>
            <li style="margin-bottom: 4px">
              模糊匹配：<Text code>LIKE 'pattern'</Text>（支持 <Text code>%</Text> 和{" "}
              <Text code>_</Text> 通配符）
            </li>
          </ul>

          <Title level="h4" style="margin: 16px 0 8px">
            3. Elasticsearch 特有操作符
          </Title>
          <ul style="margin-left: 20px; margin-bottom: 16px">
            <li style="margin-bottom: 4px">
              <Text code>TERM(field, 'value')</Text>：精确词项匹配（区分大小写）
            </li>
            <li style="margin-bottom: 4px">
              <Text code>MATCH(field, 'query')</Text>：全文检索（分词后匹配）
            </li>
          </ul>

          <Alert theme="warning">
            注意：<Text code>TERM</Text> 和 <Text code>MATCH</Text> 是本编辑器特有函数，
            <Text strong>非标准 SQL</Text>，仅适用于 Elasticsearch 数据源。
          </Alert>
        </div>

        <div style="margin: 24px 0">
          <Title level="h3" style="margin-bottom: 16px">
            内置函数支持
          </Title>
          <Paragraph>
            编辑器对以下函数提供<Text strong>智能补全 + 参数占位符</Text>（按 <Text code>Tab</Text>{" "}
            跳转参数）：
          </Paragraph>

          <Table columns={columns} data={functionData} bordered rowKey="function" />

          <Alert theme="info" style={{ marginTop: "16px" }}>
            输入 <Text code>CONC</Text> 或 <Text code>DATE</Text> 时，会自动提示完整函数模板。
          </Alert>
        </div>

        <div style="margin: 24px 0">
          <Title level="h3" style="margin-bottom: 16px">
            编辑器功能特性
          </Title>
          <Table columns={featureColumns} data={featureData} bordered rowKey="feature" />
        </div>

        <div style="margin: 24px 0">
          <Title level="h3" style="margin-bottom: 16px">
            元数据动态感知
          </Title>
          <Paragraph>
            编辑器会<Text strong>自动连接您的数据源</Text>，动态获取：
          </Paragraph>
          <ul style="margin-left: 20px; margin-bottom: 16px">
            <li style="margin-bottom: 4px">
              所有可用的 <Text strong>表名（索引名）</Text>
            </li>
            <li style="margin-bottom: 4px">
              每张表的 <Text strong>字段列表（mapping 字段）</Text>
            </li>
          </ul>

          <Alert theme="success" title={"这意味着："}>
            <ul style="margin-left: 20px">
              <li style="margin-bottom: 4px">
                在 <Text code>FROM</Text> 后输入时，会列出所有索引；
              </li>
              <li style="margin-bottom: 4px">
                在 <Text code>SELECT</Text> 或 <Text code>WHERE</Text>{" "}
                中输入字段时，仅显示当前表的有效字段。
              </li>
            </ul>
          </Alert>
        </div>

        <div style="margin: 24px 0">
          <Title level="h3" style="margin-bottom: 16px">
            使用限制与注意事项
          </Title>
          <ol style="margin-left: 20px; margin-bottom: 16px">
            <li style="margin-bottom: 12px">
              <Text strong>不支持 DDL 语句</Text>
              <br />
              本编辑器<Text strong>仅用于查询（DQL）</Text>，不支持 <Text code>CREATE</Text>、
              <Text code>DROP</Text>、<Text code>ALTER</Text>、<Text code>TRUNCATE</Text> 等操作。
            </li>
            <li style="margin-bottom: 12px">
              <Text strong>单语句为主</Text>
              <br />
              虽然支持多条 SQL（用 <Text code>;</Text> 分隔），但
              <Text strong>
                智能提示和折叠以单条 <Text code>SELECT</Text> 为单位
              </Text>
              。复杂脚本建议拆分为多个查询。
            </li>
            <li style="margin-bottom: 12px">
              <Text strong>字段名大小写敏感</Text>
              <br />
              Elasticsearch 字段名通常为小写，建议使用反引号包裹含特殊字符的字段：
              <br />
              <pre style="background: var(--td-bg-color-component); padding: 12px; border-radius: 4px; margin-top: 8px">
                {`SELECT \`user.name\`, \`@timestamp\` FROM logs;`}
              </pre>
            </li>
            <li style="margin-bottom: 12px">
              <Text strong>函数参数校验有限</Text>
              <br />
              编辑器提供提示，但<Text strong>不验证函数参数合法性</Text>（如{" "}
              <Text code>DATE_FORMAT</Text> 的格式字符串是否有效），请以 Elasticsearch
              实际执行结果为准。
            </li>
            <li style="margin-bottom: 12px">
              <Text strong>不支持 JOIN / 子查询</Text>
              <br />
              当前版本仅支持单表查询。Elasticsearch 官方 ESQL 对 JOIN 支持有限，请参考{" "}
              <Link
                href="https://www.elastic.co/guide/en/elasticsearch/reference/current/esql.html"
                target="_blank"
                theme="primary"
              >
                ESQL 官方文档
              </Link>
              。
            </li>
          </ol>
        </div>

        <div style="margin: 24px 0">
          <Title level="h3" style="margin-bottom: 16px">
            使用技巧
          </Title>
          <ul style="margin-left: 20px; margin-bottom: 16px">
            <li style="margin-bottom: 8px">
              <Text strong>快速插入函数</Text>：输入 <Text code>conc</Text> 按{" "}
              <Text code>Enter</Text> 自动生成{" "}
              <Text code>
                CONCAT({"${1}"}, {"${2}"})
              </Text>
              ，按 <Text code>Tab</Text> 切换参数。
            </li>
            <li style="margin-bottom: 8px">
              <Text strong>查看字段类型</Text>：将鼠标悬停在字段名上（未来可扩展 hover 提示）。
            </li>
            <li style="margin-bottom: 8px">
              <Text strong>折叠长查询</Text>：点击行号左侧的 ️ 可收起整个 <Text code>SELECT</Text>{" "}
              块。
            </li>
            <li style="margin-bottom: 8px">
              <Text strong>执行选中内容</Text>：选中部分 SQL 后点击"运行选中"按钮（需前端实现）。
            </li>
          </ul>
        </div>

        <div style="margin: 24px 0">
          <Title level="h3" style="margin-bottom: 16px">
            技术栈说明
          </Title>
          <ul style="margin-left: 20px; margin-bottom: 16px">
            <li style="margin-bottom: 4px">
              基于 <Text strong>Monaco Editor</Text>（VS Code 同款编辑器内核）
            </li>
            <li style="margin-bottom: 4px">语法解析：自定义 AST + 启发式上下文分析</li>
            <li style="margin-bottom: 4px">
              元数据来源：通过 <Text code>listTableNames()</Text> 和{" "}
              <Text code>getFields(tableName)</Text> 接口动态加载
            </li>
          </ul>

          <Alert theme="info" title={"如有建议或遇到问题，请联系开发团队。"}>
            编辑器将持续优化，后续将支持：错误诊断、聚合函数提示、字段类型 hover 等功能。
          </Alert>
        </div>
      </div>
    )
  });
}
