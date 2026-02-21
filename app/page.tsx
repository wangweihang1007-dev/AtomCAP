"use client"

import { useState } from "react"
import { AppTopbar, type TopNavKey } from "@/components/app-topbar"
import { ProjectsGrid } from "@/components/pages/projects-grid"
import { StrategiesGrid } from "@/components/pages/strategies-grid"
import { ProjectDetail } from "@/components/pages/project-detail"

type ViewState =
  | { type: "projects" }
  | { type: "strategies" }
  | { type: "project-detail"; projectId: string }

export default function Page() {
  const [view, setView] = useState<ViewState>({ type: "projects" })

  const activeNav: TopNavKey | null =
    view.type === "projects"
      ? "projects"
      : view.type === "strategies"
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

  function handleBackToProjects() {
    setView({ type: "projects" })
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <AppTopbar activeNav={activeNav} onNavigate={handleTopNav} />
      <main className="flex-1 overflow-hidden">
        {view.type === "projects" && (
          <ProjectsGrid onSelectProject={handleSelectProject} />
        )}
        {view.type === "strategies" && <StrategiesGrid />}
        {view.type === "project-detail" && (
          <ProjectDetail
            projectId={view.projectId}
            onBack={handleBackToProjects}
          />
        )}
      </main>
    </div>
  )
}
