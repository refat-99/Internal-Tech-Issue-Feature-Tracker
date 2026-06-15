import type { IIssue, IUser } from "../../types/type";
export declare const createIssue: (payload: IIssue, reporterId: number) => Promise<any>;
export declare const getAllIssues: (query: any) => Promise<{
    id: any;
    title: any;
    description: any;
    type: any;
    status: any;
    reporter: any;
    created_at: any;
    updated_at: any;
}[]>;
export declare const getSingleIssue: (id: number) => Promise<any>;
export declare const updateIssue: (id: number, payload: any, currentUser: IUser) => Promise<any>;
export declare const deleteIssue: (id: number) => Promise<any>;
//# sourceMappingURL=issue.service.d.ts.map