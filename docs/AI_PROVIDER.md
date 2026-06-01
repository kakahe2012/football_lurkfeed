# AI 大模型选型：千问 vs Kimi

## 推荐结论：**默认使用通义千问 (Qwen)**

| 维度 | 通义千问 (Qwen) | Kimi (Moonshot) |
|------|----------------|-----------------|
| 国内申请 | ✅ 阿里云百炼，实名即可 | ✅ 月之暗面开放平台 |
| 价格 | ⭐ 便宜 (qwen-turbo 极低) | 中等 |
| 英文足球内容 | ✅ 良好 | ✅ 良好 |
| 长文生成 | qwen-plus 32K | moonshot-v1-32k |
| API 兼容性 | OpenAI 兼容 | OpenAI 兼容 |
| 稳定性 | 企业级 | 良好 |

**本项目默认 `AI_PROVIDER=qwen`**，因你在中国运营，千问申请和充值最方便。

如需切换 Kimi，只需改环境变量，无需改代码。

---

## 千问 (推荐) 配置

### 1. 开通

1. [https://bailian.console.aliyun.com](https://bailian.console.aliyun.com)（阿里云百炼）
2. 开通 DashScope 服务
3. **API-KEY 管理** → 创建 Key

### 2. 环境变量

```env
AI_PROVIDER=qwen
DASHSCOPE_API_KEY=sk-xxxxxxxx
QWEN_MODEL=qwen-plus
```

模型选择：

| 模型 | 场景 |
|------|------|
| `qwen-turbo` | 大批量低成本 |
| `qwen-plus` | **推荐** 质量与成本平衡 |
| `qwen-max` | 最高质量 |

### 3. 测试

```bash
curl -X POST http://localhost:3000/api/ai/pipeline \
  -H "Authorization: Bearer dev-admin-secret" \
  -H "Content-Type: application/json" \
  -d '{"topic":"Why England fans suffer every World Cup","emotion":"heartbreak"}'
```

---

## Kimi (备选) 配置

### 1. 开通

1. [https://platform.moonshot.cn](https://platform.moonshot.cn)
2. 注册 → API Keys → 创建

### 2. 环境变量

```env
AI_PROVIDER=kimi
MOONSHOT_API_KEY=sk-xxxxxxxx
MOONSHOT_MODEL=moonshot-v1-8k
```

---

## 费用估算（世界杯高峰期）

假设每天 AI 生成 50 篇文章，每篇约 2000 tokens：

- 千问 qwen-plus：约 ¥5–15 / 天
- Kimi：约 ¥10–25 / 天

建议先用 `qwen-turbo` 测流水线，上线后切 `qwen-plus`。
