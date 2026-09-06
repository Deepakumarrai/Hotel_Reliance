import { PrismaClient } from "@prisma/client";

// Global PrismaClient singleton for Express
declare global {
  var prisma: any | undefined;
}

const basePrisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

export const prisma: PrismaClient = basePrisma.$extends({
  query: {
    async $allOperations({ operation, model, args, query }: any) {
      const maxRetries = 3;
      let lastError: any;
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          return await query(args);
        } catch (error: any) {
          lastError = error;
          const isConnectionError =
            error?.code === "P1001" ||
            error?.code === "P1017" ||
            error?.message?.includes("Closed") ||
            error?.message?.includes("closed the connection") ||
            error?.message?.includes("Can't reach database server");

          if (isConnectionError && attempt < maxRetries) {
            const delay = attempt * 600; // 600ms, 1200ms
            console.warn(
              `[Prisma Connection Retry] Model: ${model || "raw"}, Operation: ${operation}, Attempt ${attempt}/${maxRetries} in ${delay}ms...`
            );
            await new Promise((resolve) => setTimeout(resolve, delay));
            continue;
          }
          throw error;
        }
      }
      throw lastError;
    },
  },
});

if (process.env.NODE_ENV !== "production") {
  global.prisma = basePrisma;
}

export default prisma;
