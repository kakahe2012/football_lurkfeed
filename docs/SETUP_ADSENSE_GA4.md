# Google AdSense + GA4 申请与绑定指南

## 一、Google AdSense 账号申请

### 前置条件

- 已有 **Google 账号**
- 网站已部署并可公网访问（Vercel 域名或自定义域名）
- 网站有足够原创内容（建议至少 15–20 篇文章后再申请，通过率更高）
- 有隐私政策页面（见下方快速补充）

### 申请步骤

1. 打开 [https://www.google.com/adsense](https://www.google.com/adsense)
2. 点击 **开始使用** / **Sign up**
3. 填写网站 URL（例如 `https://your-domain.com`）
4. 选择收款国家/地区（影响收款方式，中国用户可选香港或支持 Adsense 的地区）
5. 填写收款信息（AdSense 审核通过后才需完善）
6. 在网站 `<head>` 中插入 AdSense 代码 — **本项目已自动处理**：

   配置环境变量即可：
   ```env
   NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-xxxxxxxxxxxxxxxx
   ```

7. 等待审核（通常 1–14 天，世界杯前建议提前 4 周申请）

### 审核常见拒绝原因

| 原因 | 解决方案 |
|------|----------|
| 内容不足 | 先发布 20+ 篇 AI 文章 |
| 无隐私政策 | 添加 `/privacy` 页面 |
| 导航不清晰 | 已有 Logo + 搜索，保持简洁即可 |
| 无效流量 | 不要用点击农场 |
| 版权问题 | AI 改写 + 原创情绪包装 |

### 创建广告单元（审核通过后）

1. AdSense 后台 → **广告** → **按广告单元**
2. 创建以下单元并记录 **Slot ID**：

| 单元名称 | 类型 | 环境变量 |
|----------|------|----------|
| Feed Native | 展示广告 | `NEXT_PUBLIC_ADSENSE_SLOT_FEED` |
| Article Inline | 文章内嵌 | `NEXT_PUBLIC_ADSENSE_SLOT_INLINE` |
| Mobile Sticky | 锚定广告 | `NEXT_PUBLIC_ADSENSE_SLOT_STICKY` |

3. 填入 Vercel 环境变量并重新部署

### 收款绑定

1. AdSense → **付款** → **付款信息**
2. 添加收款方式：
   - **西联汇款** / **银行电汇**（部分国家）
   - 或关联 **Payoneer / PingPong** 等第三方（中国开发者常用）
3. 达到 $100 最低付款门槛后按月结算

---

## 二、Google Analytics 4 (GA4)

### 创建媒体资源

1. 打开 [https://analytics.google.com](https://analytics.google.com)
2. **管理** → **创建媒体资源**
3. 名称：`Feel Football`
4. 选择 **网站** 数据流
5. 输入网站 URL
6. 复制 **衡量 ID**（格式 `G-XXXXXXXXXX`）

### 绑定到项目

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

部署后 GA4 会自动接收页面浏览。自定义事件（scroll_depth、share）通过本站 `/api/analytics` 写入 Supabase，可与 GA4 并行分析。

### 关联 AdSense（推荐）

GA4 → **管理** → **产品关联** → **AdSense 关联**

可在 GA4 中直接查看广告收益与内容表现。

---

## 三、部署后检查清单

- [ ] 网站 HTTPS 可访问
- [ ] `NEXT_PUBLIC_ADSENSE_CLIENT` 已配置
- [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID` 已配置
- [ ] 隐私政策页可访问
- [ ] robots.txt 未屏蔽 Googlebot
- [ ] 至少 15 篇已发布文章
