import { PrismaClient } from '@prisma/client';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Using manual config to run from script
const connectionString = "postgresql://postgres:postgres@localhost:5432/Atom?schema=public";
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

const db = new PrismaClient({ adapter });

async function seed() {
  try {
    const count = await db.investmentProject.count();
    if (count > 0) {
      console.log("Database already has", count, "projects. Dropping and re-seeding...");
      await db.investmentProject.deleteMany({});
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

    const result = await db.investmentProject.createMany({
      data: projects,
    });
    console.log("Seeded", result.count, "projects successfully.");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding:", error);
    process.exit(1);
  }
}

seed();
