"use client";

import { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import {
  dailyPurchaseData,
  purchaseTotals,
  exploreCounters,
  formatLarge,
} from "@/lib/explore-data";
import { useOilTopHolder } from "@/lib/use-oil-top-holder";

const CHART_COLORS = {
  revenue: "#f59e0b", // amber
  purchases: "#3b82f6", // blue
  pct: "#eab308", // yellow
};

export function OilPurchasesChart() {
  const { topHolderBalance } = useOilTopHolder(120_000);
  const circulatingSupply = exploreCounters.totalSupply * 0.9; // ~90% circulating
  const supplyOffsetPct =
    topHolderBalance != null && circulatingSupply > 0
      ? ((topHolderBalance / circulatingSupply) * 100).toFixed(2)
      : String(exploreCounters.circulatingOffsetPct);

  const option: EChartsOption = useMemo(() => {
    const dates = dailyPurchaseData.map((d) => d.date);
    const revenueSol = dailyPurchaseData.map((d) => d.revenueSol);
    const purchasesSol = dailyPurchaseData.map((d) => d.purchasesSol);
    const purchasesPct = dailyPurchaseData.map((d) => d.purchasesPctOfPrevRevenue);

    return {
      backgroundColor: "transparent",
      animation: true,
      animationDuration: 800,
      animationEasing: "cubicOut",
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(24,24,30,0.95)",
        borderColor: "#27272a",
        textStyle: { color: "#e5e7eb", fontSize: 12 },
        formatter: (params: unknown) => {
          const p = Array.isArray(params) ? params : [params];
          const idx = (p[0] as { dataIndex: number }).dataIndex;
          const d = dailyPurchaseData[idx];
          const prev = dailyPurchaseData[idx + 1];
          return `
            <div style="padding:4px 0">
              <strong>${d.date}</strong>
              <div style="margin-top:6px;color:#a1a1aa">Revenue (SOL): ${d.revenueSol.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
              <div style="color:#a1a1aa">Purchases (SOL): ${d.purchasesSol.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
              <div style="color:#a1a1aa">Purchases % of prev revenue: ${d.purchasesPctOfPrevRevenue.toFixed(2)}%</div>
              <div style="color:#a1a1aa">OIL bought: ${formatLarge(d.oilBought)}</div>
              ${prev ? `<div style="margin-top:4px;color:#71717a;font-size:11px">Prev day revenue: ${prev.revenueSol.toLocaleString(undefined, { maximumFractionDigits: 2 })} SOL</div>` : ""}
            </div>
          `;
        },
      },
      legend: {
        data: ["Revenue (SOL)", "Purchases (SOL)", "Purchases % of prev revenue"],
        bottom: 0,
        textStyle: { color: "#a1a1aa", fontSize: 11 },
        itemWidth: 14,
        itemHeight: 8,
        itemGap: 16,
      },
      grid: { left: 56, right: 56, top: 32, bottom: 72, containLabel: false },
      dataZoom: [
        {
          type: "slider",
          show: true,
          xAxisIndex: [0],
          start: 0,
          end: 100,
          bottom: 8,
          height: 24,
          borderColor: "transparent",
          fillerColor: "rgba(212,168,83,0.2)",
          handleStyle: { color: "#d4a853" },
          textStyle: { color: "#a1a1aa", fontSize: 10 },
          dataBackground: { lineStyle: { color: "rgba(212,168,83,0.3)" }, areaStyle: { color: "rgba(212,168,83,0.05)" } },
        },
      ],
      xAxis: {
        type: "category",
        data: dates,
        axisLine: { lineStyle: { color: "#27272a" } },
        axisLabel: { color: "#a1a1aa", fontSize: 10 },
        axisTick: { show: false },
      },
      yAxis: [
        {
          type: "value",
          name: "SOL",
          nameTextStyle: { color: "#a1a1aa", fontSize: 10 },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { lineStyle: { color: "#27272a", type: "dashed" } },
          axisLabel: { color: "#a1a1aa", fontSize: 10 },
        },
        {
          type: "value",
          name: "%",
          nameTextStyle: { color: "#a1a1aa", fontSize: 10 },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { color: "#a1a1aa", fontSize: 10 },
        },
      ],
      series: [
        {
          name: "Revenue (SOL)",
          type: "line",
          data: revenueSol,
          smooth: true,
          symbol: "none",
          lineStyle: { color: CHART_COLORS.revenue, width: 2 },
          yAxisIndex: 0,
        },
        {
          name: "Purchases (SOL)",
          type: "line",
          data: purchasesSol,
          smooth: true,
          symbol: "none",
          lineStyle: { color: CHART_COLORS.purchases, width: 2 },
          yAxisIndex: 0,
        },
        {
          name: "Purchases % of prev revenue",
          type: "line",
          data: purchasesPct,
          smooth: true,
          symbol: "none",
          lineStyle: { color: CHART_COLORS.pct, width: 2 },
          yAxisIndex: 1,
        },
      ],
    };
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/60 p-4 backdrop-blur-md md:p-6">
      {/* Top stats */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
            Total purchases (USD)
          </p>
          <p className="font-mono text-sm font-semibold text-[var(--text-primary)]">
            ${formatLarge(purchaseTotals.totalPurchasesUsd)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
            Total OIL bought
          </p>
          <p className="font-mono text-sm font-semibold text-[var(--text-primary)]">
            {formatLarge(purchaseTotals.totalOilBought)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
            Total SOL spent
          </p>
          <p className="font-mono text-sm font-semibold text-[var(--text-primary)]">
            {formatLarge(purchaseTotals.totalSolSpent)} SOL
          </p>
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
            Total USD spent
          </p>
          <p className="font-mono text-sm font-semibold text-[var(--text-primary)]">
            ${formatLarge(purchaseTotals.totalUsdSpent)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
            Circulating supply offset
          </p>
          <p className="font-mono text-sm font-semibold text-[var(--text-primary)]">
            {supplyOffsetPct}%
          </p>
        </div>
      </div>

      <div className="h-[400px] w-full">
        <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />
      </div>
    </div>
  );
}
