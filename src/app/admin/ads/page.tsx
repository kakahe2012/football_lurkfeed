import { adminStyles } from "@/components/admin/admin-styles";

const PLACEMENTS = [
  { name: "Feed 原生广告", placement: "feed", frequency: "每 8 篇故事插入 1 条", rpm: 4.8 },
  { name: "文章内嵌广告", placement: "inline", frequency: "阅读至 50% 深度触发", rpm: 5.2 },
  { name: "移动端底部悬浮", placement: "sticky", frequency: "移动端始终展示", rpm: 3.1 },
  { name: "赞助推荐卡片", placement: "sponsored", frequency: "相关推荐区域", rpm: 6.0 },
];

export default function AdminAdsPage() {
  return (
    <div>
      <h1 className={adminStyles.pageTitle}>广告管理</h1>
      <p className={adminStyles.pageDesc}>Google AdSense 广告位与 RPM 监控</p>

      <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        配置 <code className="font-mono">NEXT_PUBLIC_ADSENSE_CLIENT</code> 及各 Slot ID 后生效。申请指南见{" "}
        <code className="font-mono">docs/SETUP_ADSENSE_GA4.md</code>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {PLACEMENTS.map((p) => (
          <div key={p.placement} className={adminStyles.card}>
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">{p.name}</h3>
              <span className={adminStyles.badgeGreen}>已启用</span>
            </div>
            <p className="mt-2 text-sm text-gray-500">{p.frequency}</p>
            <p className="mt-3 text-xl font-semibold text-gray-900">${p.rpm} RPM</p>
          </div>
        ))}
      </div>
    </div>
  );
}
