"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminStyles } from "@/components/admin/admin-styles";
import { AdminGate } from "@/components/admin/AdminGate";

const NAV = [
  { href: "/admin", label: "仪表盘" },
  { href: "/admin/articles", label: "文章管理" },
  { href: "/admin/publish", label: "发布 / 导入" },
  { href: "/admin/tags", label: "标签管理" },
  { href: "/admin/queue", label: "待审队列" },
  { href: "/admin/pipeline", label: "AI 流水线" },
  { href: "/admin/site", label: "站点设置" },
  { href: "/admin/ads", label: "广告管理" },
  { href: "/admin/analytics", label: "数据分析" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AdminGate>
    <div className={adminStyles.shell}>
      <aside className={adminStyles.sidebar}>
        <Link href="/admin" className={adminStyles.logo}>
          LurkFeed<span className={adminStyles.logoAccent}> Football</span>
          <span className="mt-0.5 block text-xs font-normal text-gray-400">football.lurkfeed.com · 内容管理后台</span>
        </Link>
        <nav className="mt-8 flex flex-col gap-0.5">
          {NAV.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  active ? adminStyles.navLinkActive : adminStyles.navLink
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Link
          href="/"
          target="_blank"
          className="mt-10 block text-xs text-gray-400 hover:text-gray-600"
        >
          查看前台网站 →
        </Link>
        <p className="mt-6 text-[11px] leading-relaxed text-gray-400">
          管理手册见
          <br />
          <code className="text-gray-500">docs/网站管理手册.md</code>
        </p>
      </aside>
      <main className={adminStyles.main}>{children}</main>
    </div>
    </AdminGate>
  );
}
