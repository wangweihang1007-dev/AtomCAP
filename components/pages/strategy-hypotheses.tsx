"use client"

import { useState } from "react"
import {
  Search,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Lightbulb,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface StrategyHypothesis {
  id: string
  title: string
  category: string
  status: "recommended" | "applied" | "optional"
  description: string
  rationale: string
  verificationMethod: string
  priority: "high" | "medium" | "low"
  relatedMetrics: string[]
}

const mockHypotheses: StrategyHypothesis[] = [
  {
    id: "sh1",
    title: "核心技术团队具备GPU架构设计能力",
    category: "团队能力",
    status: "recommended",
    description:
      "投资标的的核心技术团队应具备自研GPU/AI芯片架构的能力，包括微架构设计、编译器优化、驱动开发等关键技术环节。",
    rationale:
      "AI算力芯片是基础设施的核心，自研能力决定了企业的长期竞争力和技术壁垒。参考NVIDIA、AMD的发展路径，核心架构团队是决定性因素。",
    verificationMethod:
      "审查团队成员的技术背景和专利情况，评估核心架构师的行业经验，验证已有产品的性能指标。",
    priority: "high",
    relatedMetrics: ["团队规模", "专利数量", "核心人员稳定性"],
  },
  {
    id: "sh2",
    title: "目标市场TAM超过100亿美元",
    category: "市场规模",
    status: "recommended",
    description:
      "目标市场的总可及市场规模（TAM）应在100亿美元以上，并保持年均20%以上的增长率，确保足够的成长空间。",
    rationale:
      "AI基础设施赛道处于高速增长期，全球AI芯片市场预计2025年将达到800亿美元。确保投资标的所处细分市场具有足够规模。",
    verificationMethod:
      "收集第三方市场研究报告（Gartner、IDC等），分析历史数据和增长趋势，进行自下而上的市场规模测算。",
    priority: "high",
    relatedMetrics: ["TAM规模", "CAGR", "市场渗透率"],
  },
  {
    id: "sh3",
    title: "产品已获得标杆客户验证",
    category: "商业验证",
    status: "applied",
    description:
      "投资标的的产品或服务应已获得至少2-3个行业标杆客户的实际使用验证，证明产品的市场可行性。",
    rationale:
      "标杆客户的采纳是产品市场匹配（PMF）的重要标志，能够有效降低技术风险和市场风险，同时为后续客户拓展提供背书。",
    verificationMethod:
      "获取客户合同或意向书，进行客户访谈以了解使用情况和满意度，验证收入数据和续约率。",
    priority: "high",
    relatedMetrics: ["客户数量", "NPS评分", "续约率"],
  },
  {
    id: "sh4",
    title: "具备可持续的技术迭代能力",
    category: "技术能力",
    status: "recommended",
    description:
      "企业应展示出持续的技术迭代和创新能力，包括明确的技术路线图、定期的产品更新节奏和技术预研投入。",
    rationale:
      "AI基础设施领域技术演进速度快，持续的研发能力是保持竞争优势的关键。需要评估企业的研发体系和创新机制。",
    verificationMethod:
      "审查技术路线图和研发计划，评估研发投入占比，分析产品迭代历史和速度。",
    priority: "medium",
    relatedMetrics: ["研发投入占比", "产品版本迭代频率", "技术专利增速"],
  },
  {
    id: "sh5",
    title: "单位经济模型可在24个月内盈亏平衡",
    category: "财务模型",
    status: "optional",
    description:
      "投资标的的单位经济模型应能在24个月内实现盈亏平衡，毛利率目标应不低于60%。",
    rationale:
      "虽然AI基础设施前期投入较大，但健康的单位经济模型是企业可持续发展的基础。过长的回本周期意味着更高的资金风险。",
    verificationMethod:
      "分析财务报表和预测模型，进行单位经济敏感性分析，对比同行业企业的盈利节奏。",
    priority: "medium",
    relatedMetrics: ["毛利率", "客户获取成本", "客户终身价值"],
  },
  {
    id: "sh6",
    title: "供应链具有多元化布局",
    category: "运营风险",
    status: "optional",
    description:
      "企业应具备多元化的供应链布局，避免对单一供应商的过度依赖，确保在地缘政治风险下的供应稳定性。",
    rationale:
      "全球芯片供应链面临地缘政治不确定性，多元化布局能有效对冲风险，保障业务连续性。",
    verificationMethod:
      "审查供应商清单和集中度，评估替代供应商的可行性，分析库存管理策略。",
    priority: "low",
    relatedMetrics: ["供应商集中度", "库存周转天数", "备选方案数量"],
  },
]

const statusConfig = {
  recommended: {
    label: "推荐",
    icon: Lightbulb,
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
  },
  applied: {
    label: "已应用",
    icon: CheckCircle2,
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  optional: {
    label: "可选",
    icon: Clock,
    badgeClass: "bg-gray-50 text-gray-600 border-gray-200",
  },
}

const priorityConfig = {
  high: "bg-rose-50 text-rose-700 border-rose-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-gray-50 text-gray-600 border-gray-200",
}

export function StrategyHypotheses() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedId, setSelectedId] = useState<string | null>("sh1")

  const filteredList = mockHypotheses.filter(
    (h) =>
      h.title.includes(searchQuery) ||
      h.category.includes(searchQuery)
  )

  const selected = selectedId
    ? mockHypotheses.find((h) => h.id === selectedId) ?? null
    : null

  return (
    <div className="flex h-full">
      {/* Left: Hypothesis List */}
      <div className="w-[300px] shrink-0 border-r border-[#E5E7EB] bg-white">
        <div className="border-b border-[#E5E7EB] p-4">
          <h2 className="mb-3 text-base font-semibold text-[#111827]">
            推荐假设清单
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
            <Input
              placeholder="搜索假设..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-sm h-9 border-[#E5E7EB]"
            />
          </div>
        </div>
        <ScrollArea className="h-[calc(100%-85px)]">
          <div className="p-2 space-y-1">
            {filteredList.map((item) => {
              const config = statusConfig[item.status]
              const StatusIcon = config.icon
              const isSelected = selectedId === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={cn(
                    "flex w-full items-start gap-2.5 rounded-lg px-3 py-3 text-left transition-colors",
                    isSelected
                      ? "bg-[#EFF6FF] border border-[#2563EB]/20"
                      : "hover:bg-[#F9FAFB] border border-transparent"
                  )}
                >
                  <StatusIcon
                    className={cn(
                      "mt-0.5 h-4 w-4 shrink-0",
                      item.status === "recommended"
                        ? "text-blue-500"
                        : item.status === "applied"
                          ? "text-emerald-500"
                          : "text-gray-400"
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm font-medium truncate",
                        isSelected ? "text-[#2563EB]" : "text-[#111827]"
                      )}
                    >
                      {item.title}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[11px] text-[#9CA3AF]">
                        {item.category}
                      </span>
                      <Badge
                        className={`${config.badgeClass} text-[10px] px-1.5 py-0 h-4 hover:${config.badgeClass.split(" ")[0]}`}
                      >
                        {config.label}
                      </Badge>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Right: Detail */}
      <div className="flex-1 bg-[#F3F4F6] overflow-auto">
        {selected ? (
          <div className="mx-auto max-w-3xl px-8 py-6 space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-sm text-[#6B7280]">
              <span>AI基础设施</span>
              <ChevronRight className="h-3.5 w-3.5" />
              <span>推荐假设</span>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-[#374151] font-medium">
                {selected.title}
              </span>
            </div>

            {/* Header */}
            <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-[#111827]">
                    {selected.title}
                  </h2>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge className="bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-50 text-xs">
                      {selected.category}
                    </Badge>
                    <Badge
                      className={`${statusConfig[selected.status].badgeClass} text-xs`}
                    >
                      {statusConfig[selected.status].label}
                    </Badge>
                    <Badge
                      className={`${priorityConfig[selected.priority]} text-xs`}
                    >
                      {"优先级: "}
                      {selected.priority === "high"
                        ? "高"
                        : selected.priority === "medium"
                          ? "中"
                          : "低"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">
              <h3 className="text-base font-semibold text-[#111827] mb-3">
                假设描述
              </h3>
              <p className="text-sm leading-relaxed text-[#374151]">
                {selected.description}
              </p>
            </div>

            {/* Rationale */}
            <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">
              <h3 className="text-base font-semibold text-[#111827] mb-3">
                推荐理由
              </h3>
              <div className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-4">
                <p className="text-sm leading-relaxed text-[#374151]">
                  {selected.rationale}
                </p>
              </div>
            </div>

            {/* Verification Method */}
            <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">
              <h3 className="text-base font-semibold text-[#111827] mb-3">
                建议验证方法
              </h3>
              <div className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-4">
                <p className="text-sm leading-relaxed text-[#374151]">
                  {selected.verificationMethod}
                </p>
              </div>
            </div>

            {/* Related Metrics */}
            <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">
              <h3 className="text-base font-semibold text-[#111827] mb-3">
                关联指标
              </h3>
              <div className="flex flex-wrap gap-2">
                {selected.relatedMetrics.map((m) => (
                  <Badge
                    key={m}
                    className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50"
                  >
                    {m}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4">
              <div className="flex items-center justify-end gap-3">
                <button className="flex items-center gap-2 rounded-lg border border-[#D1D5DB] bg-white px-4 py-2 text-sm font-medium text-[#374151] transition-colors hover:bg-[#F9FAFB]">
                  <AlertTriangle className="h-4 w-4" />
                  标记为可选
                </button>
                <button className="flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1D4ED8]">
                  <CheckCircle2 className="h-4 w-4" />
                  应用到项目
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center text-[#9CA3AF]">
              <Lightbulb className="mx-auto h-12 w-12 mb-3 text-[#D1D5DB]" />
              <p className="text-sm">选择左侧假设以查看详情</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
