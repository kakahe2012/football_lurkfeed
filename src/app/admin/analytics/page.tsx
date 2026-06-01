import { adminStyles, EMOTION_LABELS_ZH } from "@/components/admin/admin-styles";

const EMOTION_STATS = [
  { emotion: "heartbreak", views: 420000, rpm: 5.1, scrollDepth: 78 },
  { emotion: "hype", views: 380000, rpm: 4.2, scrollDepth: 65 },
  { emotion: "icons", views: 510000, rpm: 6.2, scrollDepth: 72 },
  { emotion: "secrets", views: 290000, rpm: 4.8, scrollDepth: 81 },
  { emotion: "culture", views: 340000, rpm: 3.9, scrollDepth: 70 },
  { emotion: "easy_football", views: 620000, rpm: 5.5, scrollDepth: 85 },
];

export default function AdminAnalyticsPage() {
  return (
    <div>
      <h1 className={adminStyles.pageTitle}>数据分析</h1>
      <p className={adminStyles.pageDesc}>按情绪类型查看浏览、RPM 与滚动深度（接入 Supabase 后显示实时数据）</p>

      <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className={adminStyles.table}>
          <thead>
            <tr className={adminStyles.tableHead}>
              <th className="p-4 font-medium">情绪类型</th>
              <th className="p-4 font-medium">浏览量</th>
              <th className="p-4 font-medium">RPM</th>
              <th className="p-4 font-medium">平均滚动深度</th>
            </tr>
          </thead>
          <tbody>
            {EMOTION_STATS.map((s) => (
              <tr key={s.emotion}>
                <td className={adminStyles.tableCell}>
                  {EMOTION_LABELS_ZH[s.emotion]}
                </td>
                <td className={adminStyles.tableCell}>{s.views.toLocaleString()}</td>
                <td className={adminStyles.tableCell}>${s.rpm}</td>
                <td className={adminStyles.tableCell}>{s.scrollDepth}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-gray-400">
        单篇文章 PV 与来源详见「文章管理」→ 文章详情
      </p>
    </div>
  );
}
