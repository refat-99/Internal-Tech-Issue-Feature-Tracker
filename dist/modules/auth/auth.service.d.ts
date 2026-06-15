import type { IUser } from "../../types/type";
export declare const signUpIntoDB: (payload: IUser) => Promise<any>;
export declare const logInintoDb: (payload: IUser) => Promise<{
    accesstoken: string;
    user: {
        id: any;
        name: any;
        email: any;
        role: any;
        created_at: any;
        updated_at: any;
    };
}>;
declare const authService: {
    signUpIntoDB: (payload: IUser) => Promise<any>;
    logInintoDb: (payload: IUser) => Promise<{
        accesstoken: string;
        user: {
            id: any;
            name: any;
            email: any;
            role: any;
            created_at: any;
            updated_at: any;
        };
    }>;
};
export default authService;
//# sourceMappingURL=auth.service.d.ts.map