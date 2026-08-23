interface LogoProps {
  /** Size in pixels. Defaults to 36 (header size). */
  size?: number;
  /** Whether to show the wordmark next to the mark. */
  showWordmark?: boolean;
  className?: string;
}

/**
 * Shankhya logo mark — a minimal calculator glyph.
 * Theme-aware: black body in light mode, white body in dark mode.
 * Blue accents (#1557FF) stay constant in both themes.
 */
export function Logo({ size = 36, showWordmark = true, className }: LogoProps) {
  return (
    <span className={`flex items-center gap-2 ${className ?? ""}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1024 1024"
        width={size}
        height={size}
        fill="none"
        role="img"
        aria-label="Shankhya"
        className="shrink-0"
      >
        <title>Calc</title>
        <desc>Minimal calculator logo mark for Calc</desc>

        <defs>
          <linearGradient id="shankhya-display" x1="238" y1="152" x2="786" y2="408" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#161C27" />
            <stop offset="100%" stopColor="#0B1018" />
          </linearGradient>
        </defs>

        {/* Calculator body — black in light, white in dark */}
        <rect
          x="152"
          y="56"
          width="720"
          height="912"
          rx="184"
          className="fill-slate-900 dark:fill-white"
        />
        <rect
          x="153.5"
          y="57.5"
          width="717"
          height="909"
          rx="182.5"
          strokeWidth="5"
          className="stroke-slate-900 dark:stroke-[#D4DCE7]"
        />

        {/* Display — white screen in light, dark screen in dark theme */}
        <rect x="238" y="152" width="548" height="256" rx="76" className="fill-white dark:fill-[#0B1018]" />
        <rect
          x="240.5"
          y="154.5"
          width="543"
          height="251"
          rx="73.5"
          strokeWidth="5"
          className="stroke-[#D4DCE7] dark:stroke-[#202937]"
        />

        {/* Display blue indicator */}
        <rect x="302" y="206" width="128" height="24" rx="12" fill="#1557FF" />

        {/* Display plus symbol — dark on white screen, white on dark screen */}
        <path
          d="M348 290 V354 M316 322 H380"
          strokeWidth="26"
          strokeLinecap="round"
          className="stroke-[#111722] dark:stroke-white"
        />

        {/* Display result — dark bar on white screen, white bar on dark screen */}
        <rect x="476" y="280" width="222" height="26" rx="13" className="fill-[#111722] dark:fill-white" />
        <rect x="476" y="330" width="156" height="26" rx="13" fill="#1557FF" />

        {/* Row 1 — Plus button */}
        <rect x="238" y="470" width="156" height="156" rx="50" className="fill-slate-800 dark:fill-[#DDE4ED]" />
        <path d="M316 514 V582 M282 548 H350" strokeWidth="26" strokeLinecap="round" className="stroke-white dark:stroke-[#111722]" />

        {/* Row 1 — Minus button */}
        <rect x="434" y="470" width="156" height="156" rx="50" className="fill-slate-800 dark:fill-[#DDE4ED]" />
        <rect x="476" y="536" width="72" height="26" rx="13" className="fill-white dark:fill-[#111722]" />

        {/* Row 1 — Multiply (blue accent) */}
        <rect x="630" y="470" width="156" height="156" rx="50" fill="#1557FF" />
        <path d="M674 514 L742 582 M742 514 L674 582" stroke="#FFFFFF" strokeWidth="26" strokeLinecap="round" />

        {/* Row 2 — Divide button */}
        <rect x="238" y="662" width="156" height="156" rx="50" className="fill-slate-800 dark:fill-[#DDE4ED]" />
        <circle cx="316" cy="704" r="12" className="fill-white dark:fill-[#111722]" />
        <rect x="278" y="732" width="76" height="24" rx="12" className="fill-white dark:fill-[#111722]" />
        <circle cx="316" cy="776" r="12" className="fill-white dark:fill-[#111722]" />

        {/* Row 2 — Percent button */}
        <rect x="434" y="662" width="156" height="156" rx="50" className="fill-slate-800 dark:fill-[#DDE4ED]" />
        <circle cx="480" cy="706" r="12" className="fill-white dark:fill-[#111722]" />
        <circle cx="552" cy="774" r="12" className="fill-white dark:fill-[#111722]" />
        <path d="M556 694 L476 786" strokeWidth="22" strokeLinecap="round" className="stroke-white dark:stroke-[#111722]" />

        {/* Row 2 — Equals (blue accent) */}
        <rect x="630" y="662" width="156" height="156" rx="50" fill="#1557FF" />
        <rect x="674" y="708" width="68" height="24" rx="12" fill="#FFFFFF" />
        <rect x="674" y="756" width="68" height="24" rx="12" fill="#FFFFFF" />

        {/* Brand accent dot */}
        <circle cx="738" cy="116" r="14" fill="#1557FF" />
      </svg>

      {showWordmark && (
        <span className="text-2xl font-semibold tracking-[0.15em] text-text-primary dark:text-dark-text-primary">
          Shankhya
        </span>
      )}
    </span>
  );
}