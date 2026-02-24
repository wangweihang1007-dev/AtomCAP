"use client"

import { useState } from "react"
import {
  Search,
  Upload,
  FileText,
  ChevronRight,
  ChevronDown,
  ListChecks,
  PanelLeftClose,
  PanelLeft,
  Send,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ */
/*  Data types                                                         */
/* ------------------------------------------------------------------ */
interface Person {
  name: string
  initials: string
  color: string // tailwind bg class
}

interface HypothesisNode {
  id: string
  label: string
  fullName?: string
  status: "verified" | "pending" | "risky"
  children?: HypothesisNode[]
}

interface EvidenceFile {
  name: string
  size: string
  date: string
}

interface PointAnalysis {
  content: string
  creator: Person
  reviewers: Person[]
  createdAt: string
}

interface ValuePoint {
  id: string
  title: string
  evidence: { description: string; files: EvidenceFile[] }
  analysis: PointAnalysis
  comments: { author: string; content: string; time: string }[]
}

interface RiskPoint {
  id: string
  title: string
  evidence: { description: string; files: EvidenceFile[] }
  analysis: PointAnalysis
  comments: { author: string; content: string; time: string }[]
}

interface DecisionSection {
  conclusion: string
  status: "approved" | "rejected" | "pending" | "confirmed" | "invalidated"
  content: string
  creator: Person
  reviewers: Person[]
  createdAt: string
  comments: { author: string; content: string; time: string }[]
}

interface HypothesisDetail {
  id: string
  title: string
  qaId: string
  createdAt: string
  updatedAt: string
  status: "verified" | "pending" | "risky"
  valuePoints: ValuePoint[]
  riskPoints: RiskPoint[]
  committeeDecision: DecisionSection
  verification: DecisionSection
}

/* ------------------------------------------------------------------ */
/*  Person palette                                                     */
/* ------------------------------------------------------------------ */
const PEOPLE: Record<string, Person> = {
  zhangwei: { name: "\u5F20\u4F1F", initials: "\u5F20", color: "bg-blue-500" },
  lisi: { name: "\u674E\u56DB", initials: "\u674E", color: "bg-emerald-500" },
  wangwu: { name: "\u738B\u4E94", initials: "\u738B", color: "bg-violet-500" },
  wangtotal: { name: "\u738B\u603B", initials: "\u738B", color: "bg-orange-500" },
  chentotal: { name: "\u9648\u603B", initials: "\u9648", color: "bg-rose-500" },
  zhaoliu: { name: "\u8D75\u516D", initials: "\u8D75", color: "bg-cyan-500" },
  liuqi: { name: "\u5218\u4E03", initials: "\u5218", color: "bg-amber-500" },
}

/* ------------------------------------------------------------------ */
/*  Mock tree data                                                     */
/* ------------------------------------------------------------------ */
const hypothesisTree: { category: string; id: string; items: HypothesisNode[] }[] = [
  {
    category: "\u56E2\u961F\u4E0E\u7EC4\u7EC7\u80FD\u529B",
    id: "team",
    items: [
      {
        id: "founder",
        label: "\u521B\u59CB\u4EBA\u95EB\u4FCA\u6770",
        status: "verified",
        children: [
          {
            id: "tech-bg",
            label: "\u6280\u672F\u80CC\u666F",
            fullName: "\u521B\u59CB\u4EBA\u95EB\u4FCA\u6770\u5177\u6709\u624E\u5B9E\u7684\u4EBA\u5DE5\u667A\u80FD\u5B66\u672F\u80CC\u666F",
            status: "verified",
          },
          {
            id: "biz-exp",
            label: "\u5546\u4E1A\u7ECF\u9A8C",
            fullName: "\u521B\u59CB\u4EBA\u5177\u5907\u4E30\u5BCC\u7684AI\u4EA7\u54C1\u5546\u4E1A\u5316\u7ECF\u9A8C",
            status: "pending",
          },
          {
            id: "leadership",
            label: "\u9886\u5BFC\u529B",
            fullName: "\u521B\u59CB\u4EBA\u5C55\u73B0\u51FA\u5F3A\u5927\u7684\u56E2\u961F\u51DD\u805A\u529B\u548C\u6218\u7565\u89C4\u5212\u80FD\u529B",
            status: "pending",
          },
        ],
      },
      {
        id: "core-team",
        label: "\u6838\u5FC3\u56E2\u961F",
        status: "pending",
        children: [
          {
            id: "tech-team",
            label: "\u6280\u672F\u56E2\u961F",
            fullName: "\u6280\u672F\u56E2\u961F\u5728\u5927\u6A21\u578B\u8BAD\u7EC3\u548C\u63A8\u7406\u4F18\u5316\u65B9\u9762\u5177\u5907\u4E1A\u754C\u9886\u5148\u6C34\u5E73",
            status: "pending",
          },
          {
            id: "market-team",
            label: "\u5E02\u573A\u56E2\u961F",
            fullName: "\u5E02\u573A\u56E2\u961F\u62E5\u6709\u6DF1\u539A\u7684\u4F01\u4E1A\u5BA2\u6237\u8D44\u6E90\u548C\u6E20\u9053\u7F51\u7EDC",
            status: "pending",
          },
        ],
      },
    ],
  },
  {
    category: "\u5E02\u573A\u673A\u4F1A",
    id: "market",
    items: [
      {
        id: "market-size",
        label: "\u5E02\u573A\u89C4\u6A21",
        status: "pending",
        children: [
          {
            id: "tam",
            label: "TAM",
            fullName: "\u5168\u7403\u5927\u6A21\u578B\u5E02\u573A\u89C4\u6A21\u5C06\u57282027\u5E74\u8FBE\u52301500\u4EBF\u7F8E\u5143",
            status: "pending",
          },
          {
            id: "sam",
            label: "SAM",
            fullName: "\u4E2D\u56FD\u5E02\u573A\u5360\u5168\u7403\u5927\u6A21\u578B\u5E02\u573A\u4EFD\u989D\u768425%\u4EE5\u4E0A",
            status: "pending",
          },
        ],
      },
    ],
  },
  {
    category: "\u5546\u4E1A\u6A21\u5F0F",
    id: "business",
    items: [
      {
        id: "revenue",
        label: "\u6536\u5165\u6765\u6E90",
        status: "pending",
        children: [
          {
            id: "api-monetize",
            label: "API\u5546\u4E1A\u5316",
            fullName: "\u516C\u53F8API\u8C03\u7528\u4ED8\u8D39\u6A21\u5F0F\u5C06\u6210\u4E3A\u4E3B\u8981\u6536\u5165\u6765\u6E90\u4E14\u5177\u5907\u8BA2\u9605\u5236\u589E\u957F\u6F5C\u529B",
            status: "pending",
          },
          {
            id: "b2b-saas",
            label: "B2B SaaS",
            fullName: "\u9762\u5411\u5927\u578B\u4F01\u4E1A\u7684\u5B9A\u5236\u5316\u5927\u6A21\u578B\u89E3\u51B3\u65B9\u6848\u5C06\u5F62\u6210\u9AD8\u5BA2\u5355\u4EF7\u5747\u5747\u6536\u5165",
            status: "pending",
          },
        ],
      },
      {
        id: "moat",
        label: "\u7ADE\u4E89\u58C1\u5792",
        status: "risky",
        children: [
          {
            id: "data-moat",
            label: "\u6570\u636E\u58C1\u5792",
            fullName: "\u516C\u53F8\u901A\u8FC7\u5927\u89C4\u6A21\u7528\u6237\u4EA4\u4E92\u6570\u636E\u6784\u5EFA\u8BAE\u5176\u4ED6\u5BF9\u624B\u96BE\u4EE5\u590D\u5236\u7684\u6570\u636E\u98DE\u8F6E\u4F18\u52BF",
            status: "risky",
          },
          {
            id: "brand-moat",
            label: "\u54C1\u724C\u58C1\u5792",
            fullName: "MiniMax\u5728\u5F00\u53D1\u8005\u793E\u533A\u7684\u54C1\u724C\u8BA4\u77E5\u5EA6\u5C06\u5F62\u6210\u6301\u7EED\u7684\u83B7\u5BA2\u4F18\u52BF",
            status: "pending",
          },
        ],
      },
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Detail map                                                         */
/* ------------------------------------------------------------------ */
const detailsMap: Record<string, HypothesisDetail> = {
  "tech-bg": {
    id: "tech-bg",
    title: "\u521B\u59CB\u4EBA\u95EB\u4FCA\u6770\u5177\u6709\u624E\u5B9E\u7684\u4EBA\u5DE5\u667A\u80FD\u5B66\u672F\u80CC\u666F",
    qaId: "QA-2024-001",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    status: "verified",
    valuePoints: [
      {
        id: "vp1",
        title: "\u4EF7\u503C\u70B91",
        evidence: {
          description: "\u521B\u59CB\u4EBA\u62E5\u6709\u535A\u58EB\u5B66\u4F4D\uFF0C\u5728AI\u9886\u57DF\u53D1\u8868\u8FC715\u7BC7\u9AD8\u8D28\u91CF\u5B66\u672F\u8BBA\u6587",
          files: [
            { name: "\u95EB\u4FCA\u6770_CV.pdf", size: "2.4 MB", date: "2024-01-18" },
            { name: "Google Scholar \u5F15\u7528\u6570\u636E.xlsx", size: "1.8 MB", date: "2024-01-19" },
          ],
        },
        analysis: {
          content: "\u521B\u59CB\u4EBA\u62E5\u6709\u535A\u58EB\u5B66\u4F4D\uFF0C\u4E3A\u8BE5\u9886\u57DF\u9AD8\u5B66\u5386\u4EBA\u624D\u3002\u5728\u4EBA\u5DE5\u667A\u80FD\u9886\u57DF\u53D1\u8868\u8FC715\u7BC7\u9AD8\u8D28\u91CF\u5B66\u672F\u8BBA\u6587\uFF0C\u5176\u4E2D5\u7BC7\u53D1\u8868\u5728\u9876\u7EA7\u671F\u520A\u4E0A\u3002\u66FE\u83B7\u5F97\u56FD\u5BB6\u81EA\u7136\u79D1\u5B66\u57FA\u91D1\u9752\u5E74\u9879\u76EE\u8D44\u52A9\u3002",
          creator: PEOPLE.zhangwei,
          reviewers: [PEOPLE.lisi, PEOPLE.wangwu, PEOPLE.zhaoliu],
          createdAt: "2024-01-18",
        },
        comments: [
          { author: "\u738B\u4E94", content: "\u5EFA\u8BAE\u8865\u5145\u521B\u59CB\u4EBA\u5728\u5DE5\u4E1A\u754C\u7684\u5B9E\u9645\u9879\u76EE\u7ECF\u9A8C\u8D44\u6599", time: "2024-01-19 14:30" },
        ],
      },
      {
        id: "vp2",
        title: "\u4EF7\u503C\u70B92",
        evidence: {
          description: "\u5728Google Scholar\u4E0A\u7684H\u6307\u6570\u4E3A8\uFF0C\u603B\u5F15\u7528\u6B21\u6570\u8D85\u8FC7500\u6B21",
          files: [{ name: "\u5B66\u672F\u5F71\u54CD\u529B\u62A5\u544A.pdf", size: "3.1 MB", date: "2024-01-19" }],
        },
        analysis: {
          content: "H\u6307\u6570\u8FBE\u52308\uFF0C\u5728\u540C\u9F84\u5B66\u8005\u4E2D\u5904\u4E8E\u8F83\u9AD8\u6C34\u5E73\u3002\u5176\u7814\u7A76\u6210\u679C\u88AB\u591A\u5BB6\u77E5\u540D\u4F01\u4E1A\u5F15\u7528\u5E76\u5E94\u7528\u4E8E\u5B9E\u9645\u4EA7\u54C1\u4E2D\u3002",
          creator: PEOPLE.zhangwei,
          reviewers: [PEOPLE.lisi, PEOPLE.chentotal],
          createdAt: "2024-01-19",
        },
        comments: [],
      },
    ],
    riskPoints: [
      {
        id: "rp1",
        title: "\u98CE\u9669\u70B91",
        evidence: {
          description: "\u5B66\u672F\u80CC\u666F\u8F83\u5F3A\u4F46\u5546\u4E1A\u8F6C\u5316\u7ECF\u9A8C\u76F8\u5BF9\u6709\u9650",
          files: [{ name: "\u884C\u4E1A\u5BF9\u6807\u5206\u6790.pdf", size: "1.5 MB", date: "2024-01-20" }],
        },
        analysis: {
          content: "\u521B\u59CB\u4EBA\u5728\u5546\u4E1A\u5316\u65B9\u9762\u7684\u7ECF\u9A8C\u4E3B\u8981\u96C6\u4E2D\u5728\u6280\u672F\u8F6C\u8BA9\u548C\u4E13\u5229\u6388\u6743\u9886\u57DF\uFF0C\u5C1A\u672A\u6709\u8FC7\u5B8C\u6574\u7684\u4EA7\u54C1\u5546\u4E1A\u5316\u7ECF\u5386\u3002",
          creator: PEOPLE.lisi,
          reviewers: [PEOPLE.zhangwei, PEOPLE.wangtotal, PEOPLE.liuqi],
          createdAt: "2024-01-20",
        },
        comments: [
          { author: "\u5F20\u4F1F", content: "\u540C\u610FCOO\u5F20\u9E23\u7684\u52A0\u5165\u5728\u4E00\u5B9A\u7A0B\u5EA6\u4E0A\u5F25\u8865\u4E86\u8FD9\u4E00\u7F3A\u9677", time: "2024-01-20 16:00" },
        ],
      },
    ],
    committeeDecision: {
      conclusion: "\u5047\u8BBE\u6210\u7ACB",
      status: "approved",
      content: "\u7ECF\u6295\u59D4\u4F1A\u5BA1\u8BAE\uFF0C\u521B\u59CB\u4EBA\u7684\u5B66\u672F\u80CC\u666F\u5F97\u5230\u5145\u5206\u9A8C\u8BC1\u3002\u867D\u7136\u5546\u4E1A\u5316\u7ECF\u9A8C\u5B58\u5728\u4E00\u5B9A\u98CE\u9669\uFF0C\u4F46\u56E2\u961F\u6574\u4F53\u914D\u7F6E\u53EF\u4EE5\u5F25\u8865\u3002",
      creator: PEOPLE.wangtotal,
      reviewers: [PEOPLE.chentotal, PEOPLE.zhaoliu, PEOPLE.liuqi],
      createdAt: "2024-01-22",
      comments: [
        { author: "\u5F20\u4F1F", content: "\u540C\u610F\u6295\u59D4\u7ED3\u8BBA\uFF0C\u5EFA\u8BAE\u5728\u6761\u6B3E\u4E2D\u52A0\u5165\u7ADE\u4E1A\u7981\u6B62\u6761\u6B3E", time: "2024-01-22 15:00" },
      ],
    },
    verification: {
      conclusion: "\u5047\u8BBE\u5DF2\u9A8C\u8BC1",
      status: "confirmed",
      content: "\u6295\u8D44\u540E6\u4E2A\u6708\u8DDF\u8E2A\u663E\u793A\uFF0C\u521B\u59CB\u4EBA\u7684\u5B66\u672F\u80CC\u666F\u4E3A\u516C\u53F8\u62DB\u52DF\u9876\u7EA7\u4EBA\u624D\u63D0\u4F9B\u4E86\u91CD\u8981\u80CC\u4E66\u3002\u6280\u672F\u56E2\u961F\u5728\u5927\u6A21\u578B\u8BAD\u7EC3\u4F18\u5316\u65B9\u9762\u53D6\u5F97\u7A81\u7834\u6027\u8FDB\u5C55\u3002",
      creator: PEOPLE.zhangwei,
      reviewers: [PEOPLE.lisi, PEOPLE.wangwu],
      createdAt: "2024-07-15",
      comments: [],
    },
  },
  "api-monetize": {
    id: "api-monetize",
    title: "\u516C\u53F8API\u8C03\u7528\u4ED8\u8D39\u6A21\u5F0F\u5C06\u6210\u4E3A\u4E3B\u8981\u6536\u5165\u6765\u6E90\u4E14\u5177\u5907\u8BA2\u9605\u5236\u589E\u957F\u6F5C\u529B",
    qaId: "QA-2024-010",
    createdAt: "2024-02-01",
    updatedAt: "2024-02-10",
    status: "pending",
    valuePoints: [
      {
        id: "vp1",
        title: "\u4EF7\u503C\u70B91",
        evidence: {
          description: "\u73B0\u6709API\u5BA2\u6237\u6570\u91CF\u5DF2\u8D85\u8FC71000\u5BB6\uFF0C\u6708\u5747\u6D3B\u8DC3\u7528\u6237\u5360\u6BD465%",
          files: [{ name: "API\u8FD0\u8425\u6570\u636E_Q1.xlsx", size: "1.2 MB", date: "2024-02-08" }],
        },
        analysis: {
          content: "API\u5546\u4E1A\u5316\u6A21\u5F0F\u5177\u6709\u9AD8\u53EF\u6269\u5C55\u6027\uFF0C\u8FB9\u9645\u6210\u672C\u4F4E\uFF0C\u968F\u5BA2\u6237\u89C4\u6A21\u589E\u957F\u5145\u5206\u4F53\u73B0\u89C4\u6A21\u6548\u5E94\u3002",
          creator: PEOPLE.lisi,
          reviewers: [PEOPLE.zhangwei, PEOPLE.wangtotal],
          createdAt: "2024-02-05",
        },
        comments: [],
      },
    ],
    riskPoints: [
      {
        id: "rp1",
        title: "\u98CE\u9669\u70B91",
        evidence: {
          description: "\u5927\u6A21\u578B\u5382\u5546\u5747\u6709API\u8C03\u7528\u4ED8\u8D39\u6A21\u5F0F\uFF0C\u4EF7\u683C\u7ADE\u4E89\u6FC0\u70C8",
          files: [],
        },
        analysis: {
          content: "\u9700\u5173\u6CE8\u5BF9\u6807\u5382\u5546OpenAI\u3001Anthropic\u7684\u4EF7\u683C\u7B56\u7565\uFF0C\u8BC4\u4F30\u5F71\u54CD\u3002",
          creator: PEOPLE.wangwu,
          reviewers: [PEOPLE.lisi, PEOPLE.zhaoliu, PEOPLE.chentotal],
          createdAt: "2024-02-06",
        },
        comments: [],
      },
    ],
    committeeDecision: {
      conclusion: "\u5F85\u5BA1\u8BAE",
      status: "pending",
      content: "\u5C1A\u672A\u5F00\u59CB\u6295\u59D4\u5BA1\u8BAE",
      creator: PEOPLE.wangtotal,
      reviewers: [],
      createdAt: "",
      comments: [],
    },
    verification: {
      conclusion: "\u5F85\u9A8C\u8BC1",
      status: "pending",
      content: "\u5C1A\u672A\u8FDB\u5165\u9A8C\u8BC1\u9636\u6BB5",
      creator: PEOPLE.zhangwei,
      reviewers: [],
      createdAt: "",
      comments: [],
    },
  },
}

/* ------------------------------------------------------------------ */
/*  Status helpers                                                     */
/* ------------------------------------------------------------------ */
function StatusDot({ status }: { status: "verified" | "pending" | "risky" }) {
  const colors = {
    verified: "bg-emerald-500",
    pending: "bg-gray-300",
    risky: "bg-amber-500",
  }
  return (
    <span className={cn("inline-block h-2 w-2 rounded-full shrink-0", colors[status])} />
  )
}

/* ------------------------------------------------------------------ */
/*  Avatar component                                                   */
/* ------------------------------------------------------------------ */
function Avatar({ person, size = "sm" }: { person: Person; size?: "sm" | "md" }) {
  const sizeClass = size === "sm" ? "h-6 w-6 text-xs" : "h-8 w-8 text-sm"
  return (
    <button
      title={person.name}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold text-white shrink-0 ring-2 ring-white transition-transform hover:scale-110 hover:z-10",
        sizeClass,
        person.color
      )}
    >
      {person.initials}
    </button>
  )
}

/* ------------------------------------------------------------------ */
/*  Author Row (avatars)                                               */
/* ------------------------------------------------------------------ */
function AuthorRow({
  creator,
  reviewers,
  createdAt,
}: {
  creator: Person
  reviewers: Person[]
  createdAt: string
}) {
  if (!creator.name && reviewers.length === 0) return null
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
      {creator.name && (
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-[#9CA3AF]">\u521B\u5EFA\u4EBA</span>
          <Avatar person={creator} />
          <span className="text-xs font-medium text-[#374151]">{creator.name}</span>
        </div>
      )}
      {reviewers.length > 0 && (
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-[#9CA3AF]">\u5BA1\u9605\u4EBA</span>
          <div className="flex -space-x-1">
            {reviewers.map((r) => (
              <Avatar key={r.name} person={r} />
            ))}
          </div>
        </div>
      )}
      {createdAt && (
        <span className="text-xs text-[#9CA3AF]">{createdAt}</span>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Comment Section                                                    */
/* ------------------------------------------------------------------ */
function CommentSection({
  comments,
}: {
  comments: { author: string; content: string; time: string }[]
}) {
  const [newComment, setNewComment] = useState("")
  return (
    <div className="mt-4 border-t border-[#E5E7EB] pt-4">
      <h5 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
        \u8BC4\u8BBA
      </h5>
      {comments.length > 0 && (
        <div className="mb-3 space-y-3">
          {comments.map((c, i) => (
            <div key={i} className="flex gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-xs font-medium text-[#2563EB]">
                {c.author[0]}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[#374151]">{c.author}</span>
                  <span className="text-xs text-[#9CA3AF]">{c.time}</span>
                </div>
                <p className="mt-0.5 text-sm leading-relaxed text-[#4B5563]">{c.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <Input
          placeholder="\u6DFB\u52A0\u8BC4\u8BBA..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="h-8 border-[#E5E7EB] text-sm"
        />
        <Button size="sm" variant="outline" className="h-8 shrink-0 px-2.5">
          <Send className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Value / Risk Point Card                                            */
/* ------------------------------------------------------------------ */
function PointCard({
  title,
  type,
  evidence,
  analysis,
  comments,
}: {
  title: string
  type: "value" | "risk"
  evidence: ValuePoint["evidence"]
  analysis: PointAnalysis
  comments: { author: string; content: string; time: string }[]
}) {
  const borderColor = type === "value" ? "border-l-emerald-500" : "border-l-amber-500"
  const headerColor = type === "value" ? "text-emerald-700" : "text-amber-700"

  return (
    <div className={cn("rounded-lg border border-[#E5E7EB] bg-white border-l-4", borderColor)}>
      <div className="p-5">
        <h4 className={cn("mb-3 text-sm font-semibold", headerColor)}>{title}</h4>

        {/* Evidence */}
        <div className="mb-4">
          <h5 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
            \u8BBA\u636E\u652F\u6301
          </h5>
          <p className="mb-2 text-sm leading-relaxed text-[#374151]">{evidence.description}</p>
          {evidence.files.length > 0 && (
            <div className="space-y-2">
              {evidence.files.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2"
                >
                  <FileText className="h-4 w-4 shrink-0 text-[#6B7280]" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-[#374151]">{file.name}</p>
                    <p className="text-xs text-[#9CA3AF]">{file.size}{" \u00b7 "}{file.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Upload zone */}
          <div className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-[#D1D5DB] bg-[#F9FAFB] py-4 hover:bg-[#F3F4F6] transition-colors">
            <Upload className="mb-1.5 h-5 w-5 text-[#9CA3AF]" />
            <p className="text-xs text-[#9CA3AF]">\u62D6\u62FD\u6587\u4EF6\u5230\u6B64\u5904\u6216\u70B9\u51FB\u4E0A\u4F20</p>
            <p className="text-xs text-[#D1D5DB]">\u652F\u6301 PDF, Excel, Word \u7B49\u683C\u5F0F</p>
          </div>
        </div>

        {/* Analysis */}
        <div>
          <h5 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
            \u8BBA\u8BC1\u5206\u6790
          </h5>
          <div className="rounded-md border border-[#E5E7EB] bg-[#F9FAFB] p-3">
            <p className="text-sm leading-relaxed text-[#374151]">{analysis.content}</p>
          </div>
          <AuthorRow creator={analysis.creator} reviewers={analysis.reviewers} createdAt={analysis.createdAt} />
        </div>

        <CommentSection comments={comments} />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Decision / Verification Card                                       */
/* ------------------------------------------------------------------ */
function DecisionCard({
  title,
  conclusion,
  status,
  content,
  creator,
  reviewers,
  createdAt,
  comments,
}: {
  title: string
  conclusion: string
  status: string
  content: string
  creator: Person
  reviewers: Person[]
  createdAt: string
  comments: { author: string; content: string; time: string }[]
}) {
  const statusColors: Record<string, string> = {
    approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
    pending: "bg-gray-50 text-gray-600 border-gray-200",
    confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    invalidated: "bg-red-50 text-red-700 border-red-200",
  }

  return (
    <div className="rounded-lg border border-[#E5E7EB] bg-white border-l-4 border-l-[#2563EB]">
      <div className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-[#111827]">{title}</h4>
          <Badge className={cn("text-xs", statusColors[status] || statusColors.pending)}>
            {conclusion}
          </Badge>
        </div>
        {content && (
          <div className="mb-2 rounded-md border border-[#E5E7EB] bg-[#F9FAFB] p-3">
            <p className="text-sm leading-relaxed text-[#374151]">{content}</p>
          </div>
        )}
        <AuthorRow creator={creator} reviewers={reviewers} createdAt={createdAt} />
        <CommentSection comments={comments} />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Tree Node — all levels collapsible                                 */
/* ------------------------------------------------------------------ */
function TreeNode({
  node,
  depth,
  selectedId,
  onSelect,
}: {
  node: HypothesisNode
  depth: number
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(depth === 0)
  const hasChildren = !!node.children?.length
  const isLeaf = !hasChildren
  const isSelected = selectedId === node.id
  const displayLabel = isLeaf && node.fullName ? node.fullName : node.label

  return (
    <div>
      <button
        onClick={() => {
          if (hasChildren) setExpanded(!expanded)
          if (isLeaf) onSelect(node.id)
        }}
        className={cn(
          "flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-sm transition-colors text-left",
          isSelected
            ? "bg-[#EFF6FF] text-[#2563EB] font-medium"
            : "text-[#374151] hover:bg-[#F3F4F6]"
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        <span className="mt-0.5 shrink-0">
          {hasChildren ? (
            expanded ? (
              <ChevronDown className="h-3.5 w-3.5 text-[#9CA3AF]" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-[#9CA3AF]" />
            )
          ) : (
            <span className="inline-block w-3.5" />
          )}
        </span>
        <StatusDot status={node.status} />
        <span className={cn("min-w-0", isLeaf ? "line-clamp-2 leading-snug" : "truncate leading-snug")}>
          {displayLabel}
        </span>
      </button>
      {hasChildren && expanded && (
        <div>
          {node.children!.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Category Row — collapsible                                         */
/* ------------------------------------------------------------------ */
function CategoryRow({
  index,
  category,
  id,
  items,
  selectedId,
  onSelect,
}: {
  index: number
  category: string
  id: string
  items: HypothesisNode[]
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-[#F3F4F6]"
      >
        {expanded ? (
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[#9CA3AF]" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#9CA3AF]" />
        )}
        <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
          {index}. {category}
        </span>
      </button>
      {expanded && (
        <div className="mt-0.5">
          {items.length > 0 ? (
            <div className="space-y-0.5">
              {items.map((node) => (
                <TreeNode
                  key={node.id}
                  node={node}
                  depth={1}
                  selectedId={selectedId}
                  onSelect={onSelect}
                />
              ))}
            </div>
          ) : (
            <p className="px-2 py-1 text-xs italic text-[#9CA3AF]">\u6682\u65E0\u5047\u8BBE</p>
          )}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Detail Panel (right)                                               */
/* ------------------------------------------------------------------ */
function DetailPanel({ detail }: { detail: HypothesisDetail }) {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 px-8 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-sm text-[#6B7280]">
          <span className="cursor-pointer hover:text-[#374151]">\u9879\u76EE\u5E93</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="cursor-pointer hover:text-[#374151]">MiniMax</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-[#374151]">\u5047\u8BBE\u6E05\u5355</span>
        </div>

        {/* Header Card */}
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">
          <div className="flex items-start justify-between">
            <div className="mr-4 min-w-0 flex-1">
              <h2 className="text-lg font-semibold text-[#111827]">{detail.title}</h2>
              <p className="mt-1.5 text-sm text-[#6B7280]">
                {"ID: "}{detail.qaId}{" | "}
                {"\u521B\u5EFA\u65F6\u95F4: "}{detail.createdAt}{" | "}
                {"\u66F4\u65B0\u65F6\u95F4: "}{detail.updatedAt}
              </p>
            </div>
            <Badge
              className={cn(
                "shrink-0",
                detail.status === "verified"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                  : detail.status === "risky"
                    ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-50"
              )}
            >
              <span
                className={cn(
                  "mr-1 inline-block h-1.5 w-1.5 rounded-full",
                  detail.status === "verified" ? "bg-emerald-500" : detail.status === "risky" ? "bg-amber-500" : "bg-gray-400"
                )}
              />
              {detail.status === "verified" ? "\u5DF2\u9A8C\u8BC1" : detail.status === "risky" ? "\u5B58\u7591" : "\u5F85\u9A8C\u8BC1"}
            </Badge>
          </div>
        </div>

        {/* Value Points */}
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-[#111827]">
            <span className="inline-block h-5 w-1 rounded-full bg-emerald-500" />
            \u4EF7\u503C\u70B9
          </h3>
          <div className="space-y-4">
            {detail.valuePoints.map((vp) => (
              <PointCard key={vp.id} title={vp.title} type="value" evidence={vp.evidence} analysis={vp.analysis} comments={vp.comments} />
            ))}
          </div>
        </div>

        {/* Risk Points */}
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-[#111827]">
            <span className="inline-block h-5 w-1 rounded-full bg-amber-500" />
            \u98CE\u9669\u70B9
          </h3>
          <div className="space-y-4">
            {detail.riskPoints.length > 0 ? (
              detail.riskPoints.map((rp) => (
                <PointCard key={rp.id} title={rp.title} type="risk" evidence={rp.evidence} analysis={rp.analysis} comments={rp.comments} />
              ))
            ) : (
              <p className="text-sm italic text-[#9CA3AF]">\u6682\u65E0\u98CE\u9669\u70B9</p>
            )}
          </div>
        </div>

        {/* Committee Decision */}
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-[#111827]">
            <span className="inline-block h-5 w-1 rounded-full bg-[#2563EB]" />
            \u6295\u59D4\u51B3\u8BAE
          </h3>
          <DecisionCard
            title="\u6295\u59D4\u4F1A\u5BA1\u8BAE\u7ED3\u679C"
            conclusion={detail.committeeDecision.conclusion}
            status={detail.committeeDecision.status}
            content={detail.committeeDecision.content}
            creator={detail.committeeDecision.creator}
            reviewers={detail.committeeDecision.reviewers}
            createdAt={detail.committeeDecision.createdAt}
            comments={detail.committeeDecision.comments}
          />
        </div>

        {/* Verification */}
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-[#111827]">
            <span className="inline-block h-5 w-1 rounded-full bg-violet-500" />
            \u9A8C\u8BC1\u60C5\u51B5
          </h3>
          <DecisionCard
            title="\u6295\u540E\u9A8C\u8BC1\u8BC4\u4F30"
            conclusion={detail.verification.conclusion}
            status={detail.verification.status}
            content={detail.verification.content}
            creator={detail.verification.creator}
            reviewers={detail.verification.reviewers}
            createdAt={detail.verification.createdAt}
            comments={detail.verification.comments}
          />
        </div>
      </div>
    </ScrollArea>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */
export function HypothesisChecklist() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [middleCollapsed, setMiddleCollapsed] = useState(false)

  const detail = selectedId ? (detailsMap[selectedId] ?? null) : null
  const hasSelection = selectedId !== null

  return (
    <div className="flex h-full">
      {/* Middle Panel: Hypothesis Tree */}
      <div
        className={cn(
          "shrink-0 border-r border-[#E5E7EB] bg-white transition-all duration-200 flex flex-col",
          hasSelection ? (middleCollapsed ? "w-12" : "w-[300px]") : "flex-1"
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-[#E5E7EB] p-4">
          {(!hasSelection || !middleCollapsed) && (
            <div className="min-w-0 flex-1">
              <h2 className="mb-3 text-base font-semibold text-[#111827]">\u5047\u8BBE\u6E05\u5355</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                <Input
                  placeholder="\u641C\u7D22\u5047\u8BBE..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 border-[#E5E7EB] pl-9 text-sm"
                />
              </div>
            </div>
          )}
          {hasSelection && (
            <button
              onClick={() => setMiddleCollapsed(!middleCollapsed)}
              className="flex shrink-0 items-center justify-center rounded-lg p-1.5 text-[#9CA3AF] transition-colors hover:bg-[#F3F4F6] hover:text-[#374151]"
              title={middleCollapsed ? "\u5C55\u5F00\u5047\u8BBE\u5217\u8868" : "\u6536\u8D77\u5047\u8BBE\u5217\u8868"}
            >
              {middleCollapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </button>
          )}
        </div>

        {/* Tree content */}
        {(!hasSelection || !middleCollapsed) && (
          <ScrollArea className="flex-1">
            <div className="space-y-1 p-3">
              {hypothesisTree.map((group, gIdx) => (
                <CategoryRow
                  key={group.id}
                  index={gIdx + 1}
                  category={group.category}
                  id={group.id}
                  items={group.items}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Right Panel: Detail */}
      {hasSelection && (
        <div className="flex-1 overflow-hidden bg-[#F3F4F6]">
          {detail ? (
            <DetailPanel detail={detail} />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center text-[#9CA3AF]">
                <ListChecks className="mx-auto mb-3 h-12 w-12 text-[#D1D5DB]" />
                <p className="text-sm">\u6682\u65E0\u8BE5\u5047\u8BBE\u7684\u8BE6\u7EC6\u4FE1\u606F</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
