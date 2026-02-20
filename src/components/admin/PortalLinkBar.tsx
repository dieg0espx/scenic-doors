"use client";

import { useState } from "react";
import { Link2, Copy, Check, ExternalLink } from "lucide-react";

export default function PortalLinkBar({ quoteId }: { quoteId: string }) {
  const [copied, setCopied] = useState(false);
  const portalPath = `/portal/${quoteId}`;

  function handleCopy() {
    const url = `${window.location.origin}${portalPath}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-violet-500/[0.06] border border-violet-500/15">
      <Link2 className="w-4 h-4 text-violet-400 shrink-0" />
      <span className="text-xs text-violet-300/70 font-medium shrink-0">Client Portal</span>
      <input
        type="text"
        value={portalPath}
        readOnly
        className="flex-1 min-w-0 bg-transparent text-violet-300 text-xs font-mono outline-none"
      />
      <button
        onClick={handleCopy}
        className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium hover:bg-violet-500/15 transition-colors cursor-pointer"
      >
        {copied ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
      </button>
      <a
        href={portalPath}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/50 hover:text-white text-xs font-medium transition-colors cursor-pointer"
      >
        <ExternalLink className="w-3 h-3" /> Open
      </a>
    </div>
  );
}
