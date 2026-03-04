"use client"

import { useState, useRef, useEffect } from "react"
import {
  User,
  ListChecks,
  FileText,
  FolderOpen,
  Clock,
  ChevronRight,
  Plus,
  Check,
  ArrowRight,
  Lightbulb,
  FileSearch,
  FolderSearch,
  Brain,
  MessageSquare,
  X,
  Send,
  Bot,
  ClipboardList,
  GitBranch,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

/* ─── Types ──────────────────────────────────── */
export interface PhaseLog {
  action: string
  date: string
  author: string
}

export interface Phase {
  id: string
  groupLabel: string
  name: string
  fullLabel: string
  assignee: string
  assigneeAvatar: string
  hypothesesCount: number
  termsCount: number
  materialsCount: number
  status: "completed" | "active" | "upcoming"
  startDate: string
  endDate?: string
  logs: PhaseLog[]
}

export interface PendingPhase {
  id: string
  projectId: string
  projectName: string
  phase: Omit<Phase, "id">
  changeId: string
  changeName: string
  changeType: "next-setup" | "next-duration" | "enter-duration" | "first-setup"
  initiator: { id: string; name: string; initials: string }
  initiatedAt: string
  reviewers: { id: string; name: string; initials: string }[]
}

type SidebarType = 
  | "hypothesis-suggestions"
  | "term-suggestions"
  | "material-suggestions"
  | "ai-research"
  | "tracking-summary"
  | "ai-chat"
  | null

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

const PHASES: Phase[] = [
  {
    id: "setup-1",
    groupLabel: "\u8BBE\u7ACB\u671F",
    name: "\u8BBE\u7ACB\u671F - \u9636\u6BB51",
    fullLabel: "\u8BBE\u7ACB\u671F - \u9636\u6BB51",
    assignee: "\u5F20\u4F1F",
    assigneeAvatar: "\u5F20",
    hypothesesCount: 5,
    termsCount: 3,
    materialsCount: 8,
    status: "completed",
    startDate: "2024-01-05",
    endDate: "2024-01-20",
    logs: [
      { action: "\u4E0A\u4F20\u7ADE\u54C1\u5206\u6790\u62A5\u544A", date: "2024-01-12", author: "\u674E\u56DB" },
      { action: "\u5B8C\u6210\u9636\u6BB5\u5BA1\u6838", date: "2024-01-20", author: "\u738B\u4E94" },
    ],
  },
  {
    id: "setup-2",
    groupLabel: "\u8BBE\u7ACB\u671F",
    name: "\u8BBE\u7ACB\u671F - \u9636\u6BB52",
    fullLabel: "\u8BBE\u7ACB\u671F - \u9636\u6BB52",
    assignee: "\u674E\u56DB",
    assigneeAvatar: "\u674E",
    hypothesesCount: 8,
    termsCount: 5,
    materialsCount: 12,
    status: "completed",
    startDate: "2024-01-21",
    endDate: "2024-02-15",
    logs: [
      { action: "\u66F4\u65B0\u5047\u8BBE\u9A8C\u8BC1\u72B6\u6001", date: "2024-02-10", author: "\u5F20\u4F1F" },
      { action: "\u5B8C\u6210\u9636\u6BB5\u5BA1\u6838", date: "2024-02-15", author: "\u738B\u4E94" },
    ],
  },
  {
    id: "setup-3",
    groupLabel: "\u8BBE\u7ACB\u671F",
    name: "\u8BBE\u7ACB\u671F - \u9636\u6BB53",
    fullLabel: "\u8BBE\u7ACB\u671F - \u9636\u6BB53",
    assignee: "\u5F20\u4F1F",
    assigneeAvatar: "\u5F20",
    hypothesesCount: 10,
    termsCount: 8,
    materialsCount: 15,
    status: "completed",
    startDate: "2024-02-16",
    endDate: "2024-03-10",
    logs: [
      { action: "\u63D0\u4EA4IC\u5BA1\u6838\u6750\u6599", date: "2024-03-01", author: "\u674E\u56DB" },
      { action: "\u5B8C\u6210\u8BBE\u7ACB\u671F\u6700\u7EC8\u5BA1\u6838", date: "2024-03-10", author: "\u9648\u603B" },
    ],
  },
  {
    id: "duration-1",
    groupLabel: "\u5B58\u7EED\u671F",
    name: "\u5B58\u7EED\u671F - \u9636\u6BB51",
    fullLabel: "\u5B58\u7EED\u671F - \u9636\u6BB51",
    assignee: "\u738B\u82B3",
    assigneeAvatar: "\u738B",
    hypothesesCount: 10,
    termsCount: 8,
    materialsCount: 18,
    status: "completed",
    startDate: "2024-03-11",
    endDate: "2024-04-15",
    logs: [
      { action: "\u7B2C\u4E00\u6B21\u6295\u540E\u8DDF\u8E2A\u62A5\u544A", date: "2024-04-01", author: "\u738B\u82B3" },
      { action: "\u5B8C\u6210\u9636\u6BB5\u5BA1\u6838", date: "2024-04-15", author: "\u5F20\u4F1F" },
    ],
  },
  {
    id: "duration-2",
    groupLabel: "\u5B58\u7EED\u671F",
    name: "\u5B58\u7EED\u671F - \u9636\u6BB52",
    fullLabel: "\u5B58\u7EED\u671F - \u9636\u6BB52",
    assignee: "\u674E\u56DB",
    assigneeAvatar: "\u674E",
    hypothesesCount: 12,
    termsCount: 8,
    materialsCount: 22,
    status: "completed",
    startDate: "2024-04-16",
    endDate: "2024-06-20",
    logs: [
      { action: "\u63D0\u4EA4Q2\u8FD0\u8425\u6570\u636E", date: "2024-06-10", author: "\u738B\u82B3" },
      { action: "\u5B8C\u6210\u9636\u6BB5\u5BA1\u6838", date: "2024-06-20", author: "\u5F20\u4F1F" },
    ],
  },
  {
    id: "duration-3",
    groupLabel: "\u5B58\u7EED\u671F",
    name: "\u5B58\u7EED\u671F - \u9636\u6BB53",
    fullLabel: "\u5B58\u7EED\u671F - \u9636\u6BB53",
    assignee: "\u5F20\u4F1F",
    assigneeAvatar: "\u5F20",
    hypothesesCount: 12,
    termsCount: 9,
    materialsCount: 25,
    status: "completed",
    startDate: "2024-06-21",
    endDate: "2024-09-15",
    logs: [
      { action: "\u63D0\u4EA4Q3\u8BF4\u4F53\u62A5\u544A", date: "2024-09-05", author: "\u674E\u56DB" },
      { action: "\u5B8C\u6210\u9636\u6BB5\u5BA1\u6838", date: "2024-09-15", author: "\u9648\u603B" },
    ],
  },
  {
    id: "duration-4",
    groupLabel: "\u5B58\u7EED\u671F",
    name: "\u5B58\u7EED\u671F - \u9636\u6BB54",
    fullLabel: "\u5B58\u7EED\u671F - \u9636\u6BB54",
    assignee: "\u738B\u82B3",
    assigneeAvatar: "\u738B",
    hypothesesCount: 13,
    termsCount: 9,
    materialsCount: 28,
    status: "active",
    startDate: "2024-09-16",
    logs: [
      { action: "\u66F4\u65B0\u6761\u6B3E\u5BA1\u8BAE\u72B6\u6001", date: "2024-10-05", author: "\u5F20\u4F1F" },
      { action: "\u63D0\u4EA4\u8FD0\u8425\u6570\u636E\u66F4\u65B0", date: "2024-11-01", author: "\u674E\u56DB" },
    ],
  },
]

const statusConfig = {
  completed: {
    label: "\u5DF2\u5B8C\u6210",
    dotCls: "bg-emerald-500",
    badgeCls: "bg-emerald-50 text-emerald-700 border-emerald-200",
    borderCls: "border-emerald-200",
    bgCls: "bg-emerald-50/30",
  },
  active: {
    label: "\u8FDB\u884C\u4E2D",
    dotCls: "bg-[#2563EB]",
    badgeCls: "bg-blue-50 text-blue-700 border-blue-200",
    borderCls: "border-[#2563EB]",
    bgCls: "bg-blue-50/30",
  },
  upcoming: {
    label: "\u5F85\u542F\u52A8",
    dotCls: "bg-[#D1D5DB]",
    badgeCls: "bg-gray-50 text-gray-500 border-gray-200",
    borderCls: "border-[#E5E7EB]",
    bgCls: "bg-white",
  },
}

// Sidebar content configs
const sidebarConfigs: Record<Exclude<SidebarType, null | "ai-chat">, { title: string; icon: typeof Lightbulb; description: string; items: { title: string; content: string }[] }> = {
  "hypothesis-suggestions": {
    title: "\u5047\u8BBE\u6539\u8FDB\u5EFA\u8BAE",
    icon: Lightbulb,
    description: "\u57FA\u4E8E\u5F53\u524D\u9636\u6BB5\u7684\u5047\u8BBE\u6E05\u5355\uFF0C\u7CFB\u7EDF\u667A\u80FD\u751F\u6210\u4EE5\u4E0B\u6539\u8FDB\u5EFA\u8BAE",
    items: [
      { title: "\u8865\u5145\u6280\u672F\u58C1\u5792\u5047\u8BBE", content: "\u5EFA\u8BAE\u589E\u52A0\u5173\u4E8E\u6838\u5FC3\u6280\u672F\u4E13\u5229\u548C\u7814\u53D1\u56E2\u961F\u7A33\u5B9A\u6027\u7684\u5047\u8BBE\uFF0C\u4EE5\u66F4\u5168\u9762\u8BC4\u4F30\u6280\u672F\u58C1\u5792\u3002" },
      { title: "\u7EC6\u5316\u5E02\u573A\u89C4\u6A21\u5047\u8BBE", content: "\u5F53\u524D\u5E02\u573ATAM\u5047\u8BBE\u8FC7\u4E8E\u7B3C\u7EDF\uFF0C\u5EFA\u8BAE\u62C6\u5206\u4E3A\u5206\u5730\u533A\u3001\u5206\u884C\u4E1A\u7684\u7EC6\u5206\u5E02\u573A\u5047\u8BBE\u3002" },
      { title: "\u6DFB\u52A0\u7ADE\u4E89\u683C\u5C40\u5047\u8BBE", content: "\u5EFA\u8BAE\u589E\u52A0\u5173\u4E8E\u4E3B\u8981\u7ADE\u4E89\u5BF9\u624B\u53CA\u5E02\u573A\u4EFD\u989D\u53D8\u5316\u7684\u5047\u8BBE\u3002" },
    ],
  },
  "term-suggestions": {
    title: "\u6761\u6B3E\u6784\u5EFA\u5EFA\u8BAE",
    icon: FileText,
    description: "\u57FA\u4E8E\u884C\u4E1A\u6807\u51C6\u548C\u5F53\u524D\u9636\u6BB5\u7279\u70B9\uFF0C\u7CFB\u7EDF\u63A8\u8350\u4EE5\u4E0B\u6761\u6B3E\u6784\u5EFA\u5EFA\u8BAE",
    items: [
      { title: "\u52A0\u5F3A\u53CD\u7A00\u91CA\u4FDD\u62A4", content: "\u5EFA\u8BAE\u91C7\u7528\u52A0\u6743\u5E73\u5747\u53CD\u7A00\u91CA\u6761\u6B3E\uFF0C\u5E76\u660E\u786E\u89E6\u53D1\u6761\u4EF6\u548C\u8C03\u6574\u673A\u5236\u3002" },
      { title: "\u4F18\u5316\u6E05\u7B97\u4F18\u5148\u6743", content: "\u5EFA\u8BAE\u91C7\u75281x Non-Participating\u7ED3\u6784\uFF0C\u5E73\u8861\u6295\u8D44\u4EBA\u4FDD\u62A4\u548C\u521B\u59CB\u4EBA\u6FC0\u52B1\u3002" },
      { title: "\u5B8C\u5584\u4FE1\u606F\u6743\u6761\u6B3E", content: "\u5EFA\u8BAE\u589E\u52A0\u5B9A\u671F\u8D22\u52A1\u62A5\u544A\u3001\u91CD\u5927\u4E8B\u9879\u901A\u77E5\u7B49\u4FE1\u606F\u6743\u6761\u6B3E\u3002" },
    ],
  },
  "material-suggestions": {
    title: "\u6750\u6599\u6536\u96C6\u5EFA\u8BAE",
    icon: FolderSearch,
    description: "\u6839\u636E\u5F53\u524D\u9636\u6BB5\u9700\u6C42\uFF0C\u7CFB\u7EDF\u63A8\u8350\u6536\u96C6\u4EE5\u4E0B\u6750\u6599",
    items: [
      { title: "\u8865\u5145\u6280\u672F\u6587\u6863", content: "\u5EFA\u8BAE\u6536\u96C6\u6280\u672F\u67B6\u6784\u56FE\u3001API\u6587\u6863\u3001\u7CFB\u7EDF\u8BBE\u8BA1\u8BF4\u660E\u4E66\u7B49\u6280\u672F\u8D44\u6599\u3002" },
      { title: "\u8865\u5145\u5BA2\u6237\u6848\u4F8B", content: "\u5EFA\u8BAE\u6536\u96C63-5\u4E2A\u6807\u6746\u5BA2\u6237\u7684\u4F7F\u7528\u6848\u4F8B\u548C\u53CD\u9988\u62A5\u544A\u3002" },
      { title: "\u8865\u5145\u7ADE\u54C1\u5206\u6790", content: "\u5EFA\u8BAE\u6536\u96C6\u4E3B\u8981\u7ADE\u4E89\u5BF9\u624B\u7684\u4EA7\u54C1\u5BF9\u6BD4\u5206\u6790\u62A5\u544A\u3002" },
    ],
  },
  "ai-research": {
    title: "AI\u8C03\u7814\u6750\u6599",
    icon: Brain,
    description: "AI\u667A\u80FD\u751F\u6210\u7684\u8C03\u7814\u6750\u6599\u548C\u5206\u6790\u62A5\u544A",
    items: [
      { title: "\u884C\u4E1A\u8D8B\u52BF\u5206\u6790\u62A5\u544A", content: "\u57FA\u4E8E\u6700\u65B0\u5E02\u573A\u6570\u636E\uFF0CAI\u751F\u6210\u7684\u884C\u4E1A\u53D1\u5C55\u8D8B\u52BF\u5206\u6790\u3002" },
      { title: "\u7ADE\u4E89\u683C\u5C40\u5730\u56FE", content: "AI\u7ED8\u5236\u7684\u7ADE\u4E89\u5BF9\u624B\u5206\u5E03\u3001\u5E02\u573A\u4EFD\u989D\u3001\u6838\u5FC3\u4F18\u52BF\u5BF9\u6BD4\u3002" },
      { title: "\u6280\u672F\u6F14\u8FDB\u8DEF\u7EBF\u56FE", content: "AI\u5206\u6790\u7684\u6280\u672F\u53D1\u5C55\u8DEF\u7EBF\u548C\u672A\u6765\u8D8B\u52BF\u9884\u6D4B\u3002" },
    ],
  },
  "tracking-summary": {
    title: "\u8DDF\u8E2A\u60C5\u51B5\u6C47\u603B",
    icon: ClipboardList,
    description: "\u5F53\u524D\u9636\u6BB5\u7684\u6295\u540E\u8DDF\u8E2A\u60C5\u51B5\u6C47\u603B",
    items: [
      { title: "\u8FD0\u8425\u6307\u6807\u8DDF\u8E2A", content: "MAU\u540C\u6BD4\u589E\u957F35%\uFF0C\u8425\u6536\u540C\u6BD4\u589E\u957F42%\uFF0C\u5BA2\u6237\u7559\u5B58\u7387\u4FDD\u6301\u572885%\u4EE5\u4E0A\u3002" },
      { title: "\u5047\u8BBE\u9A8C\u8BC1\u8FDB\u5EA6", content: "12\u4E2A\u5047\u8BBE\u4E2D\uFF0C9\u4E2A\u5DF2\u9A8C\u8BC1\u6210\u7ACB\uFF0C2\u4E2A\u5F85\u51B3\u8BAE\uFF0C1\u4E2A\u4E0D\u6210\u7ACB\u3002" },
      { title: "\u91CD\u5927\u4E8B\u9879\u8BB0\u5F55", content: "\u672C\u9636\u6BB5\u5B8C\u6210B\u8F6E\u878D\u8D44\uFF0C\u4F30\u503C\u63D0\u534740%\uFF0C\u56E2\u961F\u6269\u5F2030\u4EBA\u3002" },
    ],
  },
}

/* ─── Props ──────────────────────────────────── */
interface WorkflowProps {
  onSelectPhase?: (phaseName: string) => void
  isNewProject?: boolean
  projectId?: string
  projectName?: string
  phases?: Phase[]
  onPhasesChange?: (phases: Phase[]) => void
  onCreatePendingPhase?: (pending: PendingPhase) => void
}

/* ─── New Project Phase Template ─────────────── */
function createNewPhase(phaseNumber: number, isSetup: boolean): Phase {
  const groupLabel = isSetup ? "设立期" : "存续期"
  const today = new Date().toISOString().split("T")[0]
  return {
    id: `${isSetup ? "setup" : "duration"}-${phaseNumber}`,
    groupLabel,
    name: `${groupLabel} - 阶段${phaseNumber}`,
    fullLabel: `${groupLabel} - 阶段${phaseNumber}`,
    assignee: "张伟",
    assigneeAvatar: "张",
    hypothesesCount: 0,
    termsCount: 0,
    materialsCount: 0,
    status: "active",
    startDate: today,
    logs: [],
  }
}

/* ─── Component ──────────────────────────────── */
export function Workflow({ 
  onSelectPhase, 
  isNewProject = false,
  projectId = "",
  projectName = "",
  phases,
  onPhasesChange,
  onCreatePendingPhase,
}: WorkflowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Use props phases if provided, otherwise use default PHASES for existing projects
  const projectPhases = phases ?? (isNewProject ? [] : PHASES)
  
  // Calculate current phase numbers from phases
  const currentSetupPhase = projectPhases.filter(p => p.groupLabel === "设立期").length
  const currentDurationPhase = projectPhases.filter(p => p.groupLabel === "存续期").length
  const isInDuration = currentDurationPhase > 0

  // Default to the latest active or last completed phase
  const defaultPhase = (() => {
    if (projectPhases.length === 0) return null
    const active = projectPhases.find((p) => p.status === "active")
    if (active) return active.id
    const completed = projectPhases.filter((p) => p.status === "completed")
    return completed.length > 0 ? completed[completed.length - 1].id : projectPhases[0].id
  })()

  const [selectedPhase, setSelectedPhase] = useState<string | null>(defaultPhase)
  const [activeSidebar, setActiveSidebar] = useState<SidebarType>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState("")

  // Handle starting the first phase for new projects - creates pending request
  function handleStartFirstPhase() {
    const newPhase = createNewPhase(1, true)
    const pendingPhase: PendingPhase = {
      id: `pending-phase-${Date.now()}`,
      projectId,
      projectName,
      phase: newPhase,
      changeId: `CR-P-${Date.now().toString().slice(-6)}`,
      changeName: `启动${newPhase.fullLabel}`,
      changeType: "first-setup",
      initiator: { id: "zhangwei", name: "张伟", initials: "张伟" },
      initiatedAt: new Date().toISOString().split("T")[0],
      reviewers: [
        { id: "zhangwei", name: "张伟", initials: "张伟" },
        { id: "lisi", name: "李四", initials: "李四" },
      ],
    }
    onCreatePendingPhase?.(pendingPhase)
  }

  // Handle starting next setup phase - creates pending request
  function handleStartNextSetupPhase() {
    const nextPhaseNum = currentSetupPhase + 1
    const newPhase = createNewPhase(nextPhaseNum, true)
    const pendingPhase: PendingPhase = {
      id: `pending-phase-${Date.now()}`,
      projectId,
      projectName,
      phase: newPhase,
      changeId: `CR-P-${Date.now().toString().slice(-6)}`,
      changeName: `启动${newPhase.fullLabel}`,
      changeType: "next-setup",
      initiator: { id: "zhangwei", name: "张伟", initials: "张伟" },
      initiatedAt: new Date().toISOString().split("T")[0],
      reviewers: [
        { id: "zhangwei", name: "张伟", initials: "张伟" },
        { id: "lisi", name: "李四", initials: "李四" },
      ],
    }
    onCreatePendingPhase?.(pendingPhase)
  }

  // Handle entering duration period - creates pending request
  function handleEnterDuration() {
    const newPhase = createNewPhase(1, false)
    const pendingPhase: PendingPhase = {
      id: `pending-phase-${Date.now()}`,
      projectId,
      projectName,
      phase: newPhase,
      changeId: `CR-P-${Date.now().toString().slice(-6)}`,
      changeName: `进入存续期 - ${newPhase.fullLabel}`,
      changeType: "enter-duration",
      initiator: { id: "zhangwei", name: "张伟", initials: "张伟" },
      initiatedAt: new Date().toISOString().split("T")[0],
      reviewers: [
        { id: "zhangwei", name: "张伟", initials: "张伟" },
        { id: "lisi", name: "李四", initials: "李四" },
      ],
    }
    onCreatePendingPhase?.(pendingPhase)
  }

  // Handle starting next duration phase - creates pending request
  function handleStartNextDurationPhase() {
    const nextPhaseNum = currentDurationPhase + 1
    const newPhase = createNewPhase(nextPhaseNum, false)
    const pendingPhase: PendingPhase = {
      id: `pending-phase-${Date.now()}`,
      projectId,
      projectName,
      phase: newPhase,
      changeId: `CR-P-${Date.now().toString().slice(-6)}`,
      changeName: `启动${newPhase.fullLabel}`,
      changeType: "next-duration",
      initiator: { id: "zhangwei", name: "张伟", initials: "张伟" },
      initiatedAt: new Date().toISOString().split("T")[0],
      reviewers: [
        { id: "zhangwei", name: "张伟", initials: "张伟" },
        { id: "lisi", name: "李四", initials: "李四" },
      ],
    }
    onCreatePendingPhase?.(pendingPhase)
  }

  // Notify parent of initial phase on mount
  useEffect(() => {
    if (defaultPhase) {
      const phase = projectPhases.find((p) => p.id === defaultPhase)
      if (phase && onSelectPhase) {
        onSelectPhase(phase.fullLabel)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Scroll to selected phase card on mount
  useEffect(() => {
    if (scrollRef.current && !activeSidebar && defaultPhase) {
      const card = scrollRef.current.querySelector(`[data-phase="${defaultPhase}"]`)
      if (card) {
        card.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
      }
    }
  }, [defaultPhase, activeSidebar])

  function handleSelectPhase(phaseId: string) {
    setSelectedPhase(phaseId)
    const phase = PHASES.find((p) => p.id === phaseId)
    if (phase && onSelectPhase) {
      onSelectPhase(phase.fullLabel)
    }
  }

  function handleStartNextPhase() {
    const nextPhase = PHASES.find((p) => p.status === "upcoming")
    if (nextPhase) {
      setSelectedPhase(nextPhase.id)
      if (onSelectPhase) {
        onSelectPhase(nextPhase.fullLabel)
      }
    }
  }

  function handleOpenSidebar(type: SidebarType) {
    setActiveSidebar(type)
    if (type === "ai-chat") {
      setChatMessages([
        { role: "assistant", content: "\u60A8\u597D\uFF01\u6211\u662F\u60A8\u7684AI\u667A\u80FD\u52A9\u624B\uFF0C\u53EF\u4EE5\u57FA\u4E8E\u5F53\u524D\u9636\u6BB5\u7684\u4FE1\u606F\u56DE\u7B54\u60A8\u7684\u95EE\u9898\uFF0C\u5E2E\u52A9\u60A8\u751F\u6210\u6240\u9700\u7684\u6750\u6599\u3002\u8BF7\u95EE\u6709\u4EC0\u4E48\u53EF\u4EE5\u5E2E\u60A8\uFF1F" }
      ])
    }
  }

  function handleCloseSidebar() {
    setActiveSidebar(null)
    setChatMessages([])
    setChatInput("")
  }

  function handleSendChat() {
    if (!chatInput.trim()) return
    const userMsg: ChatMessage = { role: "user", content: chatInput.trim() }
    setChatMessages((prev) => [...prev, userMsg])
    setChatInput("")
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        role: "assistant",
        content: "\u8C22\u8C22\u60A8\u7684\u63D0\u95EE\u3002\u57FA\u4E8E\u5F53\u524D\u9636\u6BB5\u7684\u6570\u636E\uFF0C\u6211\u6B63\u5728\u4E3A\u60A8\u751F\u6210\u76F8\u5173\u5206\u6790...\n\n\u6839\u636E\u60A8\u7684\u9700\u6C42\uFF0C\u6211\u5EFA\u8BAE\u60A8\u53EF\u4EE5\u4ECE\u4EE5\u4E0B\u51E0\u4E2A\u65B9\u9762\u8FDB\u884C\u8003\u8651\uFF1A\n1. \u5B8C\u5584\u5F53\u524D\u5047\u8BBE\u7684\u8BBA\u636E\u652F\u6301\n2. \u6536\u96C6\u66F4\u591A\u5BA2\u6237\u53CD\u9988\u6570\u636E\n3. \u8865\u5145\u7ADE\u54C1\u5206\u6790\u6750\u6599\n\n\u5982\u9700\u8FDB\u4E00\u6B65\u5E2E\u52A9\uFF0C\u8BF7\u968F\u65F6\u544A\u8BC9\u6211\u3002"
      }
      setChatMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  const currentPhase = projectPhases.find((p) => p.id === selectedPhase)
  const isSetupPhase = currentPhase?.groupLabel === "设立期"

  // Group phases for rendering group headers
  let lastGroup = ""

  // Show empty state for new projects with no phases started
  if (isNewProject && projectPhases.length === 0) {
    return (
      <div className="flex h-full items-center justify-center bg-[#F9FAFB]">
        <div className="text-center max-w-md px-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#EFF6FF]">
            <GitBranch className="h-8 w-8 text-[#2563EB]" />
          </div>
          <h3 className="text-lg font-semibold text-[#111827] mb-2">暂无工作流</h3>
          <p className="text-sm text-[#6B7280] mb-6 leading-relaxed">
            这是一个新创建的项目，工作流尚未启动。点击下方按钮启动项目的第一个阶段。
          </p>
          <button 
            onClick={handleStartFirstPhase}
            className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1D4ED8]"
          >
            <Plus className="h-4 w-4" />
            启动设立期 - 阶段1
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full bg-[#F3F4F6]">
      {/* Main Content Area */}
      <div className={cn("flex flex-col transition-all duration-300", activeSidebar ? "flex-1" : "w-full")}>
        {/* Header */}
        <div className="shrink-0 border-b border-[#E5E7EB] bg-white px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#111827]">工作流</h1>
              <p className="mt-1 text-sm text-[#6B7280]">
                项目生命周期管理 - 点击阶段卡片切换版本
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Show different buttons based on project state - no phase limits */}
              {isNewProject && !isInDuration && currentSetupPhase > 0 && (
                <>
                  <button
                    onClick={handleStartNextSetupPhase}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1D4ED8]"
                  >
                    <Plus className="h-4 w-4" />
                    启动下一阶段
                  </button>
                  <button
                    onClick={handleEnterDuration}
                    className="inline-flex items-center gap-2 rounded-lg border-2 border-[#10B981] bg-white px-4 py-2.5 text-sm font-medium text-[#10B981] transition-colors hover:bg-[#ECFDF5]"
                  >
                    <ArrowRight className="h-4 w-4" />
                    进入存续期
                  </button>
                </>
              )}
              {isNewProject && isInDuration && (
                <button
                  onClick={handleStartNextDurationPhase}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1D4ED8]"
                >
                  <Plus className="h-4 w-4" />
                  启动下一阶段
                </button>
              )}
              {!isNewProject && (
                <button
                  onClick={handleStartNextPhase}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1D4ED8]"
                >
                  <Plus className="h-4 w-4" />
                  启动下一阶段
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Phase Timeline or Compact Card */}
        {activeSidebar ? (
          // Compact view when sidebar is open
          <div className="flex-1 flex items-start justify-center p-6">
            {currentPhase && (
              <CompactPhaseCard phase={currentPhase} />
            )}
          </div>
        ) : (
          // Full timeline view
          <div ref={scrollRef} className="flex-1 overflow-x-auto overflow-y-hidden">
            <div className="flex items-start gap-4 p-6 min-w-max h-full">
              {projectPhases.map((phase, idx) => {
                const isSelected = selectedPhase === phase.id
                const sc = statusConfig[phase.status]
                const showGroupHeader = phase.groupLabel !== lastGroup
                lastGroup = phase.groupLabel
                const isLastInGroup = idx < projectPhases.length - 1 ? projectPhases[idx + 1].groupLabel !== phase.groupLabel : true
                const isSetup = phase.groupLabel === "设立期"

                return (
                  <div key={phase.id} className="flex items-start shrink-0">
                    {/* Group header + card */}
                    <div className="flex flex-col">
                      {showGroupHeader && (
                        <div className="mb-3 flex items-center gap-2">
                          <span className={cn("h-2.5 w-2.5 rounded-full", isSetup ? "bg-violet-500" : "bg-teal-500")} />
                          <span className="text-sm font-semibold text-[#374151]">{phase.groupLabel}</span>
                        </div>
                      )}
                      {!showGroupHeader && <div className="mb-3 h-[22px]" />}

                      {/* Phase Card */}
                      <button
                        data-phase={phase.id}
                        onClick={() => handleSelectPhase(phase.id)}
                        className={cn(
                          "w-[260px] rounded-xl border-2 p-5 text-left transition-all",
                          isSelected
                            ? "border-[#2563EB] bg-blue-50/40 shadow-lg shadow-blue-100/50 ring-1 ring-[#2563EB]/20"
                            : cn("hover:shadow-md", sc.borderCls, sc.bgCls)
                        )}
                      >
                        {/* Card Header */}
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-semibold text-[#111827]">{phase.name}</h3>
                          <Badge className={cn("text-[10px] px-1.5 py-0", sc.badgeCls)}>
                            <span className={cn("mr-1 inline-block h-1.5 w-1.5 rounded-full", sc.dotCls)} />
                            {sc.label}
                          </Badge>
                        </div>

                        {/* Assignee */}
                        {phase.assignee && (
                          <div className="flex items-center gap-2 mb-3">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="bg-[#E5E7EB] text-[10px] text-[#374151]">
                                {phase.assigneeAvatar}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-[#6B7280]">{"\u8D1F\u8D23\u4EBA: "}{phase.assignee}</span>
                          </div>
                        )}

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          <div className="flex items-center gap-1.5 rounded-lg bg-white/80 px-2 py-1.5 border border-[#E5E7EB]">
                            <ListChecks className="h-3 w-3 text-[#2563EB]" />
                            <div>
                              <p className="text-[10px] text-[#9CA3AF]">{"\u5047\u8BBE"}</p>
                              <p className="text-xs font-semibold text-[#111827]">{phase.hypothesesCount}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 rounded-lg bg-white/80 px-2 py-1.5 border border-[#E5E7EB]">
                            <FileText className="h-3 w-3 text-emerald-600" />
                            <div>
                              <p className="text-[10px] text-[#9CA3AF]">{"\u6761\u6B3E"}</p>
                              <p className="text-xs font-semibold text-[#111827]">{phase.termsCount}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 rounded-lg bg-white/80 px-2 py-1.5 border border-[#E5E7EB]">
                            <FolderOpen className="h-3 w-3 text-amber-600" />
                            <div>
                              <p className="text-[10px] text-[#9CA3AF]">{"\u6750\u6599"}</p>
                              <p className="text-xs font-semibold text-[#111827]">{phase.materialsCount}</p>
                            </div>
                          </div>
                        </div>

                        {/* Date */}
                        {phase.startDate && (
                          <div className="text-[11px] text-[#9CA3AF] mb-3">
                            {phase.startDate}
                            {phase.endDate ? ` \u2192 ${phase.endDate}` : " \u2192 \u8FDB\u884C\u4E2D"}
                          </div>
                        )}

                        {/* Recent Logs */}
                        {phase.logs.length > 0 && (
                          <div className="border-t border-[#E5E7EB] pt-3 space-y-1.5">
                            <p className="text-[10px] font-medium text-[#9CA3AF] uppercase tracking-wider">{"\u66F4\u65B0\u65E5\u5FD7"}</p>
                            {phase.logs.slice(-2).map((log, i) => (
                              <div key={i} className="flex items-start gap-1.5">
                                <Clock className="h-3 w-3 mt-0.5 text-[#D1D5DB] shrink-0" />
                                <p className="text-[11px] text-[#6B7280] leading-snug">
                                  <span className="text-[#374151] font-medium">{log.author}</span>
                                  {" "}{log.action}
                                  <span className="text-[#9CA3AF]">{" \u00B7 "}{log.date}</span>
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Upcoming placeholder */}
                        {phase.status === "upcoming" && (
                          <div className="flex items-center justify-center py-4 text-[#D1D5DB]">
                            <p className="text-xs">{"\u5F85\u542F\u52A8"}</p>
                          </div>
                        )}

                        {/* Selected indicator */}
                        {isSelected && (
                          <div className="mt-3 flex items-center gap-1.5 text-[#2563EB]">
                            <Check className="h-3.5 w-3.5" />
                            <span className="text-xs font-medium">{"\u5F53\u524D\u9009\u4E2D"}</span>
                          </div>
                        )}
                      </button>

                      {/* Action Buttons - Only shown for selected phase */}
                      {isSelected && phase.status !== "upcoming" && (
                        <div className="mt-3 w-[260px] space-y-1.5">
                          {/* Phase-specific buttons - vertical layout */}
                          {isSetup ? (
                            <>
                              <ActionButton icon={Lightbulb} label="假设改进建议" onClick={() => handleOpenSidebar("hypothesis-suggestions")} />
                              <ActionButton icon={FileText} label="条款构建建议" onClick={() => handleOpenSidebar("term-suggestions")} />
                              <ActionButton icon={FolderSearch} label="材料收集建议" onClick={() => handleOpenSidebar("material-suggestions")} />
                              <ActionButton icon={Brain} label="AI调研材料" onClick={() => handleOpenSidebar("ai-research")} />
                            </>
                          ) : (
                            <>
                              <ActionButton icon={ClipboardList} label="跟踪情况汇总" onClick={() => handleOpenSidebar("tracking-summary")} />
                              <ActionButton icon={FolderSearch} label="材料收集建议" onClick={() => handleOpenSidebar("material-suggestions")} />
                              <ActionButton icon={Brain} label="AI调研材料" onClick={() => handleOpenSidebar("ai-research")} />
                            </>
                          )}
                          {/* AI Chat Button */}
                          <button
                            onClick={() => handleOpenSidebar("ai-chat")}
                            className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 px-3 py-2 text-xs font-medium text-white transition-all hover:from-violet-600 hover:to-purple-700"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                            AI智能问答
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Connector Arrow (between cards) */}
                    {idx < PHASES.length - 1 && (
                      <div className="flex items-center self-center mt-6 px-1">
                        {isLastInGroup ? (
                          <div className="flex items-center gap-1">
                            <div className="h-px w-4 bg-[#D1D5DB]" />
                            <ChevronRight className="h-4 w-4 text-[#9CA3AF]" />
                            <div className="h-px w-4 bg-[#D1D5DB]" />
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <div className="h-px w-6 bg-[#D1D5DB]" />
                            <ArrowRight className="h-3.5 w-3.5 text-[#D1D5DB]" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      {activeSidebar && (
        <div className="w-[420px] shrink-0 border-l border-[#E5E7EB] bg-white flex flex-col">
          {activeSidebar === "ai-chat" ? (
            // AI Chat Sidebar
            <>
              <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#111827]">{"AI\u667A\u80FD\u95EE\u7B54"}</h3>
                    <p className="text-xs text-[#6B7280]">{currentPhase?.fullLabel}</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseSidebar}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6B7280] transition-colors hover:bg-[#F3F4F6] hover:text-[#111827]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              {/* Chat Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                      <div className={cn(
                        "max-w-[85%] rounded-xl px-4 py-3",
                        msg.role === "user"
                          ? "bg-[#2563EB] text-white"
                          : "bg-[#F3F4F6] text-[#374151]"
                      )}>
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Chat Input */}
              <div className="border-t border-[#E5E7EB] p-4">
                <div className="flex items-center gap-2">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendChat()}
                    placeholder={"\u8F93\u5165\u60A8\u7684\u95EE\u9898..."}
                    className="flex-1"
                  />
                  <button
                    onClick={handleSendChat}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2563EB] text-white transition-colors hover:bg-[#1D4ED8]"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            // Content Sidebar
            <>
              <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
                <div className="flex items-center gap-3">
                  {(() => {
                    const config = sidebarConfigs[activeSidebar]
                    const IconComponent = config.icon
                    return (
                      <>
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EFF6FF]">
                          <IconComponent className="h-5 w-5 text-[#2563EB]" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-[#111827]">{config.title}</h3>
                          <p className="text-xs text-[#6B7280]">{currentPhase?.fullLabel}</p>
                        </div>
                      </>
                    )
                  })()}
                </div>
                <button
                  onClick={handleCloseSidebar}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6B7280] transition-colors hover:bg-[#F3F4F6] hover:text-[#111827]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-5 space-y-4">
                  <p className="text-sm text-[#6B7280]">
                    {sidebarConfigs[activeSidebar].description}
                  </p>
                  <div className="space-y-3">
                    {sidebarConfigs[activeSidebar].items.map((item, i) => (
                      <div key={i} className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4">
                        <h4 className="text-sm font-semibold text-[#111827] mb-2">{item.title}</h4>
                        <p className="text-sm text-[#6B7280] leading-relaxed">{item.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </div>
      )}
    </div>
  )
}

/* ─── Helper Components ──────────────────────── */
function ActionButton({ icon: Icon, label, onClick }: { icon: typeof Lightbulb; label: string; onClick: () => void }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className="w-full flex items-center gap-2 rounded-lg bg-white border border-[#E5E7EB] px-3 py-2 text-xs font-medium text-[#374151] transition-colors hover:bg-[#F3F4F6] hover:border-[#D1D5DB]"
    >
      <Icon className="h-3.5 w-3.5 text-[#6B7280]" />
      {label}
    </button>
  )
}

function CompactPhaseCard({ phase }: { phase: Phase }) {
  const sc = statusConfig[phase.status]
  
  return (
    <div className="w-[280px] rounded-xl border-2 border-[#2563EB] bg-blue-50/40 p-5 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[#111827]">{phase.name}</h3>
        <Badge className={cn("text-[10px] px-1.5 py-0", sc.badgeCls)}>
          <span className={cn("mr-1 inline-block h-1.5 w-1.5 rounded-full", sc.dotCls)} />
          {sc.label}
        </Badge>
      </div>

      {/* Assignee */}
      {phase.assignee && (
        <div className="flex items-center gap-2 mb-3">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="bg-[#E5E7EB] text-[10px] text-[#374151]">
              {phase.assigneeAvatar}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-[#6B7280]">{"\u8D1F\u8D23\u4EBA: "}{phase.assignee}</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="flex items-center gap-1.5 rounded-lg bg-white/80 px-2 py-1.5 border border-[#E5E7EB]">
          <ListChecks className="h-3 w-3 text-[#2563EB]" />
          <div>
            <p className="text-[10px] text-[#9CA3AF]">{"\u5047\u8BBE"}</p>
            <p className="text-xs font-semibold text-[#111827]">{phase.hypothesesCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg bg-white/80 px-2 py-1.5 border border-[#E5E7EB]">
          <FileText className="h-3 w-3 text-emerald-600" />
          <div>
            <p className="text-[10px] text-[#9CA3AF]">{"\u6761\u6B3E"}</p>
            <p className="text-xs font-semibold text-[#111827]">{phase.termsCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg bg-white/80 px-2 py-1.5 border border-[#E5E7EB]">
          <FolderOpen className="h-3 w-3 text-amber-600" />
          <div>
            <p className="text-[10px] text-[#9CA3AF]">{"\u6750\u6599"}</p>
            <p className="text-xs font-semibold text-[#111827]">{phase.materialsCount}</p>
          </div>
        </div>
      </div>

      {/* Date */}
      {phase.startDate && (
        <div className="text-[11px] text-[#9CA3AF]">
          {phase.startDate}
          {phase.endDate ? ` \u2192 ${phase.endDate}` : " \u2192 \u8FDB\u884C\u4E2D"}
        </div>
      )}
    </div>
  )
}
