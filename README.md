# AI 图像处理 - Web 界面

基于 Next.js 14、TypeScript、daisyUI 4 和 Tailwind CSS 构建的现代化、商业级 AI 图像处理 Web 界面。

## ✨ 核心功能

### 🎯 功能特性
- **12+ AI 服务**: 文档增强、智能抠图、去水印
- **分类管理**: 文档处理、抠图、去水印三大类别
- **智能工作流**: 选择服务 → 上传图片 → 自动处理并实时反馈
- **交互式对比**: 滑块对比 + 左右对比切换
- **一键下载**: 快速导出处理后的图片
- **性能报告**: 实时监控服务性能、GPU使用率和系统状态

### 🎨 用户体验
- **拖拽上传**: 支持拖放和点击选择文件
- **实时状态**: 加载动画、进度提示、清晰的错误信息
- **响应式设计**: 适配移动端、平板和桌面
- **深色模式**: 无缝主题切换，本地存储偏好
- **专业界面**: 卡片式布局，daisyUI 组件

### 🛠 技术优势
- **类型安全**: 完整的 TypeScript 实现
- **现代技术栈**: Next.js 14 App Router
- **自定义主题**: OKLCH 色彩空间，色彩一致鲜艳
- **错误处理**: 全面的验证和友好的错误提示
- **性能优化**: 优化的图片处理和状态管理

## 📋 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript 5
- **样式**: Tailwind CSS 3 + daisyUI 4
- **状态管理**: React Hooks
- **API 客户端**: Fetch API + 错误处理
- **图标**: Heroicons (嵌入式 SVG)

## 📦 环境要求

- **Node.js**: 18.17 或更高版本
- **包管理器**: npm、yarn 或 pnpm
- **后端服务**: AI 图像处理 API 运行在 `http://localhost:5000`
  - 查看 [API_DOCUMENTATION.md](API_DOCUMENTATION.md) 了解后端配置

## 🚀 安装

1. **进入项目目录**:

```bash
cd WEB-UI
```

2. **安装依赖**:

```bash
npm install --legacy-peer-deps
# 或
yarn install
# 或
pnpm install
```

3. **配置环境变量** (已配置):

默认配置文件 `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

如需修改后端地址，请编辑此文件。

## 🏃 开发

启动开发服务器:

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000)。

编辑文件时页面会自动重新加载。

## 🏗 生产构建

```bash
npm run build
npm run start
```

这将在 `.next/` 目录中创建优化的生产构建。

## 📁 项目结构

```
WEB-UI/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # 根布局（Header/Footer）
│   │   ├── page.tsx                # 主页面（服务工作流）
│   │   ├── processing/
│   │   │   └── page.tsx            # 图片处理工作区
│   │   ├── report/
│   │   │   └── page.tsx            # 性能测试报告页面
│   │   └── globals.css             # 全局样式和动画
│   ├── components/
│   │   ├── ThemeToggle.tsx         # 主题切换器
│   │   ├── ServiceSelector.tsx     # 服务分类卡片
│   │   ├── FileUpload.tsx          # 拖拽上传组件
│   │   ├── ImageComparison.tsx     # 前后对比滑块
│   │   └── ProcessingStatus.tsx    # 加载和错误状态
│   ├── lib/
│   │   └── api.ts                  # API 客户端和工具函数
│   └── types/
│       └── index.ts                # TypeScript 类型定义
├── public/                          # 静态资源
├── tailwind.config.ts               # Tailwind 和 daisyUI 自定义主题
├── tsconfig.json                   # TypeScript 配置
├── next.config.js                  # Next.js 配置（含 API 代理）
├── package.json                    # 依赖项
└── .env.local                      # 环境变量
```

## 🎨 可用 AI 服务

### 📄 文档处理
| 服务 | ID | 说明 |
|------|-----|------|
| 一键变清晰 | `print_auto_hq` | 矫正、展平、去阴影、黑底、摩尔纹、模糊 |
| 变清晰 | `print_auto_hq_no_dewarp` | 不矫正的增强处理 |
| 去阴影 | `print_deshadow` | 去除文档阴影 |
| 去黑底 | `print_deblack` | 黑底转白底 |
| 美化增强 | `print_enhance` | 美化文档并加黑文字 |

### ✂️ 智能抠图
| 服务 | ID | 说明 |
|------|-----|------|
| 人像宠物 | `matting_person_pet` | 人像、宠物透明背景 |
| 商品物品 | `matting_stuff` | 商品、物品抠图 |
| 图形Logo | `matting_graphic_logo` | 图形、Logo 提取 |
| 文字印章 | `matting_text_seal` | 文字、印章抠图 |

### 💧 去水印
| 服务 | ID | 说明 |
|------|-----|------|
| 自动 | `watermark_auto` | 自动检测并去除 |
| 自然 | `watermark_nature` | 自然场景优化 |
| 文档 | `watermark_doc` | 文档场景优化 |

## 📊 性能报告页面

性能报告页面 (`/report`) 提供了完整的系统性能监控和分析：

### 功能特性

1. **系统配置概览**
   - CPU、内存、GPU配置
   - Python版本和平台信息
   - 实时系统状态

2. **测试摘要统计**
   - 总服务数和测试服务数
   - 成功率和失败率
   - 平均处理时间和显存使用

3. **分类统计**
   - 按服务类别（文档、抠图、去水印）统计
   - 每个类别的成功率和性能指标
   - 可视化进度条

4. **详细测试结果**
   - 每个服务的处理时间
   - 结果文件大小
   - GPU显存占用
   - 支持筛选和排序

5. **GPU使用详情**
   - 每个服务的显存使用情况
   - GPU利用率和显存利用率
   - 可视化使用率进度条

6. **性能优化建议**
   - 基于实际数据的优化建议
   - 性能瓶颈分析
   - 资源利用率评估

### 交互功能

- **筛选分类**: 按服务类别筛选显示结果
- **排序选项**: 按耗时、显存或名称排序
- **响应式设计**: 适配各种屏幕尺寸
- **实时更新**: 显示当前时间戳

## 🎯 使用指南

### 基本流程

1. **选择 AI 服务**
   - 浏览服务分类（文档、抠图、去水印）
   - 点击服务卡片进行选择
   - 侧边栏显示服务描述

2. **上传图片**
   - 拖拽图片到上传区域
   - 或点击选择文件
   - 支持：JPG、PNG、WEBP（最大 10MB）

3. **自动处理**
   - 上传后自动开始处理
   - 或点击"开始处理"按钮
   - 查看实时处理状态

4. **对比结果**
   - 使用滑块对比前后效果
   - 切换滑块/左右对比视图
   - 缩放查看细节

5. **下载或重试**
   - 点击"下载结果"保存图片
   - 点击"重新处理"使用相同服务
   - 点击"重新开始"上传新图片

### 高级功能

- **主题切换**: 点击顶部太阳/月亮图标
- **服务切换**: 查看结果时可切换不同服务
- **错误恢复**: 点击"重试"按钮重新处理
- **多次尝试**: 同一图片使用不同服务处理

## 🔌 API 集成

前端连接到 Flask 后端 `http://localhost:5000`。

### 使用的端点

| 端点 | 方法 | 用途 |
|------|------|------|
| `/api/health` | GET | 检查服务状态 |
| `/api/services` | GET | 获取可用服务 |
| `/api/process` | POST | 处理单张图片 |

### 请求格式

```typescript
{
  image: "data:image/png;base64,iVBORw0KG...",  // Base64 含 data URI
  service: "print_auto_hq"                       // 服务 ID
}
```

### 响应格式

```typescript
{
  success: true,
  result: "data:image/png;base64,iVBORw0KG...",  // 处理后图片
  service: "print_auto_hq",
  type: "image"
}
```

详见 [API_DOCUMENTATION.md](API_DOCUMENTATION.md)。

## 🎨 自定义

### 主题颜色

自定义 light 主题使用 OKLCH 色彩空间 ([tailwind.config.ts](tailwind.config.ts)):

```typescript
light: {
  "primary": "oklch(66% 0.295 322.15)",      // 紫粉色
  "secondary": "oklch(68% 0.169 237.323)",   // 蓝色
  "accent": "oklch(62% 0.214 259.815)",      // 紫色
  "neutral": "oklch(12% 0.042 264.695)",     // 深灰
  "base-100": "oklch(98% 0.003 247.858)",    // 白色
  // ... 更多颜色
}
```

深色模式使用 daisyUI 内置 `dark` 主题。

### 自定义样式

[src/app/globals.css](src/app/globals.css) 包含:

```css
.alpha-background        /* 透明图片棋盘格背景 */
.dropzone                /* 上传区域样式 */
.image-preview           /* 图片容器样式 */
.scrollbar-thin          /* 自定义滚动条 */
.animate-pulse-slow      /* 慢速脉冲动画 */
```

## ⚠️ 错误处理

应用处理以下情况:

- **后端不可用**: 显示警告横幅
- **无效文件**: 验证类型和大小
- **处理失败**: 显示 API 错误信息和重试选项
- **网络错误**: 捕获并显示连接问题
- **空响应**: 处理缺失或无效的 API 响应

### 常见错误信息

| 错误 | 原因 | 解决方案 |
|------|------|----------|
| "无法连接到 AI 服务" | 后端未运行 | 启动 Flask 后端 (端口 5000) |
| "图片格式不支持" | 文件类型无效 | 使用 JPG、PNG 或 WEBP |
| "文件大小超过 10MB" | 文件过大 | 压缩或调整图片大小 |
| "处理失败" | API 错误 | 检查后端日志，重试 |

## 🌐 浏览器支持

- **Chrome/Edge**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **移动端**: iOS 14+, Android Chrome 90+

## 🚀 性能建议

1. **图片大小**: 保持在 5MB 以下以获得最佳性能
2. **分辨率**: 按需处理，无需最大分辨率
3. **格式**: 尽可能使用 WEBP 以减小文件大小
4. **批量**: 多张图片时建议顺序处理避免过载

## 🐛 故障排除

### 后端连接问题

**症状**: "无法连接到 AI 服务" 警告

**解决方案**:
1. 确保 Flask 后端正在运行: `python start_web_service.py`
2. 检查端口 5000 未被占用
3. 验证后端启用了 CORS
4. 检查 `.env.local` 中的 `NEXT_PUBLIC_API_BASE_URL`

### 构建错误

**症状**: TypeScript 或构建错误

**解决方案**:
```bash
# 检查 lint 错误
npm run lint

# 清理并重新安装
rm -rf node_modules .next
npm install --legacy-peer-deps
npm run build
```

### 主题不持久化

**症状**: 刷新页面后主题重置

**解决方案**:
1. 检查浏览器 localStorage 已启用
2. 清除浏览器缓存和 cookies
3. 尝试无痕/隐私模式

## 🔒 安全注意事项

这是开发/演示应用。生产环境需要:

1. **身份验证**: 添加用户认证 (JWT, OAuth)
2. **速率限制**: 防止 API 滥用
3. **输入验证**: 服务端文件验证
4. **HTTPS**: 生产环境使用 SSL/TLS
5. **API 密钥**: 保护后端端点
6. **CORS**: 限制到特定域名
7. **CSP**: 添加内容安全策略

## 🤝 贡献

本项目遵循 [PLAN.md](PLAN.md) 中的要求:

- ✅ 无需数据库和用户系统
- ✅ 所有功能在前端实现
- ✅ 使用 PLAN.md 中的自定义 OKLCH 主题
- ✅ 支持 daisyUI 深色模式
- ✅ 完整的 API 集成
- ✅ 响应式设计
- ✅ 全面使用 TypeScript

## 📄 许可证

本项目仅用于演示和教育目的。

## 📚 相关文档

- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - 完整 API 参考和集成指南
- [PLAN.md](PLAN.md) - 项目需求和主题规范
- [Next.js 文档](https://nextjs.org/docs) - Next.js 框架文档
- [daisyUI 文档](https://daisyui.com/) - daisyUI 组件库
- [Tailwind 文档](https://tailwindcss.com/) - Tailwind CSS 工具框架

---

**构建技术**: Next.js 14 • TypeScript • daisyUI 4 • Tailwind CSS • ❤️

**版本**: 1.0.0
