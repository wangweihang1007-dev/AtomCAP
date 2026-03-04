"use client"

import { Download, Eye, FileText, FileSpreadsheet, FileImage, File, FolderOpen, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface MaterialItem {
  id: string
  name: string
  format: string
  size: string
  description: string
}

const materials: MaterialItem[] = [
  {
    id: "m1",
    name: "MiniMax_财务数据_2023Q4",
    format: "XLSX",
    size: "2.4 MB",
    description: "2023年第四季度完整财务报表，包含收入、支出和利润明细",
  },
  {
    id: "m2",
    name: "MiniMax_商业计划书_v3",
    format: "PDF",
    size: "8.7 MB",
    description: "最新版商业计划书，涵盖市场分析、竞争格局和增长策略",
  },
  {
    id: "m3",
    name: "技术架构评估报告",
    format: "PDF",
    size: "5.1 MB",
    description: "AI 模型架构评估报告，包含技术栈分析和可扩展性评估",
  },
  {
    id: "m4",
    name: "MiniMax_团队介绍",
    format: "PPTX",
    size: "12.3 MB",
    description: "核心团队成员背景介绍及组织架构图",
  },
  {
    id: "m5",
    name: "尽调法律文件汇总",
    format: "PDF",
    size: "3.8 MB",
    description: "公司注册文件、股权结构、知识产权及合规材料汇总",
  },
  {
    id: "m6",
    name: "客户案例与合同样本",
    format: "DOCX",
    size: "1.5 MB",
    description: "重点客户案例研究及标准合同模板",
  },
  {
    id: "m7",
    name: "市场调研数据",
    format: "XLSX",
    size: "4.2 MB",
    description: "大模型行业市场规模、增长率和竞品对比数据",
  },
  {
    id: "m8",
    name: "产品演示录屏",
    format: "MP4",
    size: "156 MB",
    description: "MiniMax 核心产品功能演示视频",
  },
  {
    id: "m9",
    name: "数据安全合规报告",
    format: "PDF",
    size: "2.1 MB",
    description: "数据安全及隐私合规审计报告，包含 GDPR 和国内法规合规情况",
  },
  {
    id: "m10",
    name: "MiniMax_Logo素材包",
    format: "ZIP",
    size: "18.5 MB",
    description: "品牌标识素材包，包含各尺寸 Logo 和品牌规范文档",
  },
]

function getFormatIcon(format: string) {
  switch (format.toUpperCase()) {
    case "PDF":
    case "DOCX":
      return FileText
    case "XLSX":
      return FileSpreadsheet
    case "PNG":
    case "JPG":
    case "SVG":
      return FileImage
    default:
      return File
  }
}

function getFormatColor(format: string) {
  switch (format.toUpperCase()) {
    case "PDF":
      return "bg-red-50 text-red-700 border-red-200"
    case "XLSX":
      return "bg-emerald-50 text-emerald-700 border-emerald-200"
    case "DOCX":
      return "bg-blue-50 text-blue-700 border-blue-200"
    case "PPTX":
      return "bg-orange-50 text-orange-700 border-orange-200"
    case "MP4":
      return "bg-purple-50 text-purple-700 border-purple-200"
    case "ZIP":
      return "bg-amber-50 text-amber-700 border-amber-200"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

interface ProjectMaterialsProps {
  isNewProject?: boolean
  project?: {
    name?: string
  }
}

export function ProjectMaterials({ isNewProject = false, project }: ProjectMaterialsProps) {
  // Show empty state for new projects
  if (isNewProject) {
    return (
      <div className="flex h-full items-center justify-center bg-[#F9FAFB]">
        <div className="text-center max-w-md px-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#EFF6FF]">
            <FolderOpen className="h-8 w-8 text-[#2563EB]" />
          </div>
          <h3 className="text-lg font-semibold text-[#111827] mb-2">暂无项目材料</h3>
          <p className="text-sm text-[#6B7280] mb-6 leading-relaxed">
            {project?.name ? `「${project.name}」` : "该项目"}还没有上传任何材料。点击下方按钮开始上传您的第一份项目材料。
          </p>
          <button className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1D4ED8]">
            <Plus className="h-4 w-4" />
            上传材料
          </button>
        </div>
      </div>
    )
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-8">
        <h1 className="text-2xl font-bold text-[#111827]">项目材料</h1>
        <p className="mt-1 text-sm text-[#6B7280]">
          MiniMax - 项目相关材料与文件管理
        </p>

        <div className="mt-6 overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
          {/* Table Header */}
          <div className="grid grid-cols-[minmax(240px,2fr)_90px_80px_minmax(200px,3fr)_160px] items-center gap-4 border-b border-[#E5E7EB] bg-[#F9FAFB] px-6 py-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
              文件名称
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
              格式
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
              大小
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
              简介
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280] text-right">
              操作
            </span>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-[#F3F4F6]">
            {materials.map((item) => {
              const FormatIcon = getFormatIcon(item.format)
              return (
                <div
                  key={item.id}
                  className="grid grid-cols-[minmax(240px,2fr)_90px_80px_minmax(200px,3fr)_160px] items-center gap-4 px-6 py-4 transition-colors hover:bg-[#F9FAFB]"
                >
                  {/* File Name */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F3F4F6]">
                      <FormatIcon className="h-4.5 w-4.5 text-[#6B7280]" />
                    </div>
                    <span className="truncate text-sm font-medium text-[#111827]">
                      {item.name}
                    </span>
                  </div>

                  {/* Format */}
                  <div>
                    <Badge
                      variant="outline"
                      className={`text-xs font-medium ${getFormatColor(item.format)}`}
                    >
                      {item.format}
                    </Badge>
                  </div>

                  {/* Size */}
                  <span className="text-sm text-[#6B7280]">{item.size}</span>

                  {/* Description */}
                  <p className="truncate text-sm text-[#6B7280]">
                    {item.description}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1.5 text-xs"
                    >
                      <Download className="h-3.5 w-3.5" />
                      下载
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1.5 text-xs"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      详情
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}
