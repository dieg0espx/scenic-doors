"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, Check } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
  size?: "sm" | "md";
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select...",
  className = "",
  size = "md",
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, close]);

  const selected = options.find((o) => o.value === value);
  const py = size === "sm" ? "py-2" : "py-2.5";
  const textSize = "text-sm";

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-4 ${py} rounded-xl border ${textSize} transition-all cursor-pointer
          ${open
            ? "bg-white/[0.06] border-violet-500/40 ring-2 ring-violet-500/20"
            : "bg-white/[0.03] border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.05]"
          }
          ${selected ? "text-white" : "text-white/25"}
        `}
      >
        <span className="truncate">{selected?.label || placeholder}</span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 ml-2 text-white/25 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-white/[0.08] bg-[#161b22] shadow-2xl shadow-black/40 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="max-h-56 overflow-y-auto py-1 custom-scrollbar">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  close();
                }}
                className={`w-full flex items-center gap-3 px-4 ${py} ${textSize} transition-colors cursor-pointer active:bg-white/[0.06]
                  ${value === opt.value
                    ? "bg-violet-500/10 text-violet-300"
                    : "text-white/60 hover:bg-white/[0.04] hover:text-white"
                  }
                `}
              >
                <div
                  className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors
                    ${value === opt.value
                      ? "bg-violet-500 border-violet-500"
                      : "border-white/[0.12] bg-transparent"
                    }
                  `}
                >
                  {value === opt.value && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="truncate">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
