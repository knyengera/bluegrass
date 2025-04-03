import { randomBytes } from 'crypto';

export const generateVerificationCode = (): string => {
  // Generate a 6-digit verification code
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export function isVerificationCodeValid(code: string, storedCode: string): boolean {
  // Check if the code matches
  return code === storedCode;
} 