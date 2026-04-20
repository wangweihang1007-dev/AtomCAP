import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/src/server/api/trpc";

export const hypothesisRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const hypotheses = await ctx.db.hypothesis.findMany({
      orderBy: { createdAt: "desc" },
    });
    
    return hypotheses.map((h) => ({
      id: h.id,
      direction: h.direction || "",
      category: h.category || "",
      name: h.name,
      owner: h.owner || "未知",
      createdAt: h.createdAt.toISOString().split("T")[0],
      updatedAt: h.updatedAt.toISOString().split("T")[0],
      status: (h.status as "verified" | "pending" | "risky") || "pending",
    }));
  }),

  // Provide details to render hypothesis clicking properly without breaking mock UI
  getDetails: publicProcedure.query(async ({ ctx }) => {
    const hypotheses = await ctx.db.hypothesis.findMany();
    const mockPerson = { name: "未知角色", role: "员工" };
    const detailsMap: Record<string, any> = {};
    
    hypotheses.forEach((h) => {
      detailsMap[h.id] = {
        id: h.id,
        title: h.name,
        qaId: `QA-${h.id.slice(-6).toUpperCase()}`,
        createdAt: h.createdAt.toISOString().split("T")[0],
        updatedAt: h.updatedAt.toISOString().split("T")[0],
        status: (h.status as "verified" | "pending" | "risky") || "pending",
        creator: { name: h.owner || "未知", role: "投资经理" },
        valuePoints: [],
        riskPoints: [],
        committeeDecision: {
          conclusion: "",
          status: "pending",
          content: "",
          creator: mockPerson,
          reviewers: [],
          createdAt: "",
          comments: [],
        },
        verification: {
          conclusion: "",
          status: "pending",
          content: "",
          creator: mockPerson,
          reviewers: [],
          createdAt: "",
          comments: [],
        },
        linkedTerms: [],
      };
    });
    
    return detailsMap;
  }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.hypothesis.delete({
        where: { id: input.id },
      });
      return { success: true };
    }),
});
