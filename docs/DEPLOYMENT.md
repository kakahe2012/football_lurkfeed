# 部署指南：Vercel + Cloudflare CDN + R2

## 架构

```
用户 → Cloudflare CDN (DNS + 缓存) → Vercel (Next.js SSR) → Supabase (DB)
                                              ↓
                                        Cloudflare R2 (图片)
```

## 一、部署到 Vercel

### 1. 推送代码到 GitHub

```bash
git init
git add .
git commit -m "Feel Football platform"
git remote add origin https://github.com/YOUR_USER/feel-football.git
git push -u origin main
```

### 2. 导入 Vercel

1. [https://vercel.com](https://vercel.com) → **Add New Project**
2. 导入 GitHub 仓库
3. Framework: **Next.js**（自动检测）
4. 配置 **Environment Variables**（从 `.env.example` 复制全部）

### 3. 必配环境变量

```
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
DASHSCOPE_API_KEY=...
AI_PROVIDER=qwen
ADMIN_SECRET=强密码
R2_* (见下方)
NEXT_PUBLIC_GA_MEASUREMENT_ID=...
NEXT_PUBLIC_ADSENSE_CLIENT=...
```

### 4. 部署

点击 Deploy，完成后获得 `xxx.vercel.app` 域名。

---

## 二、Cloudflare CDN（自定义域名）

### 1. 添加站点

1. [https://dash.cloudflare.com](https://dash.cloudflare.com) → **Add a Site**
2. 输入你的域名，选择 Free 计划
3. 按提示将域名 NS 记录改为 Cloudflare 提供的 nameserver

### 2. DNS 指向 Vercel

| 类型 | 名称 | 内容 |
|------|------|------|
| CNAME | `@` 或 `www` | `cname.vercel-dns.com` |

在 Vercel 项目 **Settings → Domains** 添加同一域名。

### 3. 缓存优化

Cloudflare → **Caching** → **Configuration**：

- Browser Cache TTL: 4 hours
- Always Online: On

**Page Rules**（可选）：

- `*yourdomain.com/story/*` → Cache Level: Standard, Edge TTL 1 hour

### 4. SSL

Cloudflare SSL 模式选 **Full (strict)**。

---

## 三、Cloudflare R2 图片存储

### 1. 创建 Bucket

1. Cloudflare Dashboard → **R2** → **Create bucket**
2. 名称：`feel-football`
3. 开启 **Public access** 或配置 Custom Domain

### 2. 创建 API Token

R2 → **Manage R2 API Tokens** → Create：

- Object Read & Write
- 记录 Access Key ID 和 Secret

### 3. 公共访问 URL

R2 → Bucket → **Settings** → **Public URL** 或绑定自定义域名：

```
R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
```

### 4. 环境变量

```env
R2_ACCOUNT_ID=你的账户ID
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=feel-football
R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
```

AI 生成文章时封面图会自动上传到 `covers/{slug}.jpg`。

---

## 四、部署后验证

```bash
curl https://your-domain.com/api/feed
curl -H "Authorization: Bearer YOUR_ADMIN_SECRET" https://your-domain.com/api/admin/config
```

访问 `/admin/articles` 确认文章列表与统计正常。
