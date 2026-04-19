/**
 * Prisma seed 脚本（T3 Stack 规范）
 *
 * 运行方式：
 *   - 开发环境手动：pnpm db:seed （或 npx prisma db seed）
 *   - 生产部署：build 脚本中已串入 `prisma db seed`，每次部署自动执行
 *
 * 幂等性：
 *   所有写入都使用「清空表 → 批量插入」，或使用 upsert，
 *   保证重复运行不会产生重复数据。
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedDashboardOverview() {
  // 数据看板顶部 4 个核心卡片只用最新一条，直接清空重写
  await prisma.dashboardOverview.deleteMany()
  await prisma.dashboardOverview.create({
    data: {
      totalProjectCount: 128,
      totalInvestment: 52.6, // 亿元
      fundCount: 8,
      newProjectCount: 24,
      irrMedian: 22.5,
      dpiDistribution: '12/20',
      avgReturnMultiple: 2.4,
      exitWinRate: 68,
      avgProjectDuration: 186, // 小时
      invalidEfficiency: 12.5,
      approvalPassRate: 78,
      highRiskProjectCount: 3,
      compliancePendingCount: 7,
      todayMeetingCount: 4,
    },
  })
}

async function seedDashboardCharts() {
  // 图表宽表：清空后批量插入
  await prisma.dashboardChart.deleteMany()

  // 1) 赛道投资分布（饼图）
  const trackRows = [
    { trackName: '硬科技', trackInvestAmount: 18.2, trackRatio: 34.6 },
    { trackName: '新能源', trackInvestAmount: 12.5, trackRatio: 23.8 },
    { trackName: '医疗健康', trackInvestAmount: 9.8, trackRatio: 18.6 },
    { trackName: '企业服务', trackInvestAmount: 6.4, trackRatio: 12.2 },
    { trackName: '消费', trackInvestAmount: 3.5, trackRatio: 6.7 },
    { trackName: '其他', trackInvestAmount: 2.2, trackRatio: 4.1 },
  ]

  // 2) 本年度立项/投决/退出趋势（柱状图）
  const stageMonths = ['1月', '2月', '3月', '4月', '5月', '6月']
  const stageData = [
    { 立项: 6, 投决: 3, 退出: 1 },
    { 立项: 8, 投决: 4, 退出: 2 },
    { 立项: 5, 投决: 2, 退出: 1 },
    { 立项: 9, 投决: 5, 退出: 3 },
    { 立项: 7, 投决: 4, 退出: 2 },
    { 立项: 10, 投决: 6, 退出: 3 },
  ]
  const stageRows = stageMonths.flatMap((month, idx) => ([
    { statisticMonth: month, stageName: '立项', stageProjectCount: stageData[idx]!['立项'] },
    { statisticMonth: month, stageName: '投决', stageProjectCount: stageData[idx]!['投决'] },
    { statisticMonth: month, stageName: '退出', stageProjectCount: stageData[idx]!['退出'] },
  ]))

  // 3) IRR 行业对标（折线图）
  const benchmarkRows = [
    { quarter: '2024Q1', fundIrr: 18.5, industryAvgIrr: 15.2, industryTopIrr: 22.1 },
    { quarter: '2024Q2', fundIrr: 20.1, industryAvgIrr: 16.0, industryTopIrr: 23.5 },
    { quarter: '2024Q3', fundIrr: 21.8, industryAvgIrr: 16.8, industryTopIrr: 24.2 },
    { quarter: '2024Q4', fundIrr: 22.5, industryAvgIrr: 17.3, industryTopIrr: 25.0 },
    { quarter: '2025Q1', fundIrr: 23.2, industryAvgIrr: 17.6, industryTopIrr: 25.8 },
    { quarter: '2025Q2', fundIrr: 24.0, industryAvgIrr: 18.1, industryTopIrr: 26.4 },
  ]

  // 4) 团队效能 TOP5
  const managerRows = [
    { managerName: '张伟', managerProjectCount: 12, managerAvgCycle: 42, managerEfficiencyScore: 95 },
    { managerName: '李娜', managerProjectCount: 10, managerAvgCycle: 48, managerEfficiencyScore: 91 },
    { managerName: '王强', managerProjectCount: 9, managerAvgCycle: 52, managerEfficiencyScore: 88 },
    { managerName: '赵敏', managerProjectCount: 8, managerAvgCycle: 55, managerEfficiencyScore: 85 },
    { managerName: '陈曦', managerProjectCount: 7, managerAvgCycle: 60, managerEfficiencyScore: 82 },
  ]

  await prisma.dashboardChart.createMany({
    data: [
      ...trackRows,
      ...stageRows,
      ...benchmarkRows,
      ...managerRows,
    ],
  })
}

async function seedDashboardTodos() {
  await prisma.dashboardTodo.deleteMany()

  const now = Date.now()
  const hours = (h: number) => new Date(now + h * 60 * 60 * 1000)
  const hoursAgo = (h: number) => new Date(now - h * 60 * 60 * 1000)

  await prisma.dashboardTodo.createMany({
    data: [
      {
        type: '立项审批',
        title: '智芯半导体 A 轮立项审批',
        projectName: '智芯半导体',
        submitter: '张伟',
        submitTime: hoursAgo(5),
        deadline: hours(3),
        priority: 'urgent',
        operation: '处理',
      },
      {
        type: '投决材料预审',
        title: '绿能科技 Pre-A 投决材料预审',
        projectName: '绿能科技',
        submitter: '李娜',
        submitTime: hoursAgo(12),
        deadline: hours(18),
        priority: 'urgent',
        operation: '处理',
      },
      {
        type: '尽调报告审核',
        title: '康健生物尽调报告审核',
        projectName: '康健生物',
        submitter: '王强',
        submitTime: hoursAgo(26),
        deadline: hours(40),
        priority: 'normal',
        operation: '处理',
      },
      {
        type: '条款清单审批',
        title: '云途 SaaS 条款清单审批',
        projectName: '云途 SaaS',
        submitter: '赵敏',
        submitTime: hoursAgo(48),
        deadline: hours(72),
        priority: 'normal',
        operation: '处理',
      },
      {
        type: '合规风险处置',
        title: '星火智能合规风险处置',
        projectName: '星火智能',
        submitter: '陈曦',
        submitTime: hoursAgo(72),
        deadline: hours(120),
        priority: 'low',
        operation: '处理',
      },
    ],
  })
}

async function main() {
  console.log('🌱 Seeding database...')

  await seedDashboardOverview()
  console.log('  ✔ DashboardOverview')

  await seedDashboardCharts()
  console.log('  ✔ DashboardChart')

  await seedDashboardTodos()
  console.log('  ✔ DashboardTodo')

  console.log('✅ Seed complete')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
