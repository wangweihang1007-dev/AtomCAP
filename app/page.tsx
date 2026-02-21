"use client"

import { useState } from "react"
import { AppTopbar, type TopNavKey } from "@/components/app-topbar"
import { ProjectsGrid } from "@/components/pages/projects-grid"
import { StrategiesGrid } from "@/components/pages/strategies-grid"
import { ProjectDetail } from "@/components/pages/project-detail"
import { StrategyDetail } from "@/components/pages/strategy-detail"

type ViewState =
  | { type: "projects" }
  | { type: "strategies" }
  | { type: "project-detail"; projectId: string }
  | { type: "strategy-detail"; strategyId: string }

export default function Page() {
  const [view, setView] = useState<ViewState>({ type: "projects" })

  const activeNav: TopNavKey | null =
    view.type === "projects" || view.type === "project-detail"
      ? "projects"
      : view.type === "strategies" || view.type === "strategy-detail"
        ? "strategies"
        : null

  function handleTopNav(nav: TopNavKey) {
    if (nav === "projects") {
      setView({ type: "projects" })
    } else {
      setView({ type: "strategies" })
    }
  }

  function handleSelectProject(projectId: string) {
    setView({ type: "project-detail", projectId })
  }

  function handleSelectStrategy(strategyId: string) {
    setView({ type: "strategy-detail", strategyId })
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <AppTopbar activeNav={activeNav} onNavigate={handleTopNav} />
      <main className="flex-1 overflow-hidden">
        {view.type === "projects" && (
          <ProjectsGrid onSelectProject={handleSelectProject} />
        )}
        {view.type === "strategies" && (
          <StrategiesGrid onSelectStrategy={handleSelectStrategy} />
        )}
        {view.type === "project-detail" && (
          <ProjectDetail projectId={view.projectId} />
        )}
        {view.type === "strategy-detail" && (
          <StrategyDetail strategyId={view.strategyId} />
        )}
      </main>
    </div>
  )
}
