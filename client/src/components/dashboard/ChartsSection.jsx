import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  TrendingUp,
  Layers,
  Info,
} from "lucide-react";

// Minimal, clean Tooltip (Stripe/Linear style)
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-slate-200/90 bg-[#FFFFFF] p-2.5 shadow-md">
        <p className="text-[11px] font-semibold text-slate-900 border-b border-slate-100 pb-1 mb-1.5">
          {label}
        </p>
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4 text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-500">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: entry.color || entry.stroke || entry.fill }}
                />
                {entry.name}:
              </span>
              <span className="font-semibold text-slate-900 font-mono">
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// Donut Center Label
const DonutCenter = ({ total }) => {
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
      <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
        {total}
      </span>
      <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
        Total Apps
      </span>
    </div>
  );
};

export default function ChartsSection({ timeRange }) {
  // Chart A: Application Activity (Jan to Dec)
  const monthlyActivityData = [
    { month: "Jan", submitted: 2, responses: 1 },
    { month: "Feb", submitted: 3, responses: 2 },
    { month: "Mar", submitted: 4, responses: 3 },
    { month: "Apr", submitted: 3, responses: 2 },
    { month: "May", submitted: 5, responses: 4 },
    { month: "Jun", submitted: 4, responses: 3 },
    { month: "Jul", submitted: 6, responses: 5 },
    { month: "Aug", submitted: 5, responses: 4 },
    { month: "Sep", submitted: 7, responses: 6 },
    { month: "Oct", submitted: 6, responses: 5 },
    { month: "Nov", submitted: 8, responses: 7 },
    { month: "Dec", submitted: 5, responses: 4 },
  ];

  // Chart B: Application Status Donut Data (Restrained, distinct semantic tones)
  const statusData = [
    { name: "Accepted", value: 10, color: "#059669" },
    { name: "Pending", value: 8, color: "#D97706" },
    { name: "Shortlisted", value: 4, color: "#0F172A" },
    { name: "Rejected", value: 6, color: "#E11D48" },
  ];
  const totalStatusApplications = statusData.reduce((acc, curr) => acc + curr.value, 0);

  // Chart C: Monthly Performance (Grouped Bar Chart)
  const performanceData = [
    { month: "Jul", submitted: 6, interviews: 3, offers: 1 },
    { month: "Aug", submitted: 5, interviews: 2, offers: 0 },
    { month: "Sep", submitted: 7, interviews: 4, offers: 1 },
    { month: "Oct", submitted: 6, interviews: 3, offers: 1 },
    { month: "Nov", submitted: 8, interviews: 5, offers: 2 },
    { month: "Dec", submitted: 5, interviews: 3, offers: 1 },
  ];

  // Chart D: Application Conversion Funnel Data (Neutral progressive scale)
  const funnelStages = [
    { name: "Jobs Viewed", count: 142, percentage: "100%", color: "bg-slate-200" },
    { name: "Jobs Applied", count: 24, percentage: "16.9%", color: "bg-slate-400" },
    { name: "Shortlisted", count: 14, percentage: "58.3%", color: "bg-slate-600" },
    { name: "Interviews", count: 8, percentage: "33.3%", color: "bg-slate-800" },
    { name: "Offers Received", count: 3, percentage: "12.5%", color: "bg-[#059669]" },
  ];

  // Chart E: Weekly Activity Chart (Mon to Sun)
  const weeklyData = [
    { day: "Mon", count: 5 },
    { day: "Tue", count: 7 },
    { day: "Wed", count: 4 },
    { day: "Thu", count: 8 },
    { day: "Fri", count: 6 },
    { day: "Sat", count: 2 },
    { day: "Sun", count: 1 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Grid: Chart A (Application Activity) + Chart B (Application Status Donut) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Chart A: Application Activity Area Chart */}
        <div className="rounded-xl border border-slate-200/90 bg-[#FFFFFF] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] lg:col-span-8 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-bold tracking-tight text-slate-900">
                  Application Activity & Trajectory
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Monthly submissions vs responses received (Jan - Dec)
                </p>
              </div>

              {/* Chart Legend */}
              <div className="flex items-center gap-4 text-xs">
                <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                  <span className="h-2 w-2 rounded-xs bg-slate-900" />
                  Submitted
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                  <span className="h-2 w-2 rounded-xs bg-[#059669]" />
                  Responses
                </span>
              </div>
            </div>

            {/* Area Chart Container */}
            <div className="mt-4 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={monthlyActivityData}
                  margin={{ top: 10, right: 10, left: -22, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="charcoalGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0F172A" stopOpacity={0.08} />
                      <stop offset="95%" stopColor="#0F172A" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.08} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    stroke="#F1F5F9"
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={{ stroke: "#E2E8F0" }}
                    tick={{ fill: "#64748B", fontSize: 11 }}
                  />

                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#64748B", fontSize: 11 }}
                    allowDecimals={false}
                  />

                  <Tooltip content={<CustomTooltip />} />

                  {/* Curve 1: Submitted (Deep Charcoal) */}
                  <Area
                    type="monotone"
                    dataKey="submitted"
                    name="Submitted"
                    stroke="#0F172A"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#charcoalGrad)"
                    activeDot={{ r: 4, stroke: "#0F172A", strokeWidth: 2, fill: "#FFFFFF" }}
                  />

                  {/* Curve 2: Responses Received (Emerald) */}
                  <Area
                    type="monotone"
                    dataKey="responses"
                    name="Responses"
                    stroke="#059669"
                    strokeWidth={1.8}
                    strokeDasharray="4 4"
                    fillOpacity={1}
                    fill="url(#emeraldGrad)"
                    activeDot={{ r: 4, stroke: "#059669", strokeWidth: 2, fill: "#FFFFFF" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick metric footer */}
          <div className="mt-4 flex flex-wrap items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-700" />
              Response rate improved by <strong className="text-slate-800">18.4%</strong> since Q2
            </span>
            <span className="font-mono">Avg turnaround: 5.2 days</span>
          </div>
        </div>

        {/* Chart B: Application Status Donut */}
        <div className="rounded-xl border border-slate-200/90 bg-[#FFFFFF] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] lg:col-span-4 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold tracking-tight text-slate-900">
                Application Status
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Pipeline distribution breakdown
              </p>
            </div>

            {/* Donut Chart with Center Total */}
            <div className="relative mt-2 flex h-52 items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomTooltip />} />
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={78}
                    paddingAngle={3}
                    stroke="#FFFFFF"
                    strokeWidth={2}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <DonutCenter total={totalStatusApplications} />
            </div>
          </div>

          {/* Donut Legend */}
          <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
            {statusData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-md border border-slate-200/70 bg-slate-50/70 px-2.5 py-1.5 text-xs"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="truncate text-slate-600 text-[11px] font-medium">
                    {item.name}
                  </span>
                </div>
                <span className="font-semibold text-slate-900 font-mono text-[11px]">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Middle Grid: Chart C (Monthly Performance) + Chart D (Funnel) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Chart C: Monthly Performance Bar Chart */}
        <div className="rounded-xl border border-slate-200/90 bg-[#FFFFFF] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold tracking-tight text-slate-900">
                  Monthly Performance
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Applications vs Interviews vs Offers (H2)
                </p>
              </div>

              {/* Bar Legend */}
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                  <span className="h-2.5 w-2.5 rounded-xs bg-slate-900" />
                  Applications
                </span>
                <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                  <span className="h-2.5 w-2.5 rounded-xs bg-slate-500" />
                  Interviews
                </span>
                <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                  <span className="h-2.5 w-2.5 rounded-xs bg-[#059669]" />
                  Offers
                </span>
              </div>
            </div>

            {/* Grouped Bar Chart */}
            <div className="mt-4 h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={performanceData}
                  margin={{ top: 10, right: 10, left: -22, bottom: 0 }}
                  barGap={4}
                  barCategoryGap="25%"
                >
                  <CartesianGrid
                    stroke="#F1F5F9"
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={{ stroke: "#E2E8F0" }}
                    tick={{ fill: "#64748B", fontSize: 11 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#64748B", fontSize: 11 }}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="submitted"
                    name="Applications"
                    fill="#0F172A"
                    radius={[3, 3, 0, 0]}
                  />
                  <Bar
                    dataKey="interviews"
                    name="Interviews"
                    fill="#64748B"
                    radius={[3, 3, 0, 0]}
                  />
                  <Bar
                    dataKey="offers"
                    name="Offers"
                    fill="#059669"
                    radius={[3, 3, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-3 border-t border-slate-100 pt-2.5 flex items-center justify-between text-xs text-slate-500">
            <span>Offer conversion: <strong className="text-slate-800">12.5%</strong></span>
            <span>Total Offers: <strong className="text-slate-900 font-mono">3</strong></span>
          </div>
        </div>

        {/* Chart D: Application Conversion Funnel */}
        <div className="rounded-xl border border-slate-200/90 bg-[#FFFFFF] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold tracking-tight text-slate-900">
                  Application Conversion Funnel
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Full-cycle pipeline stage progression
                </p>
              </div>
              <span className="rounded-md border border-slate-200 bg-slate-50 p-1.5 text-slate-600">
                <Layers className="h-3.5 w-3.5" />
              </span>
            </div>

            {/* Clean Progressive Horizontal Funnel */}
            <div className="mt-4 space-y-3">
              {funnelStages.map((stage, idx) => {
                const widthPercent = Math.max((stage.count / 142) * 100, 12);

                return (
                  <div key={stage.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-slate-400">0{idx + 1}.</span>
                        {stage.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">
                          {stage.count}
                        </span>
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                          {stage.percentage}
                        </span>
                      </div>
                    </div>

                    <div className="relative h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${stage.color}`}
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-slate-200/80 bg-slate-50/70 p-2.5 text-[11px] text-slate-600 flex items-center gap-2">
            <Info className="h-3.5 w-3.5 shrink-0 text-slate-500" />
            <span>Interview-to-Offer rate is <strong className="text-slate-800">37.5%</strong>, exceeding cohort benchmark (22%).</span>
          </div>
        </div>
      </div>

      {/* Chart E: Weekly Activity Chart */}
      <div className="rounded-xl border border-slate-200/90 bg-[#FFFFFF] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold tracking-tight text-slate-900">
              Weekly Activity & Dispatch Pace
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              Daily application dispatch count (Monday - Sunday)
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="inline-block h-2 w-2 rounded-xs bg-slate-900" />
            <span>Peak day: <strong className="text-slate-800">Thursday (8 applications)</strong></span>
          </div>
        </div>

        <div className="mt-4 h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklyData}
              margin={{ top: 10, right: 10, left: -22, bottom: 0 }}
            >
              <CartesianGrid
                stroke="#F1F5F9"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={{ stroke: "#E2E8F0" }}
                tick={{ fill: "#64748B", fontSize: 11 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748B", fontSize: 11 }}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="count"
                name="Applications"
                fill="#1E293B"
                radius={[3, 3, 0, 0]}
                barSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
