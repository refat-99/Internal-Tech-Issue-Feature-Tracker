export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface IIssue {
  id: number;
  title: string;
  description: string;
  type: string;
  status: string;
  reporter_id: number;
  created_at: Date;
  updated_at: Date;
}