import bcrypt from 'bcryptjs';

/**
 * 비밀번호를 해시화합니다.
 * @param password 평문 비밀번호
 * @returns 해시화된 비밀번호
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * 평문 비밀번호와 해시화된 비밀번호를 비교합니다.
 * @param password 평문 비밀번호
 * @param hashedPassword 해시화된 비밀번호
 * @returns 비밀번호가 일치하면 true, 아니면 false
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}
