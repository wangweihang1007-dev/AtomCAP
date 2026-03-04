"use client"

import { useState } from "react"
import { AppTopbar, type TopNavKey } from "@/components/app-topbar"
import { ProjectsGrid, type Project, type PendingProject, initialProjects } from "@/components/pages/projects-grid"
import { StrategiesGrid, type Strategy, type PendingStrategy, initialStrategies } from "@/components/pages/strategies-grid"
import { ProjectDetail } from "@/components/pages/project-detail"
import { StrategyDetail } from "@/components/pages/strategy-detail"
import { ChangeRequests } from "@/components/pages/change-requests"
import { Login } from "@/components/pages/login"
import type { Phase, PendingPhase } from "@/components/pages/workflow"

type ViewState =
  | { type: "login" }
  | { type: "projects" }
  | { type: "strategies" }
  | { type: "change-requests" }
  | { type: "project-detail"; projectId: string }
  | { type: "strategy-detail"; strategyId: string }

export default function Page() {
  const [view, setView] = useState<ViewState>({ type: "login" })
  const [strategies, setStrategies] = useState<Strategy[]>(initialStrategies)
  const [pendingStrategies, setPendingStrategies] = useState<PendingStrategy[]>([])
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [pendingProjects, setPendingProjects] = useState<PendingProject[]>([])
  // Workflow phases state per project - keyed by projectId
  const [projectPhases, setProjectPhases] = useState<Record<string, Phase[]>>({})
  const [pendingPhases, setPendingPhases] = useState<PendingPhase[]>([])

  const activeNav: TopNavKey | null =
    view.type === "projects" || view.type === "project-detail"
      ? "projects"
      : view.type === "strategies" || view.type === "strategy-detail"
        ? "strategies"
        : view.type === "change-requests"
          ? "change-requests"
          : null

  function handleLogin() {
    setView({ type: "projects" })
  }

  function handleTopNav(nav: TopNavKey) {
    if (nav === "projects") {
      setView({ type: "projects" })
    } else if (nav === "strategies") {
      setView({ type: "strategies" })
    } else if (nav === "change-requests") {
      setView({ type: "change-requests" })
    }
  }

  function handleSelectProject(projectId: string) {
    setView({ type: "project-detail", projectId })
  }

  function handleSelectStrategy(strategyId: string) {
    setView({ type: "strategy-detail", strategyId })
  }

  // Strategy change request handlers
  function handleCreatePendingStrategy(pending: PendingStrategy) {
    setPendingStrategies([pending, ...pendingStrategies])
    setView({ type: "change-requests" })
  }

  function handleApproveStrategy(id: string) {
    const pending = pendingStrategies.find((p) => p.id === id)
    if (pending) {
      const newStrategy: Strategy = {
        id: `new-${Date.now()}`,
        ...pending.strategy,
      }
      setStrategies([newStrategy, ...strategies])
      setPendingStrategies(pendingStrategies.filter((p) => p.id !== id))
    }
  }

  function handleRejectStrategy(id: string) {
    setPendingStrategies(pendingStrategies.filter((p) => p.id !== id))
  }

  // Project change request handlers
  function handleCreatePendingProject(pending: PendingProject) {
    setPendingProjects([pending, ...pendingProjects])
    setView({ type: "change-requests" })
  }

  function handleApproveProject(id: string) {
    const pending = pendingProjects.find((p) => p.id === id)
    if (pending) {
      const newProject: Project = {
        id: `new-project-${Date.now()}`,
        ...pending.project,
      }
      setProjects([newProject, ...projects])
      setPendingProjects(pendingProjects.filter((p) => p.id !== id))
    }
  }

  function handleRejectProject(id: string) {
    setPendingProjects(pendingProjects.filter((p) => p.id !== id))
  }

  // Workflow phase change request handlers
  function handleCreatePendingPhase(pending: PendingPhase) {
    setPendingPhases([pending, ...pendingPhases])
    setView({ type: "change-requests" })
  }

  function handleApprovePhase(id: string) {
    const pending = pendingPhases.find((p) => p.id === id)
    if (pending) {
      const { projectId, phase, changeType } = pending
      const currentPhases = projectPhases[projectId] || []
      
      // Mark previous active phase as completed if exists
      const updatedPhases = currentPhases.map((p) =>
        p.status === "active" 
          ? { ...p, status: "completed" as const, endDate: new Date().toISOString().split("T")[0] } 
          : p
      )
      
      // Add new phase with generated id
      const newPhase: Phase = {
        id: `${phase.groupLabel === "设立期" ? "setup" : "duration"}-${Date.now()}`,
        ...phase,
      }
      
      setProjectPhases({
        ...projectPhases,
        [projectId]: [...updatedPhases, newPhase],
      })
      setPendingPhases(pendingPhases.filter((p) => p.id !== id))
      
      // Navigate back to project detail
      setView({ type: "project-detail", projectId })
    }
  }

  function handleRejectPhase(id: string) {
    setPendingPhases(pendingPhases.filter((p) => p.id !== id))
  }

  // Helper to get phases for a project
  function getPhasesForProject(projectId: string): Phase[] {
    return projectPhases[projectId] || []
  }

  // Helper to update phases for a project
  function updatePhasesForProject(projectId: string, phases: Phase[]) {
    setProjectPhases({
      ...projectPhases,
      [projectId]: phases,
    })
  }

  if (view.type === "login") {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <AppTopbar activeNav={activeNav} onNavigate={handleTopNav} />
      <main className="flex-1 overflow-hidden">
        {view.type === "projects" && (
          <ProjectsGrid 
            projects={projects}
            strategies={strategies}
            onProjectsChange={setProjects}
            onSelectProject={handleSelectProject}
            onCreatePending={handleCreatePendingProject}
          />
        )}
        {view.type === "strategies" && (
          <StrategiesGrid 
            strategies={strategies}
            onStrategiesChange={setStrategies}
            onSelectStrategy={handleSelectStrategy}
            onCreatePending={handleCreatePendingStrategy}
          />
        )}
        {view.type === "change-requests" && (
          <ChangeRequests
            pendingStrategies={pendingStrategies}
            pendingProjects={pendingProjects}
            pendingPhases={pendingPhases}
            onApproveStrategy={handleApproveStrategy}
            onRejectStrategy={handleRejectStrategy}
            onApproveProject={handleApproveProject}
            onRejectProject={handleRejectProject}
            onApprovePhase={handleApprovePhase}
            onRejectPhase={handleRejectPhase}
          />
        )}
        {view.type === "project-detail" && (
          <ProjectDetail 
            projectId={view.projectId}
            project={projects.find((p) => p.id === view.projectId)}
            phases={getPhasesForProject(view.projectId)}
            onPhasesChange={(phases) => updatePhasesForProject(view.projectId, phases)}
            onCreatePendingPhase={handleCreatePendingPhase}
          />
        )}
        {view.type === "strategy-detail" && (
          <StrategyDetail 
            strategyId={view.strategyId} 
            strategy={strategies.find((s) => s.id === view.strategyId)}
          />
        )}
      </main>
    </div>
  )
}
