const { PrismaClient } = require("@prisma/client");
try {
  const client = new PrismaClient();
  console.log("PrismaClient is a constructor");
} catch (e) {
  console.log("Error:", e.message);
}
