import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { smsVerificationCodes, users } from "../../drizzle/schema";
import { eq, and, gt, desc } from "drizzle-orm";

/**
 * 生成6位随机验证码
 */
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * 验证手机号格式（中国大陆11位手机号）
 */
function isValidPhoneNumber(phone: string): boolean {
  return /^1[3-9]\d{9}$/.test(phone);
}

/**
 * SMS验证码路由器
 * 处理短信验证码的发送、验证和手机号登录
 */
export const smsRouter = router({
  /**
   * 发送验证码
   * 开发模式下验证码固定为 "123456"，生产环境需要集成真实短信服务
   */
  sendCode: publicProcedure
    .input(
      z.object({
        phoneNumber: z.string().length(11, "手机号必须是11位"),
        type: z.enum(["login", "register"]).default("login"),
      })
    )
    .mutation(async ({ input }) => {
      const { phoneNumber, type } = input;

      // 验证手机号格式
      if (!isValidPhoneNumber(phoneNumber)) {
        throw new Error("手机号格式不正确");
      }

      // 检查是否频繁发送（1分钟内只能发送一次）
      const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
      const db = await getDb();
      if (!db) {
        throw new Error("数据库不可用");
      }

      const recentCodes = await db
        .select()
        .from(smsVerificationCodes)
        .where(
          and(
            eq(smsVerificationCodes.phoneNumber, phoneNumber),
            gt(smsVerificationCodes.createdAt, oneMinuteAgo)
          )
        )
        .limit(1);
      const recentCode = recentCodes[0];

      if (recentCode) {
        throw new Error("验证码发送过于频繁，请稍后再试");
      }

      // 生成验证码（开发模式固定为123456）
      const code = process.env.NODE_ENV === "production" 
        ? generateVerificationCode() 
        : "123456";

      // 设置过期时间（5分钟后）
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      // 保存验证码到数据库
      await db.insert(smsVerificationCodes).values({
        phoneNumber,
        code,
        type,
        used: 0,
        expiresAt,
      });

      // TODO: 在生产环境中，这里应该调用阿里云短信API发送验证码
      // 开发模式下，直接在控制台打印验证码
      if (process.env.NODE_ENV !== "production") {
        console.log(`[SMS] 手机号 ${phoneNumber} 的验证码是: ${code}`);
      }

      return {
        success: true,
        message: "验证码已发送",
        // 开发模式下返回验证码，方便测试
        ...(process.env.NODE_ENV !== "production" && { code }),
      };
    }),

  /**
   * 验证验证码并登录/注册
   */
  verifyAndLogin: publicProcedure
    .input(
      z.object({
        phoneNumber: z.string().length(11, "手机号必须是11位"),
        code: z.string().length(6, "验证码必须是6位"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { phoneNumber, code } = input;

      // 验证手机号格式
      if (!isValidPhoneNumber(phoneNumber)) {
        throw new Error("手机号格式不正确");
      }

      // 查找未使用且未过期的验证码
      const db = await getDb();
      if (!db) {
        throw new Error("数据库不可用");
      }

      const verificationCodes = await db
        .select()
        .from(smsVerificationCodes)
        .where(
          and(
            eq(smsVerificationCodes.phoneNumber, phoneNumber),
            eq(smsVerificationCodes.code, code),
            eq(smsVerificationCodes.used, 0),
            gt(smsVerificationCodes.expiresAt, new Date())
          )
        )
        .orderBy(desc(smsVerificationCodes.createdAt))
        .limit(1);
      const verificationCode = verificationCodes[0];

      if (!verificationCode) {
        throw new Error("验证码错误或已过期");
      }

      // 标记验证码为已使用
      await db
        .update(smsVerificationCodes)
        .set({ used: 1 })
        .where(eq(smsVerificationCodes.id, verificationCode.id));

      // 查找或创建用户
      const existingUsers = await db
        .select()
        .from(users)
        .where(eq(users.phoneNumber, phoneNumber))
        .limit(1);
      let user = existingUsers[0];

      if (!user) {
        // 创建新用户
        const [newUser] = await db.insert(users).values({
          openId: `phone_${phoneNumber}`, // 使用手机号作为openId
          phoneNumber,
          name: `用户${phoneNumber.slice(-4)}`, // 默认昵称：用户+后4位
          loginMethod: "phone_sms",
          role: "user",
        });

        const newUsers = await db
          .select()
          .from(users)
          .where(eq(users.id, newUser.insertId))
          .limit(1);
        user = newUsers[0];
      } else {
        // 更新最后登录时间
        await db
          .update(users)
          .set({ lastSignedIn: new Date() })
          .where(eq(users.id, user.id));
      }

      if (!user) {
        throw new Error("用户创建失败");
      }

      // TODO: 生成JWT token或session
      // 这里需要根据项目的认证系统来实现
      // 暂时返回用户信息，前端可以保存到本地存储

      return {
        success: true,
        message: "登录成功",
        user: {
          id: user.id,
          phoneNumber: user.phoneNumber,
          name: user.name,
          role: user.role,
        },
      };
    }),
});
