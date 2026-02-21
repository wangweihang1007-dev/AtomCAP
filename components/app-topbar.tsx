"use client"

import {
  LayoutDashboard,
  ListChecks,
  FileText,
  GitBranch,
  BarChart3,
  Settings,
  ChevronDown,
  FolderKanban,
  Briefcase,
  LogOut,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"

export type PageKey =
  | "overview"
  | "hypotheses"
  | "terms"
  | "workflow"
  | "analytics"
  | "settings"

interface NavItem {
  key: PageKey
  label: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { key: "overview", label: "项目概览", icon: LayoutDashboard },
  { key: "hypotheses", label: "假设清单", icon: ListChecks },
  { key: "terms", label: "条款构建", icon: FileText },
  { key: "workflow", label: "工作流", icon: GitBranch },
  { key: "analytics", label: "数据分析", icon: BarChart3 },
  { key: "settings", label: "系统设置", icon: Settings },
]

// Mock project data
const mockProjects = [
  { id: "1", name: "MiniMax", logo: "M", tags: ["AI", "B轮"], status: "尽调中" },
  { id: "2", name: "月之暗面", logo: "月", tags: ["AI", "A轮"], status: "已投资" },
  { id: "3", name: "智谱AI", logo: "智", tags: ["AI", "C轮"], status: "评估中" },
  { id: "4", name: "百川智能", logo: "百", tags: ["AI", "B轮"], status: "已投资" },
  { id: "5", name: "零一万物", logo: "零", tags: ["AI", "A轮"], status: "尽调中" },
  { id: "6", name: "阶跃星辰", logo: "阶", tags: ["AI", "Pre-A"], status: "评估中" },
]

// Mock strategy data
const mockStrategies = [
  { id: "1", name: "AI基础设施", type: "主题策略" },
  { id: "2", name: "大模型应用", type: "赛道策略" },
  { id: "3", name: "企业服务SaaS", type: "行业策略" },
  { id: "4", name: "生物科技", type: "主题策略" },
  { id: "5", name: "新能源汽车", type: "赛道策略" },
]

interface AppTopbarProps {
  activePage: PageKey
  onNavigate: (page: PageKey) => void
}

export function AppTopbar({ activePage, onNavigate }: AppTopbarProps) {
  const [projectsOpen, setProjectsOpen] = useState(false)
  const [strategiesOpen, setStrategiesOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 flex h-14 w-full items-center border-b border-border bg-[#0F172A] px-4 shrink-0">
      {/* Logo */}
      <div className="flex items-center mr-6">
        <span className="text-lg font-semibold italic text-white tracking-tight">
          AtomCAP
        </span>
      </div>

      {/* Page Navigation */}
      <nav className="flex items-center gap-0.5">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activePage === item.key
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#2563EB] text-white"
                  : "text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#CBD5E1]"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Separator */}
      <div className="mx-4 h-5 w-px bg-[#334155]" />

      {/* Project List Popover */}
      <Popover open={projectsOpen} onOpenChange={setProjectsOpen}>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-[#94A3B8] transition-colors hover:bg-[#1E293B] hover:text-[#CBD5E1]">
            <FolderKanban className="h-4 w-4" />
            <span>项目列表</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={8}
          className="w-[520px] p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">全部项目</h3>
            <span className="text-xs text-muted-foreground">
              {mockProjects.length} 个项目
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {mockProjects.map((project) => (
              <button
                key={project.id}
                onClick={() => {
                  onNavigate("overview")
                  setProjectsOpen(false)
                }}
                className="group flex flex-col items-start gap-2 rounded-lg border border-border bg-card p-3 text-left transition-colors hover:border-[#2563EB]/40 hover:bg-accent"
              >
                <div className="flex w-full items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0F172A] text-sm font-semibold text-white">
                    {project.logo}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {project.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {project.status}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex rounded-full border border-border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Strategy List Popover */}
      <Popover open={strategiesOpen} onOpenChange={setStrategiesOpen}>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-[#94A3B8] transition-colors hover:bg-[#1E293B] hover:text-[#CBD5E1]">
            <Briefcase className="h-4 w-4" />
            <span>策略列表</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={8}
          className="w-[400px] p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">投资策略</h3>
            <span className="text-xs text-muted-foreground">
              {mockStrategies.length} 个策略
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {mockStrategies.map((strategy) => (
              <button
                key={strategy.id}
                onClick={() => setStrategiesOpen(false)}
                className="group flex flex-col gap-1 rounded-lg border border-border bg-card p-3 text-left transition-colors hover:border-[#2563EB]/40 hover:bg-accent"
              >
                <p className="text-sm font-medium text-foreground">
                  {strategy.name}
                </p>
                <span className="inline-flex w-fit rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {strategy.type}
                </span>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Spacer */}
      <div className="flex-1" />

      {/* User Profile Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-[#1E293B]">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-[#334155] text-[10px] text-white">
                张伟
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-[#CBD5E1]">张伟</span>
            <ChevronDown className="h-3.5 w-3.5 text-[#94A3B8]" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={8} className="w-48">
          <DropdownMenuItem className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            个人信息
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            账户设置
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            退出登录
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
