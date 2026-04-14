"use client";

import { createTRPCReact } from "@trpc/react-query";
import { type AppRouter } from "@/server/api/root";

export const api = createTRPCReact<AppRouter>();

export function getUrl() {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
