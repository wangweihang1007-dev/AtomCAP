import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const projectRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        search: z.string().optional(),
        status: z.string().optional(),
        round: z.string().optional(),
        manager: z.string().optional(),
        tag: z.string().optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const { search, status, round, manager, tag } = input ?? {};

      return ctx.db.investmentProject.findMany({
        where: {
          AND: [
            // Text search over name and description
            search
              ? {
                  OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { description: { contains: search, mode: "insensitive" } },
                  ],
                }
              : {},
            // Exact match filters
            status ? { status } : {},
            round ? { round } : {},
            manager ? { manager } : {},
            // Array contains match for tag
            tag ? { tags: { has: tag } } : {},
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  seed: publicProcedure.mutation(async ({ ctx }) => {
    // Prevent double seeding if any records exist
    const count = await ctx.db.investmentProject.count();
    if (count > 0) {
      return { message: "Database already seeded." };
    }

    const projects = [
      {
        name: "月之暗面",
        description: "新一代AI搜索与对话平台",
        manager: "李四",
        tags: ["AI"],
        round: "A轮",
        status: "投中期",
      },
      {
        name: "智谱AI",
        description: "认知大模型技术与应用开发",
        manager: "王芳",
        tags: ["AI"],
        round: "C轮",
        status: "投后期",
      },
      {
        name: "百川智能",
        description: "大语言模型研发与应用",
        manager: "张伟",
        tags: ["AI"],
        round: "B轮",
        status: "投中期",
      },
      {
        name: "零一万物",
        description: "通用AI助理与多模态模型",
        manager: "李四",
        tags: ["AI"],
        round: "A轮",
        status: "投前期",
      },
      {
        name: "阶跃星辰",
        description: "多模态大模型与智能体平台",
        manager: "赵强",
        tags: ["AI"],
        round: "Pre-A",
        status: "投前期",
      },
      {
        name: "深势科技",
        description: "AI for Science，分子模拟与药物设计",
        manager: "陈总",
        tags: ["AI+科学"],
        round: "B轮",
        status: "投后期",
      },
      {
        name: "衬远科技",
        description: "AI驱动的电商与消费品创新",
        manager: "王芳",
        tags: [],
        round: null,
        status: "投前期",
      },
    ];

    await ctx.db.investmentProject.createMany({
      data: projects,
    });

    return { message: "Successfully seeded 7 benchmark projects." };
  }),

  // Helpers for filters
  getMetadata: publicProcedure.query(async ({ ctx }) => {
    const managers = await ctx.db.investmentProject.findMany({
      select: { manager: true },
      distinct: ["manager"],
    });

    const allProjects = await ctx.db.investmentProject.findMany({
      select: { tags: true },
    });

    const tags = Array.from(new Set(allProjects.flatMap((p) => p.tags)));

    return {
      managers: managers.map((m) => m.manager).filter(Boolean) as string[],
      tags: tags.sort(),
    };
  }),
});
