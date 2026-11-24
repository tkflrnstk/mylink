"use client";

import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLinksQuery } from "@/hooks/use-links";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, ResponsiveContainer } from "recharts";
import { MousePointerClick, Link as LinkIcon, TrendingUp, Trophy, ArrowLeft, ArrowUpRight } from "lucide-react";

const chartConfig: ChartConfig = {
  clicks: {
    label: "클릭수",
    color: "#3182F6",
  },
};

const BAR_COLORS = [
  "#3182F6",
  "#00B493",
  "#8E44AD",
  "#F39C12",
  "#E74C3C",
  "#16A085",
  "#2980B9",
  "#D35400",
];

export default function StatsPage() {
  const router = useRouter();
  const { user, userProfile, loading: authLoading } = useAuth();
  const { data: links = [], isLoading: linksLoading } = useLinksQuery(user?.uid);

  // 1. 로그인 필수 검증: 비로그인 시 메인 페이지('/')로 리다이렉트
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/");
    }
  }, [user, authLoading, router]);

  // 2. 통계 지표 계산
  const { totalClicks, totalLinks, avgClicks, topLink, chartData } = useMemo(() => {
    const total = links.reduce((acc, cur) => acc + (cur.clicks || 0), 0);
    const count = links.length;
    const avg = count > 0 ? (total / count).toFixed(1) : "0";

    const sorted = [...links].sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
    const top = sorted.length > 0 && (sorted[0].clicks || 0) > 0 ? sorted[0] : null;

    // 차트용 데이터 (클릭수 상위 링크 중심 또는 전체 링크)
    const data = sorted.map((item, index) => ({
      name: item.title.length > 12 ? `${item.title.slice(0, 12)}…` : item.title,
      fullName: item.title,
      emoji: item.emoji || "🔗",
      clicks: item.clicks || 0,
      fill: BAR_COLORS[index % BAR_COLORS.length],
    }));

    return {
      totalClicks: total,
      totalLinks: count,
      avgClicks: avg,
      topLink: top,
      chartData: data,
    };
  }, [links]);

  // 로딩 화면
  if (authLoading || (!user && authLoading)) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-tds-fill-weak flex flex-col items-center justify-center p-8">
        <div className="w-10 h-10 rounded-full border-3 border-tds-border-default border-t-tds-fill-brand animate-spin mb-4" />
        <p className="text-tds-text-secondary text-[14px]">인증 정보를 확인하는 중입니다...</p>
      </div>
    );
  }

  // 비로그인 상태 (리다이렉트 진행 중)
  if (!user) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-tds-fill-weak flex flex-col items-center justify-center p-8">
        <p className="text-tds-text-secondary text-[14px]">로그인이 필요합니다. 메인 페이지로 이동 중...</p>
      </div>
    );
  }

  const currentDisplayName = userProfile?.displayName || (user.email ? user.email.split("@")[0] : "사용자");

  return (
    <div className="min-h-[calc(100vh-64px)] bg-tds-fill-weak py-6 sm:py-10 px-3 sm:px-6 flex flex-col items-center w-full min-w-0 overflow-x-hidden">
      <div className="w-full max-w-4xl flex flex-col gap-6 min-w-0">

        {/* 상단 네비게이션 헤더 */}
        <div className="flex flex-wrap items-center justify-between gap-3 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-tds-text-secondary hover:text-tds-text-primary transition-colors py-1 px-2.5 rounded-tds-m bg-white border border-tds-border-default shadow-2xs"
            >
              <ArrowLeft size={15} />
              <span>메인으로</span>
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-tds-text-primary tracking-tight truncate">
              📊 {currentDisplayName}님의 링크 통계
            </h1>
          </div>

          <Link
            href={`/${encodeURIComponent(currentDisplayName)}`}
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-tds-text-brand bg-tds-bg-brand-weak hover:bg-blue-100/70 border border-tds-border-focused/30 px-3 py-1.5 rounded-tds-m transition-all"
          >
            <span>내 공개 페이지 보기</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* ── 4대 핵심 요약 지표 카드 ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* 1. 총 클릭수 (모든 링크 합산) */}
          <Card className="bg-white border-tds-border-default shadow-tds-1">
            <CardContent className="p-4 sm:p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-tds-text-secondary mb-2">
                <span className="text-[12px] sm:text-[13px] font-medium">총 클릭수</span>
                <div className="w-8 h-8 rounded-full bg-blue-50 text-tds-text-brand flex items-center justify-center">
                  <MousePointerClick size={16} />
                </div>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-tds-text-primary tracking-tight">
                  {totalClicks.toLocaleString()}
                </p>
                <p className="text-[11px] text-tds-text-disabled mt-0.5">모든 링크 누적 합산</p>
              </div>
            </CardContent>
          </Card>

          {/* 2. 등록된 링크 수 */}
          <Card className="bg-white border-tds-border-default shadow-tds-1">
            <CardContent className="p-4 sm:p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-tds-text-secondary mb-2">
                <span className="text-[12px] sm:text-[13px] font-medium">등록된 링크</span>
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <LinkIcon size={16} />
                </div>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-tds-text-primary tracking-tight">
                  {totalLinks.toLocaleString()}
                </p>
                <p className="text-[11px] text-tds-text-disabled mt-0.5">현재 활성화된 링크</p>
              </div>
            </CardContent>
          </Card>

          {/* 3. 링크당 평균 클릭수 */}
          <Card className="bg-white border-tds-border-default shadow-tds-1">
            <CardContent className="p-4 sm:p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-tds-text-secondary mb-2">
                <span className="text-[12px] sm:text-[13px] font-medium">평균 클릭수</span>
                <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                  <TrendingUp size={16} />
                </div>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-tds-text-primary tracking-tight">
                  {avgClicks}
                </p>
                <p className="text-[11px] text-tds-text-disabled mt-0.5">링크 1개당 평균</p>
              </div>
            </CardContent>
          </Card>

          {/* 4. 최고 인기 링크 */}
          <Card className="bg-white border-tds-border-default shadow-tds-1">
            <CardContent className="p-4 sm:p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-tds-text-secondary mb-2">
                <span className="text-[12px] sm:text-[13px] font-medium">최고 인기 링크</span>
                <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Trophy size={16} />
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-[15px] sm:text-[16px] font-bold text-tds-text-primary truncate">
                  {topLink ? `${topLink.emoji || "🔗"} ${topLink.title}` : "-"}
                </p>
                <p className="text-[11px] text-purple-600 font-semibold mt-0.5">
                  {topLink ? `${topLink.clicks || 0}회 클릭` : "클릭 기록 없음"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── shadcn 차트 영역 ── */}
        <Card className="bg-white border-tds-border-default shadow-tds-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold text-tds-text-primary">
              📈 링크별 클릭수 차트
            </CardTitle>
            <CardDescription className="text-[13px] text-tds-text-secondary">
              공개 페이지에서 방문자들이 클릭한 횟수를 링크별로 비교 분석합니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {linksLoading ? (
              <div className="h-64 flex flex-col items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-tds-border-default border-t-tds-fill-brand animate-spin mb-2" />
                <p className="text-[12px] text-tds-text-secondary">차트 데이터를 불러오는 중...</p>
              </div>
            ) : chartData.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-tds-border-default rounded-tds-xl">
                <span className="text-3xl mb-2">📊</span>
                <p className="text-[14px] font-semibold text-tds-text-primary">등록된 링크 데이터가 없습니다.</p>
                <p className="text-[12px] text-tds-text-secondary mt-1">링크를 추가하고 공개 페이지에 공유해 보세요!</p>
              </div>
            ) : (
              <div className="w-full pt-2">
                <ChartContainer config={chartConfig} className="h-72 w-full">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 20, left: -10, bottom: 25 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E8EB" />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={{ stroke: "#E5E8EB" }}
                      tick={{ fill: "#6B7684", fontSize: 11 }}
                      interval={0}
                      angle={-15}
                      textAnchor="end"
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#6B7684", fontSize: 11 }}
                      allowDecimals={false}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(value, name, item) => (
                            <span>{value}회</span>
                          )}
                        />
                      }
                    />
                    <Bar
                      dataKey="clicks"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={50}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── 상세 링크별 클릭 랭킹 목록 ── */}
        <Card className="bg-white border-tds-border-default shadow-tds-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg font-bold text-tds-text-primary">
              📋 링크별 상세 클릭 현황
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-2">
            {chartData.length === 0 ? (
              <p className="text-center py-6 text-[13px] text-tds-text-disabled">등록된 링크가 없습니다.</p>
            ) : (
              <div className="divide-y divide-tds-border-default/60">
                {chartData.map((item, index) => {
                  const percentage = totalClicks > 0 ? ((item.clicks / totalClicks) * 100).toFixed(1) : "0";
                  return (
                    <div
                      key={`rank-${index}`}
                      className="flex items-center justify-between p-3 sm:px-4 hover:bg-tds-fill-secondary/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 ${
                            index === 0
                              ? "bg-amber-100 text-amber-700"
                              : index === 1
                              ? "bg-slate-100 text-slate-700"
                              : index === 2
                              ? "bg-orange-100 text-orange-700"
                              : "bg-tds-fill-secondary text-tds-text-disabled"
                          }`}
                        >
                          {index + 1}
                        </span>
                        <span className="text-xl shrink-0">{item.emoji}</span>
                        <span className="text-[13px] sm:text-[14px] font-semibold text-tds-text-primary truncate">
                          {item.fullName}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 ml-3">
                        <div className="hidden sm:flex flex-col items-end">
                          <div className="w-24 bg-tds-fill-secondary rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%`, backgroundColor: item.fill }}
                            />
                          </div>
                          <span className="text-[10px] text-tds-text-disabled mt-0.5">{percentage}%</span>
                        </div>
                        <div className="inline-flex items-center gap-1 font-bold text-[13px] sm:text-[14px] text-tds-text-primary bg-tds-fill-secondary px-2.5 py-1 rounded-tds-m">
                          <MousePointerClick size={13} className="text-tds-text-brand" />
                          <span>{item.clicks.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
