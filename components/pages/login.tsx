"use client"

import { useState, useEffect } from "react"
import { Eye, EyeOff, RefreshCw, Lock, User, ShieldCheck } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface LoginProps {
  onLogin: () => void
}

function generateCaptcha(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let result = ""
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [captchaInput, setCaptchaInput] = useState("")
  const [captchaCode, setCaptchaCode] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setCaptchaCode(generateCaptcha())
  }, [])

  function refreshCaptcha() {
    setCaptchaCode(generateCaptcha())
    setCaptchaInput("")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!username.trim()) {
      setError("\u8BF7\u8F93\u5165\u7528\u6237\u540D")
      return
    }
    if (!password.trim()) {
      setError("\u8BF7\u8F93\u5165\u5BC6\u7801")
      return
    }
    if (!captchaInput.trim()) {
      setError("\u8BF7\u8F93\u5165\u9A8C\u8BC1\u7801")
      return
    }
    if (captchaInput.toUpperCase() !== captchaCode) {
      setError("\u9A8C\u8BC1\u7801\u9519\u8BEF")
      refreshCaptcha()
      return
    }

    setIsLoading(true)
    // Simulate login delay
    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsLoading(false)
    onLogin()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-[#2563EB]/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-[#2563EB]/10 blur-3xl" />
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] shadow-lg shadow-[#2563EB]/25 mb-4">
            <span className="text-2xl font-bold text-white italic">A</span>
          </div>
          <h1 className="text-2xl font-bold text-white">AtomCAP</h1>
          <p className="text-sm text-[#94A3B8] mt-1">PE/VC{"\u6295\u8D44\u51B3\u7B56\u7BA1\u7406\u7CFB\u7EDF"}</p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-[#334155] bg-[#1E293B]/80 backdrop-blur-xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#E2E8F0]">{"\u7528\u6237\u540D"}</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={"\u8BF7\u8F93\u5165\u7528\u6237\u540D"}
                  className="pl-10 h-11 bg-[#0F172A] border-[#334155] text-white placeholder:text-[#64748B] focus:border-[#2563EB] focus:ring-[#2563EB]/20"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#E2E8F0]">{"\u5BC6\u7801"}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={"\u8BF7\u8F93\u5165\u5BC6\u7801"}
                  className="pl-10 pr-10 h-11 bg-[#0F172A] border-[#334155] text-white placeholder:text-[#64748B] focus:border-[#2563EB] focus:ring-[#2563EB]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#94A3B8] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Captcha */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#E2E8F0]">{"\u9A8C\u8BC1\u7801"}</label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <ShieldCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
                  <Input
                    type="text"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    placeholder={"\u8BF7\u8F93\u5165\u9A8C\u8BC1\u7801"}
                    maxLength={4}
                    className="pl-10 h-11 bg-[#0F172A] border-[#334155] text-white placeholder:text-[#64748B] focus:border-[#2563EB] focus:ring-[#2563EB]/20 uppercase"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-11 w-24 items-center justify-center rounded-lg bg-gradient-to-r from-[#334155] to-[#475569] select-none">
                    <span className="text-lg font-bold tracking-widest text-white" style={{ fontFamily: "monospace", letterSpacing: "0.2em" }}>
                      {captchaCode}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#334155] bg-[#0F172A] text-[#64748B] hover:text-[#94A3B8] hover:border-[#475569] transition-colors"
                    title={"\u5237\u65B0\u9A8C\u8BC1\u7801"}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full h-11 rounded-lg bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-sm font-semibold text-white shadow-lg shadow-[#2563EB]/25 transition-all",
                "hover:from-[#1D4ED8] hover:to-[#1E40AF] hover:shadow-[#2563EB]/30",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  {"\u767B\u5F55\u4E2D..."}
                </span>
              ) : (
                "\u767B\u5F55"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-[#334155]">
            <p className="text-center text-xs text-[#64748B]">
              {"\u9996\u6B21\u4F7F\u7528\uFF1F"}{" "}
              <button type="button" className="text-[#2563EB] hover:text-[#60A5FA] transition-colors">
                {"\u8054\u7CFB\u7BA1\u7406\u5458\u83B7\u53D6\u8D26\u53F7"}
              </button>
            </p>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-center text-xs text-[#64748B] mt-6">
          {"\u00A9 2024 AtomCAP. All rights reserved."}
        </p>
      </div>
    </div>
  )
}
