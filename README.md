## 创建MCP服务
npx @modelcontextprotocol/create-server mcp-server-flomo


## 进入目录，安装依赖
cd mcp-server-flomo
npm install


## 开启监听实时编译
npm run watch

## MCP 官方开发的一个调试工具
npm run inspector
等价于这个命令 `npx @modelcontextprotocol/inspector build/index.js`

## 启动命令传递参数
node build/index.js --flomo_api_url=https://flomoapp.com/iwh/xxx/xxx/

## 环境变量传递参数
FLOMO_API_URLhttps://flomoapp.com/iwh/MTM4OTM0Mg/3340efa4a1197cb5a87f8542406c675b/ node build/index.js