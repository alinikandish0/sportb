import { Request } from 'express';

export interface AuthenticatedUser {
  id: string;
  email: string;
}

/**
 * بعد از JwtAuthGuard، req.user واقعاً این شکلیه. با این تایپ، به‌جای
 * `any` یا تکرار `{ id: string; email: string }` تو هر controller،
 * می‌تونی مستقیم `@Req() req: RequestWithUser` بنویسی.
 */
export interface RequestWithUser extends Request {
  user: AuthenticatedUser;
}
