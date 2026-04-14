import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
dotenv.config();

const db = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

async function main() {
  console.log("正在检查数据库内容...");
  
  const count = await db.investmentProject.count();
  
  if (count === 0) {
    console.log("数据库为空，正在注入样例数据...");
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
        tags: ["电商"],
        round: "种子轮",
        status: "投前期",
      },
    ];

    await db.investmentProject.createMany({
      data: projects,
    });
    console.log("✅ 成功写入了 7 条样例数据！");
  } else {
    console.log(`✅ 数据库中已有 ${count} 条数据。`);
  }

  const allProjects = await db.investmentProject.findMany({
    select: {
      name: true,
      manager: true,
      status: true,
      round: true,
      tags: true
    }
  });

  console.log("\n--- 当前接口返回的数据内容预览 ---");
  console.table(allProjects);
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error("发生错误:", e);
    await db.$disconnect();
    process.exit(1);
  });
