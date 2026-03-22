# Lens Notes

一个面向个人使用的照片笔记博客系统，基于 Next.js App Router、Tailwind CSS 和 Supabase 构建。

当前版本已经具备这些能力：

- 首页按两大模块展示内容
- 照片内容使用瀑布流展示
- 手记内容使用独立阅读区展示
- 照片详情页和手记详情页采用不同排版
- 后台支持登录、发布、编辑、删除、批量删除
- 图片上传到 Supabase Storage
- 上传照片时尝试自动读取 EXIF 参数

## 技术栈

- Next.js 16
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase Postgres
- Supabase Storage

## 本地开发

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

## 环境变量

先复制环境变量模板：

```bash
cp .env.example .env.local
```

需要填写：

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

说明：

- `NEXT_PUBLIC_SUPABASE_ANON_KEY` 用于前端和 SSR 公共访问
- `NEXT_PUBLIC_SITE_URL` 用于 sitemap、robots 和 metadata 中生成正式链接
- `SUPABASE_SERVICE_ROLE_KEY` 只能放服务端，不能暴露到浏览器

## Supabase 初始化

第一次初始化项目时，在 Supabase SQL Editor 执行：

- [`supabase/schema.sql`](/Users/wzyth/Documents/wzycodex/web/supabase/schema.sql)

如果你已经执行过早期版本的 `schema.sql`，还需要再执行这份增量迁移：

- [`supabase/2026-03-23-entry-types.sql`](/Users/wzyth/Documents/wzycodex/web/supabase/2026-03-23-entry-types.sql)

执行完成后请确认：

- `notes` 表存在
- `photos` 表存在
- `uploads` bucket 已创建

## 内容模型

系统现在支持两种内容类型：

### 1. 照片

主要字段：

- 标题
- 摘要
- 照片说明
- 地名
- 拍摄时间
- 相机
- 光圈
- 快门
- ISO
- 多张照片

展示方式：

- 首页瀑布流
- 照片详情页

### 2. 手记

主要字段：

- 标题
- 摘要
- Markdown 正文
- 可选地名
- 多张配图

展示方式：

- 首页手记阅读区
- 手记详情页

## 登录说明

后台登录使用的是 Supabase Auth 用户，不是你登录 Supabase 控制台本身的账号。

如果需要后台管理员账号，请在 Supabase 控制台中创建 Email/Password 用户，然后使用该用户登录：

- `/auth/sign-in`

## 主要路由

- `/` 首页
- `/notes/[slug]` 内容详情页
- `/admin` 内容管理页
- `/admin/new` 新建内容
- `/admin/edit/[id]` 编辑内容
- `/auth/sign-in` 登录页

## 当前后台能力

- 发布照片
- 发布手记
- 保存草稿
- 发布内容
- 编辑已有内容
- 删除单条内容
- 批量删除内容
- 图片排序
- 设置封面
- 自动读取首张照片 EXIF 参数

## 部署到 Vercel

1. 将项目推送到 GitHub
2. 在 Vercel 导入该仓库
3. 配置与 `.env.local` 相同的环境变量
4. 确保 Supabase SQL 已执行完成
5. 重新部署

## 验证命令

```bash
npm run lint
npm run build
```

当前这两个命令都应通过。
