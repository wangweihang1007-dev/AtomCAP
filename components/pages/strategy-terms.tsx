"use client"

import { useState } from "react"
import {
  Search,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  Link2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface StrategyTerm {
  id: string
  title: string
  category: string
  status: "recommended" | "applied" | "optional"
  content: string
  rationale: string
  relatedHypothesis: string | null
  priority: "high" | "medium" | "low"
  commonRange: string
}

const mockTerms: StrategyTerm[] = [
  {
    id: "st1",
    title: "优先清算权 1x Non-Participating",
    category: "清算优先权",
    status: "recommended",
    content:
      "在公司发生清算事件（包括合并、收购、资产出售等视同清算事件）时，投资方有权优先于普通股股东获得其投资金额1倍的回报。采用Non-Participating结构，即投资方在获得优先清算回报后不再参与剩余资产分配，或可选择转换为普通股按比例参与分配。",
    rationale:
      "1x Non-Participating是AI基础设施赛道B轮阶段最常见的清算优先权结构，既保护了投资人的下行风险，又不会过度稀释创始团队的利益，有利于维护良好的投资人-创始人关系。",
    relatedHypothesis: "单位经济模型可在24个月内盈亏平衡",
    priority: "high",
    commonRange: "1x-2x Non-Participating",
  },
  {
    id: "st2",
    title: "董事会席位",
    category: "控制权",
    status: "recommended",
    content:
      "投资方有权委派一名董事进入公司董事会，享有与其他董事同等的表决权和知情权。董事会结构建议为：2名创始人席位 + 1名投资人席位 + 1名独立董事席位 + 1名观察员席位。",
    rationale:
      "对于AI基础设施类公司，技术决策的专业性极高，投资方需要通过董事会席位确保对重大技术路线决策的知情权和参与权，同时避免过多干预日常运营。",
    relatedHypothesis: "核心技术团队具备GPU架构设计能力",
    priority: "high",
    commonRange: "1-2个投资人席位",
  },
  {
    id: "st3",
    title: "加权平均反稀释保护",
    category: "反稀释保护",
    status: "applied",
    content:
      "若公司在后续融资中以低于本轮估值的价格发行新股（Down Round），投资方享有广义加权平均（Broad-Based Weighted Average）反稀释调整权，按公式调整转换价格以补偿稀释影响。",
    rationale:
      "AI基础设施行业波动性较大，加权平均反稀释是平衡投资人保护和创始团队利益的最佳实践。相比完全棘轮（Full Ratchet），对创始团队更为友好。",
    relatedHypothesis: "目标市场TAM超过100亿美元",
    priority: "high",
    commonRange: "广义加权平均",
  },
  {
    id: "st4",
    title: "信息权与检查权",
    category: "信息权",
    status: "recommended",
    content:
      "公司应向投资方定期提供：月度财务报告（投资后15个工作日内）、季度经营分析报告、年度审计报告、年度经营计划和预算。投资方有权在合理通知后对公司进行财务和运营审查。",
    rationale:
      "AI基础设施公司通常涉及大额资本支出和复杂的技术指标，定期的信息披露有助于投资方及时了解公司运营状况，提前识别潜在风险。",
    relatedHypothesis: null,
    priority: "medium",
    commonRange: "月报/季报/年报",
  },
  {
    id: "st5",
    title: "关键人条款",
    category: "创始人约束",
    status: "optional",
    content:
      "创始人及核心技术负责人应承诺在投资完成后至少36个月内全职投入公司运营。如关键人离职，投资方有权要求公司回购投资方所持股权或触发特定的补偿机制。",
    rationale:
      "AI基础设施公司高度依赖核心技术人才，关键人离职可能对公司技术路线和团队稳定性造成重大影响。该条款旨在确保核心团队的稳定性。",
    relatedHypothesis: "核心技术团队具备GPU架构设计能力",
    priority: "medium",
    commonRange: "24-48个月锁定期",
  },
  {
    id: "st6",
    title: "知识产权保护条款",
    category: "知识产权",
    status: "optional",
    content:
      "公司应确保所有核心知识产权（包括但不限于芯片架构设计、编译器代码、算法专利等）归公司所有，核心员工应签署知识产权归属协议和竞业限制协议。",
    rationale:
      "AI基础设施公司的核心价值在于技术IP，确保知识产权的归属清晰和保护完善是投资的基本前提。",
    relatedHypothesis: "具备可持续的技术迭代能力",
    priority: "low",
    commonRange: "标准IP保护条款",
  },
]

const statusConfig = {
  recommended: {
    label: "推荐",
    icon: FileText,
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

export function StrategyTerms() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedId, setSelectedId] = useState<string | null>("st1")

  const filteredList = mockTerms.filter(
    (t) => t.title.includes(searchQuery) || t.category.includes(searchQuery)
  )

  const selected = selectedId
    ? mockTerms.find((t) => t.id === selectedId) ?? null
    : null

  return (
    <div className="flex h-full">
      {/* Left: Term List */}
      <div className="w-[300px] shrink-0 border-r border-[#E5E7EB] bg-white">
        <div className="border-b border-[#E5E7EB] p-4">
          <h2 className="mb-3 text-base font-semibold text-[#111827]">
            推荐条款清单
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
            <Input
              placeholder="搜索条款..."
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
                        className={`${config.badgeClass} text-[10px] px-1.5 py-0 h-4`}
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
              <span>推荐条款</span>
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

            {/* Content */}
            <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">
              <h3 className="text-base font-semibold text-[#111827] mb-3">
                条款内容
              </h3>
              <p className="text-sm leading-relaxed text-[#374151]">
                {selected.content}
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

            {/* Common Range */}
            <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">
              <h3 className="text-base font-semibold text-[#111827] mb-3">
                行业常见范围
              </h3>
              <div className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3">
                <p className="text-sm text-[#374151]">
                  {selected.commonRange}
                </p>
              </div>
            </div>

            {/* Related Hypothesis */}
            {selected.relatedHypothesis && (
              <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">
                <h3 className="text-base font-semibold text-[#111827] mb-3">
                  关联假设
                </h3>
                <div className="flex items-center gap-2 text-sm text-[#2563EB]">
                  <Link2 className="h-4 w-4" />
                  {selected.relatedHypothesis}
                </div>
              </div>
            )}

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
              <FileText className="mx-auto h-12 w-12 mb-3 text-[#D1D5DB]" />
              <p className="text-sm">选择左侧条款以查看详情</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
