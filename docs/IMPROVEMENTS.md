# 网站复盘：可快速完善项

## ✅ 本次已完成

- [x] 千问/Kimi 双模型 AI（默认千问）
- [x] Cloudflare R2 封面上传
- [x] GA4 + AdSense 脚本集成
- [x] 增强分析（来源、UTM、滚动深度）
- [x] 后台文章列表 + 详情 + PV/来源统计
- [x] Supabase 迁移 002 + 种子数据
- [x] Vercel + Cloudflare 部署文档

---

## 🔴 上线前必做（1–2 天）

| 优先级 | 项目 | 说明 |
|--------|------|------|
| P0 | 配置 Supabase + 执行迁移 | 见 `SETUP_SUPABASE.md` |
| P0 | 配置千问 API Key | 见 `AI_PROVIDER.md` |
| P0 | 部署 Vercel + 绑定域名 | 见 `DEPLOYMENT.md` |
| P0 | 修改 `ADMIN_SECRET` | 生产环境禁用默认密码 |
| P1 | 隐私政策页 `/privacy` | AdSense 审核必需 |
| P1 | 发布 15+ 篇文章 | 提高 AdSense 通过率 |
| P1 | 申请 AdSense + GA4 | 见 `SETUP_ADSENSE_GA4.md` |

---

## 🟡 快速完善（每项 2–4 小时）

### 内容与体验

1. **退出意图弹窗** — 用户离开前推荐「最悲情足球故事」续读
2. **Emotion 筛选标签** — Feed 顶部可点 💔🔥👑 过滤（提升会话深度）
3. **分享卡片 OG 优化** — 每篇文章生成专属社交分享图（Canvas API）
4. **多语言** — 先加西班牙语/葡萄牙语（世界杯拉美流量）

### AI 量产

5. **定时发布 Cron** — Vercel Cron 每天自动 topic_hunt + 生成 5 篇
6. **DashScope 万相文生图** — 用 AI 生成真实封面替代 Unsplash
7. **热点源接入** — Reddit API / Google Trends RSS 自动喂给 Topic Hunter

### 商业化

8. **Affiliate 链接** — 球衣、球票联盟营销（比纯 AdSense 更早变现）
9. **Email 订阅** — 「世界杯每日一封悲情故事」留资
10. **AdSense 广告位 Slot** — 填入三个 Slot ID 启用真实广告

### 技术

11. **Admin 登录** — Supabase Auth 保护 `/admin`（目前仅靠 Bearer Token）
12. **图片 next/image 全走 R2** — 配置 `images.remotePatterns` 加 R2 域名
13. **速率限制** — AI Pipeline API 加 rate limit 防滥用
14. **错误监控** — Sentry 接入

---

## 🟢 中期增长（1–2 周）

- Pinterest/TikTok 自动分发 Agent
- A/B 标题测试（记录 CTR 最高的 headline variant）
- 用户情绪画像持久化（localStorage → Supabase）
- World Cup 2026 实时赛程情绪文章（赛事触发自动生成）
- PWA 支持（添加到主屏幕）

---

## 数据指标目标（世界杯期间）

| 指标 | 目标 |
|------|------|
| Pages/Session | > 3.5 |
| Avg Scroll Depth | > 65% |
| RPM | > $4 |
| 日 PV | 50K+（第 2 周） |

后台 `/admin/articles` 和 `/admin/analytics` 追踪这些指标。
