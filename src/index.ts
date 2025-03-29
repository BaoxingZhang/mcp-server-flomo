#!/usr/bin/env node

/**
 * 这是一个实现简单笔记系统的MCP服务器模板。
 * 它通过以下功能展示了MCP的核心概念，如资源和工具：
 * - 将笔记列为资源
 * - 读取单个笔记
 * - 通过工具创建新笔记
 * - 通过提示总结所有笔记
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { FlomoClient } from "./flomo.js";


/**
 * 创建一个具有资源能力（用于列出/读取笔记）、
 * 工具（用于创建新笔记）和提示（用于总结笔记）的MCP服务器。
 */
const server = new Server(
  {
    name: "mcp-server-flomo",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * 列出可用工具的处理程序。
 * 公开一个"write_note"工具，让客户端向flomo写入支持markdown格式的笔记。
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "write_note",
        description: "Write note to flomo",
        inputSchema: {
          type: "object",
          properties: {
            content: {
              type: "string",
              description: "Text content of the note with markdown format",
            },
          },
          required: ["content"],
        },
      },
    ],
  };
});


/**
 * 解析命令行参数
 * 
 * 示例：node index.js --flomo_api_url=https://flomoapp.com/iwh/xxx/xxx/
*/
function parseArgs() {
  const args: Record<string, string> = {};
  process.argv.slice(2).forEach((arg) => {
    if (arg.startsWith("--")) {
      const [key, value] = arg.slice(2).split("=");
      args[key] = value;
    }
  });
  return args;
}

const args = parseArgs();
const apiUrl = args.flomo_api_url || process.env.FLOMO_API_URL || "";


/**
 * create_note工具的处理程序。
 * 使用提供的标题和内容创建新笔记，并返回成功消息。
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "write_note": {
      if (!apiUrl) {
        throw new Error("Flomo API URL not set");
      }

      const content = String(request.params.arguments?.content);
      if (!content) {
        throw new Error("Content is required");
      }

     
      const flomo = new FlomoClient({ apiUrl });
      const result = await flomo.writeNote({ content });

      if (!result.memo || !result.memo.slug) {
        throw new Error(
          `Failed to write note to flomo: ${result?.message} || "unknown error"`
        );
      }

      const flomoUrl = `https://v.flomoapp.com/mine/?memo_id=${result.memo.slug}`;

      return {
        content: [
          {
            type: "text",
            text: `Write note to flomo success:  view it at ${flomoUrl}`,
          },
        ],
      };
    }
    default:
      throw new Error("Unknown tool");
  }
});


/**
 * 使用stdio传输启动服务器。
 * 这允许服务器通过标准输入/输出流进行通信。
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
