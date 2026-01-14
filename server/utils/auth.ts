import bcryptjs from "bcryptjs";

/**
 * 哈希密码
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
}

/**
 * 验证密码
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcryptjs.compare(password, hash);
}

/**
 * 验证邮箱格式
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 验证密码强度
 */
export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 6) {
    errors.push("密码长度至少6个字符");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("密码需要包含小写字母");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("密码需要包含大写字母");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("密码需要包含数字");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
