// 调试: 打印环境变量
console.log("[ENV] OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 10) + "..." : "NOT SET");
console.log("[ENV] OPENAI_BASE_URL:", process.env.OPENAI_BASE_URL || "NOT SET");
console.log("[ENV] OPENAI_MODEL:", process.env.OPENAI_MODEL || "NOT SET");

export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  // 支持多种API密钥配置方式
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? process.env.OPENAI_BASE_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? process.env.OPENAI_API_KEY ?? "",
  // DeepSeek 配置
  openaiModel: process.env.OPENAI_MODEL ?? "deepseek-chat",
};

console.log("[ENV] Final forgeApiKey:", ENV.forgeApiKey ? ENV.forgeApiKey.substring(0, 10) + "..." : "EMPTY");
console.log("[ENV] Final forgeApiUrl:", ENV.forgeApiUrl || "EMPTY (will use default)");
