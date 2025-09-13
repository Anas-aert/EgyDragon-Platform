// 🔧 prisma/client.ts - النسخة المحسنة
import { PrismaClient } from "@prisma/client";

// 🔹 تعريف النوع بشكل آمن
const globalForPrisma = globalThis as unknown as { 
  prisma: PrismaClient | undefined 
};

// ✅ إنشاء Prisma Client مع إعدادات محسنة
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    // 🔧 إعدادات تحسين الأداء
    transactionOptions: {
      maxWait: 5000, // 5 seconds
      timeout: 10000, // 10 seconds
    },
  });

// 🔹 حفظ الـ instance في development فقط
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// 🔧 دالة مساعدة لإدارة الاتصالات
export async function connectPrisma() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }
}

// 🔧 دالة لإغلاق الاتصالات بشكل آمن
export async function disconnectPrisma() {
  try {
    await prisma.$disconnect();
    console.log("✅ Database disconnected successfully");
  } catch (error) {
    console.error("❌ Database disconnection failed:", error);
  }
}

// 🔧 Wrapper للعمليات مع error handling محسن
export async function withPrismaTransaction<T>(
  operation: (prisma: PrismaClient) => Promise<T>
): Promise<T> {
  try {
    const result = await operation(prisma);
    return result;
  } catch (error) {
    console.error("❌ Prisma operation failed:", error);
    
    // في حالة connection error، حاول إعادة الاتصال
    if (error.code === 'P1001' || error.message.includes('connection')) {
      console.log("🔄 Attempting to reconnect...");
      await prisma.$disconnect();
      await prisma.$connect();
      
      // حاول العملية مرة أخرى
      return await operation(prisma);
    }
    
    throw error;
  }
}

// 🔧 دالة للتحقق من حالة الاتصال
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error("❌ Database health check failed:", error);
    return false;
  }
}

// 🔧 تنظيف الاتصالات عند إغلاق التطبيق
process.on('SIGINT', async () => {
  console.log('🔄 Graceful shutdown...');
  await disconnectPrisma();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🔄 Graceful shutdown...');
  await disconnectPrisma();
  process.exit(0);
});

// 🔧 Export default
export default prisma;