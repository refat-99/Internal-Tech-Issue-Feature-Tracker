import type { Response, NextFunction } from "express";
export declare const roleMiddleware: (role: string) => (req: any, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=role.middleware.d.ts.map