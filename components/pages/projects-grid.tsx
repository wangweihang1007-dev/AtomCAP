"use client"

import { FolderKanban, Search, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const mockProjects = [
  {
    id: "1",
    name: "MiniMax",
    logo: "M",
    description: "通用人工智能科技公司，专注于大模型研发",
    tags: ["AI", "B轮"],
    status: "尽调中",
    statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    valuation: "10亿 USD",
    round: "B轮",
  },
  {
    id: "2",
    name: "月之暗面",
    logo: "月",
    description: "新一代AI搜索与对话平台",
    tags: ["AI", "A轮"],
    status: "已投资",
    statusColor: "bg-blue-50 text-blue-700 border-blue-200",
    valuation: "25亿 USD",
    round: "A轮",
  },
  {
    id: "3",
    name: "智谱AI",
    logo: "智",
    description: "认知大模型技术与应用开发",
    tags: ["AI", "C轮"],
    status: "评估中",
    statusColor: "bg-amber-50 text-amber-700 border-amber-200",
    valuation: "30亿 USD",
    round: "C轮",
  },
  {
    id: "4",
    name: "百川智能",
    logo: "百",
    description: "大语言模型研发与应用",
    tags: ["AI", "B轮"],
    status: "已投资",
    statusColor: "bg-blue-50 text-blue-700 border-blue-200",
    valuation: "12亿 USD",
    round: "B轮",
  },
  {
    id: "5",
    name: "零一万物",
    logo: "零",
    description: "通用AI助理与多模态模型",
    tags: ["AI", "A轮"],
    status: "尽调中",
    statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    valuation: "8亿 USD",
    round: "A轮",
  },
  {
    id: "6",
    name: "阶跃星辰",
    logo: "阶",
    description: "多模态大模型与智能体平台",
    tags: ["AI", "Pre-A"],
    status: "评估中",
    statusColor: "bg-amber-50 text-amber-700 border-amber-200",
    valuation: "5亿 USD",
    round: "Pre-A",
  },
  {
    id: "7",
    name: "深势科技",
    logo: "深",
    description: "AI for Science，分子模拟与药物设计",
    tags: ["AI+科学", "B轮"],
    status: "已投资",
    statusColor: "bg-blue-50 text-blue-700 border-blue-200",
    valuation: "15亿 USD",
    round: "B轮",
  },
  {
    id: "8",
    name: "衔远科技",
    logo: "衔",
    description: "AI驱动的电商与消费品创新",
    tags: ["AI+消费", "A轮"],
    status: "评估中",
    statusColor: "bg-amber-50 text-amber-700 border-amber-200",
    valuation: "3亿 USD",
    round: "A轮",
  },
]

interface ProjectsGridProps {
  onSelectProject: (projectId: string) => void
}

export function ProjectsGrid({ onSelectProject }: ProjectsGridProps) {
  return (
    <div className="h-full overflow-auto bg-[#F3F4F6]">
      <div className="mx-auto max-w-7xl px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563EB] text-white">
              <FolderKanban className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#111827]">项目列表</h1>
              <p className="text-sm text-[#6B7280]">
                共 {mockProjects.length} 个投资项目
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2">
              <Search className="h-4 w-4 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="搜索项目..."
                className="w-48 bg-transparent text-sm text-[#374151] outline-none placeholder:text-[#9CA3AF]"
              />
            </div>
            <button className="flex items-center gap-1.5 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1D4ED8]">
              <Plus className="h-4 w-4" />
              新建项目
            </button>
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-4 gap-5">
          {mockProjects.map((project) => (
            <button
              key={project.id}
              onClick={() => onSelectProject(project.id)}
              className="group flex flex-col rounded-xl border border-[#E5E7EB] bg-white p-5 text-left transition-all hover:border-[#2563EB]/30 hover:shadow-lg hover:shadow-[#2563EB]/5"
            >
              {/* Logo & Status */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#111827] text-lg font-bold text-white transition-transform group-hover:scale-105">
                  {project.logo}
                </div>
                <Badge
                  className={`${project.statusColor} hover:${project.statusColor} text-xs`}
                >
                  {project.status}
                </Badge>
              </div>

              {/* Info */}
              <h3 className="text-base font-semibold text-[#111827] mb-1">
                {project.name}
              </h3>
              <p className="text-xs text-[#6B7280] mb-4 line-clamp-2 leading-relaxed">
                {project.description}
              </p>

              {/* Footer: Tags & Valuation */}
              <div className="mt-auto flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex rounded-md bg-[#F3F4F6] px-2 py-0.5 text-[11px] font-medium text-[#6B7280]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-xs font-medium text-[#374151]">
                  {project.valuation}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
