/** 后台统一白底简洁风格 */
export const adminStyles = {
  shell: "flex min-h-screen bg-[#f8f9fb] text-gray-900",
  sidebar:
    "w-56 shrink-0 border-r border-gray-200 bg-white px-4 py-6",
  logo: "text-lg font-semibold text-gray-900",
  logoAccent: "text-emerald-600",
  navLink:
    "rounded-md px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-100 hover:text-gray-900",
  navLinkActive: "bg-gray-100 text-gray-900 font-medium",
  main: "flex-1 overflow-auto p-6 md:p-8",
  pageTitle: "text-xl font-semibold text-gray-900",
  pageDesc: "mt-1 text-sm text-gray-500",
  card: "rounded-lg border border-gray-200 bg-white p-5 shadow-sm",
  table: "w-full text-sm",
  tableHead: "border-b border-gray-200 bg-gray-50 text-left text-gray-500",
  tableCell: "border-b border-gray-100 p-4",
  btnPrimary:
    "rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50",
  btnSecondary:
    "rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50",
  input:
    "mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400",
  select:
    "mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-gray-400 focus:outline-none",
  badgeGreen: "rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700",
  badgeAmber: "rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700",
  badgeGray: "rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600",
};

export const EMOTION_LABELS_ZH: Record<string, string> = {
  hype: "热血 Hype",
  heartbreak: "心碎 Heartbreak",
  icons: "球星 Icons",
  secrets: "秘闻 Secrets",
  culture: "文化 Culture",
  easy_football: "入门 Easy",
};

export function getAdminToken(): string {
  if (typeof window === "undefined") return "dev-admin-secret";
  return localStorage.getItem("admin_token") || "dev-admin-secret";
}
