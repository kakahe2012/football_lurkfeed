"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  url?: string;
  title?: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  size?: "sm" | "md";
  onShared?: () => void;
}

export function ShareButton({
  url,
  title,
  label = "Share",
  copiedLabel = "Link copied",
  className,
  size = "md",
  onShared,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

    if (navigator.share && !url) {
      try {
        await navigator.share({ title, url: shareUrl });
        onShared?.();
        return;
      } catch {
        /* copy fallback */
      }
    }

    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    onShared?.();
    setTimeout(() => setCopied(false), 2000);
  };

  const sizeClass =
    size === "sm"
      ? "gap-1 px-2.5 py-1.5 text-xs"
      : "gap-1.5 px-4 py-2 text-sm";

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "inline-flex items-center rounded-full border border-stone-200 bg-white font-medium text-stone-700 shadow-sm transition hover:border-stone-300 hover:bg-stone-50 active:scale-[0.98]",
        sizeClass,
        copied && "border-teal-200 bg-teal-50 text-teal-800",
        className
      )}
    >
      {copied ? (
        <>
          <Check size={size === "sm" ? 14 : 16} />
          {copiedLabel}
        </>
      ) : (
        <>
          <Link2 size={size === "sm" ? 14 : 16} />
          {label}
        </>
      )}
    </button>
  );
}
