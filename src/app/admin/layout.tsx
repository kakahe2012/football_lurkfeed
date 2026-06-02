"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { adminStyles } from "@/components/admin/admin-styles";
import { AdminGate } from "@/components/admin/AdminGate";
import { adminFetch } from "@/lib/admin/client";

const NAV = [
  { href: "/admin", label: "仪表盘" },
  { href: "/admin/articles", label: "文章管理" },
  { href: "/admin/publish", label: "文章上线" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const logout = async () => {
    await adminFetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  };

  return (
    <AdminGate>
      <div className={adminStyles.shell}>
        <aside className={adminStyles.sidebar}>
          <Link href="/admin" className={adminStyles.logo}>
            LurkFeed
            <span className="mt-1 block text-xs font-normal text-gray-400">
              内容管理
            </span>
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
                  className={active ? adminStyles.navLinkActive : adminStyles.navLink}
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
            查看前台 →
          </Link>
          <button
            type="button"
            onClick={logout}
            className="mt-6 text-left text-xs text-gray-400 hover:text-gray-700"
          >
            退出登录
          </button>
        </aside>
        <main className={adminStyles.main}>{children}</main>
      </div>
    </AdminGate>
  );
}
