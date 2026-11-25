import React from "react";
import {
  FileText,
  Zap,
  CheckCircle2,
  Calendar,
  Clock,
  TrendingUp,
} from "lucide-react";

// Minimal smooth SVG sparkline with subtle gradient
function Sparkline({ data, strokeColor }) {
  const width = 80;
  const height = 28;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x},${y}`;
    })
    .join(" ");

  const firstPoint = `0,${height}`;
  const lastPoint = `${width},${height}`;
  const areaPoints = `${firstPoint} ${points} ${lastPoint}`;
  const gradId = `spark-${strokeColor.replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.12" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#${gradId})`} />
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

export default function KpiCards({ stats }) {
  const totalVal = stats?.total ?? 24;
  const autoVal = stats?.autoApplied ?? Math.round(totalVal * 0.55);
  const shortlistedVal = stats?.shortlisted ?? stats?.accepted ?? 10;
  const interviewsVal = stats?.interviews ?? 3;

  const cards = [
    {
      id: "total",
      label: "Total Applications",
      value: totalVal,
      displayValue: String(totalVal).padStart(2, "0"),
      icon: FileText,
      change: "+14.2%",
      isPositive: true,
      comparison: "vs last month",
      sparkline: [14, 16, 15, 18, 19, 21, 24],
      strokeColor: "#0F172A",
    },
    {
      id: "autoApplied",
      label: "Auto Applied",
      value: autoVal,
      displayValue: String(autoVal).padStart(2, "0"),
      icon: Zap,
      change: "+28.4%",
      isPositive: true,
      comparison: "via AI matching",
      sparkline: [4, 6, 8, 10, 11, 13, 14],
      strokeColor: "#145A42",
    },
    {
      id: "shortlisted",
      label: "Shortlisted Roles",
      value: shortlistedVal,
      displayValue: String(shortlistedVal).padStart(2, "0"),
      icon: CheckCircle2,
      change: "+18.0%",
      isPositive: true,
      comparison: "vs last month",
      sparkline: [3, 4, 5, 7, 8, 9, 10],
      strokeColor: "#059669",
    },
    {
      id: "interviews",
      label: "Upcoming Interviews",
      value: interviewsVal,
      displayValue: String(interviewsVal).padStart(2, "0"),
      icon: Calendar,
      change: "Active",
      isPositive: true,
      comparison: "rounds scheduled",
      sparkline: [1, 1, 2, 2, 3, 3, 3],
      strokeColor: "#0284C7",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="group relative rounded-xl border border-slate-200/90 bg-[#FFFFFF] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all duration-200 hover:border-slate-300 hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">
                {card.label}
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 text-slate-700 transition-colors group-hover:bg-slate-100">
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <span className="font-mono text-3xl font-bold tracking-tight text-slate-900">
                {card.displayValue}
              </span>
              <div className="pl-2">
                <Sparkline data={card.sparkline} strokeColor={card.strokeColor} />
              </div>
            </div>

            <div className="mt-3.5 flex items-center gap-1.5 border-t border-slate-100 pt-3 text-[11px]">
              <span
                className={`inline-flex items-center gap-0.5 font-semibold ${
                  card.isPositive ? "text-emerald-700" : "text-rose-600"
                }`}
              >
                <TrendingUp className="h-3 w-3" />
                {card.change}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">{card.comparison}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
