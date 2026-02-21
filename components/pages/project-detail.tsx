"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  ListChecks,
  FileText,
  GitBranch,
  BarChart3,
  Settings,
  ArrowLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { HypothesisChecklist } from "@/components/pages/hypothesis-checklist"
import { ProjectOverview } from "@/components/pages/project-overview"
import { TermSheet } from "@/components/pages/term-sheet"
import { Workflow } from "@/components/pages/workflow"
import { DataAnalytics } from "@/components/pages/data-analytics"
import { SystemSettings } from "@/components/pages/system-settings"

type SubPageKey =
  | "overview"
  | "hypotheses"
  | "terms"
  | "workflow"
  | "analytics"
  | "settings"

interface SubNavItem {
  key: SubPageKey
  label: string
  icon: React.ElementType
}

const subNavItems: SubNavItem[] = [
  { key: "overview", label: "项目概览", icon: LayoutDashboard },
  { key: "hypotheses", label: "假设清单", icon: ListChecks },
  { key: "terms", label: "条款构建", icon: FileText },
  { key: "workflow", label: "工作流", icon: GitBranch },
  { key: "analytics", label: "数据分析", icon: BarChart3 },
  { key: "settings", label: "系统设置", icon: Settings },
]

const subPageComponents: Record<SubPageKey, React.ComponentType> = {
  overview: ProjectOverview,
  hypotheses: HypothesisChecklist,
  terms: TermSheet,
  workflow: Workflow,
  analytics: DataAnalytics,
  settings: SystemSettings,
}

interface ProjectDetailProps {
  projectId: string
  onBack: () => void
}

export function ProjectDetail({ projectId, onBack }: ProjectDetailProps) {
  const [activeSubPage, setActiveSubPage] = useState<SubPageKey>("overview")
  const ActiveComponent = subPageComponents[activeSubPage]

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Sub Navigation Bar */}
      <div className="flex items-center border-b border-[#E5E7EB] bg-white px-6 shrink-0">
        <button
          onClick={onBack}
          className="mr-4 flex items-center gap-1.5 rounded-lg py-2 pr-3 text-sm font-medium text-[#6B7280] transition-colors hover:text-[#111827]"
        >
          <ArrowLeft className="h-4 w-4" />
          返回
        </button>
        <div className="h-5 w-px bg-[#E5E7EB] mr-2" />
        <nav className="flex items-center gap-0.5">
          {subNavItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSubPage === item.key
            return (
              <button
                key={item.key}
                onClick={() => setActiveSubPage(item.key)}
                className={cn(
                  "flex items-center gap-1.5 border-b-2 px-3 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "border-[#2563EB] text-[#2563EB]"
                    : "border-transparent text-[#6B7280] hover:border-[#D1D5DB] hover:text-[#374151]"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Sub Page Content */}
      <div className="flex-1 overflow-hidden">
        <ActiveComponent />
      </div>
    </div>
  )
}
