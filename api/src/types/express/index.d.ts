export {};

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      cleanBody?: any;
      role?: string;
      user?: {
        userId: number;
        name: string;
        email: string;
        role: string;
      };
    }
  }
}