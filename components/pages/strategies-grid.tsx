"use client"

import { Briefcase, Search, Plus, Target, TrendingUp, Building2, Cpu, Zap, Leaf } from "lucide-react"

const mockStrategies = [
  {
    id: "1",
    name: "AI基础设施",
    type: "主题策略",
    typeColor: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Cpu,
    iconBg: "bg-blue-100 text-blue-600",
    description: "聚焦AI算力、模型训练框架和基础软件生态投资",
    projectCount: 12,
    totalInvest: "8.5亿",
    returnRate: "+32%",
  },
  {
    id: "2",
    name: "大模型应用",
    type: "赛道策略",
    typeColor: "bg-violet-50 text-violet-700 border-violet-200",
    icon: Target,
    iconBg: "bg-violet-100 text-violet-600",
    description: "关注大语言模型的企业级和消费级应用落地场景",
    projectCount: 8,
    totalInvest: "5.2亿",
    returnRate: "+18%",
  },
  {
    id: "3",
    name: "企业服务SaaS",
    type: "行业策略",
    typeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: Building2,
    iconBg: "bg-emerald-100 text-emerald-600",
    description: "覆盖CRM、ERP、协同办公等企业数字化转型赛道",
    projectCount: 15,
    totalInvest: "12亿",
    returnRate: "+25%",
  },
  {
    id: "4",
    name: "生物科技",
    type: "主题策略",
    typeColor: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Zap,
    iconBg: "bg-rose-100 text-rose-600",
    description: "布局AI制药、基因治疗和精准医疗等前沿领域",
    projectCount: 6,
    totalInvest: "4.8亿",
    returnRate: "+12%",
  },
  {
    id: "5",
    name: "新能源汽车",
    type: "赛道策略",
    typeColor: "bg-violet-50 text-violet-700 border-violet-200",
    icon: Leaf,
    iconBg: "bg-lime-100 text-lime-600",
    description: "智能驾驶、动力电池和充电基础设施全产业链投资",
    projectCount: 10,
    totalInvest: "18亿",
    returnRate: "+28%",
  },
  {
    id: "6",
    name: "出海电商",
    type: "行业策略",
    typeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: TrendingUp,
    iconBg: "bg-amber-100 text-amber-600",
    description: "跨境电商平台、品牌出海和供应链服务生态",
    projectCount: 9,
    totalInvest: "6.3亿",
    returnRate: "+22%",
  },
]

interface StrategiesGridProps {
  onSelectStrategy?: (strategyId: string) => void
}

export function StrategiesGrid({ onSelectStrategy }: StrategiesGridProps) {
  return (
    <div className="h-full overflow-auto bg-[#F3F4F6]">
      <div className="mx-auto max-w-7xl px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563EB] text-white">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#111827]">策略列表</h1>
              <p className="text-sm text-[#6B7280]">
                共 {mockStrategies.length} 个投资策略
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2">
              <Search className="h-4 w-4 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="搜索策略..."
                className="w-48 bg-transparent text-sm text-[#374151] outline-none placeholder:text-[#9CA3AF]"
              />
            </div>
            <button className="flex items-center gap-1.5 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1D4ED8]">
              <Plus className="h-4 w-4" />
              新建策略
            </button>
          </div>
        </div>

        {/* Strategy Cards Grid */}
        <div className="grid grid-cols-3 gap-5">
          {mockStrategies.map((strategy) => {
            const Icon = strategy.icon
            return (
              <button
                key={strategy.id}
                onClick={() => onSelectStrategy?.(strategy.id)}
                className="group flex flex-col rounded-xl border border-[#E5E7EB] bg-white p-6 text-left transition-all hover:border-[#2563EB]/30 hover:shadow-lg hover:shadow-[#2563EB]/5"
              >
                {/* Icon & Type */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${strategy.iconBg} transition-transform group-hover:scale-105`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`inline-flex rounded-md border px-2 py-0.5 text-[11px] font-medium ${strategy.typeColor}`}
                  >
                    {strategy.type}
                  </span>
                </div>

                {/* Info */}
                <h3 className="text-base font-semibold text-[#111827] mb-1">
                  {strategy.name}
                </h3>
                <p className="text-xs text-[#6B7280] mb-5 leading-relaxed">
                  {strategy.description}
                </p>

                {/* Stats Row */}
                <div className="mt-auto grid grid-cols-3 gap-3 rounded-lg bg-[#F9FAFB] p-3">
                  <div>
                    <p className="text-[11px] text-[#9CA3AF]">项目数</p>
                    <p className="text-sm font-semibold text-[#111827]">
                      {strategy.projectCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#9CA3AF]">总投资额</p>
                    <p className="text-sm font-semibold text-[#111827]">
                      {strategy.totalInvest}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#9CA3AF]">收益率</p>
                    <p className="text-sm font-semibold text-emerald-600">
                      {strategy.returnRate}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
