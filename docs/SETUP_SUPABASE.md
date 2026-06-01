# Supabase 配置指南

## 1. 创建项目（5 分钟）

1. 打开 [https://supabase.com](https://supabase.com) 注册/登录
2. 点击 **New Project**
3. 填写：
   - Name: `feel-football`
   - Database Password: 保存好（勿丢失）
   - Region: 选离用户最近的（全球流量可选 `Singapore` 或 `Frankfurt`）
4. 等待项目创建完成（约 2 分钟）

## 2. 获取 API 密钥

进入 **Project Settings → API**：

| 变量 | 位置 |
|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role（仅服务端，勿暴露到前端）|

复制到 `.env.local`。

## 3. 执行 SQL 迁移

进入 **SQL Editor**，按顺序执行：

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_analytics_enhanced.sql`
3. `supabase/seed.sql`（可选，导入 8 篇示例文章）

或使用 Supabase CLI：

```bash
npm install -g supabase
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

## 4. 验证

```bash
npm run dev
```

访问 http://localhost:3000/admin/articles — 应能看到种子文章及 PV 数据。

## 5. RLS 说明

- 前台用户：只能读取 `publish_status = published` 的文章
- 后台 API：使用 `SUPABASE_SERVICE_ROLE_KEY` 绕过 RLS 进行写入

## 6. 生产环境

在 Vercel 项目 Settings → Environment Variables 中配置相同的三个 Supabase 变量。
