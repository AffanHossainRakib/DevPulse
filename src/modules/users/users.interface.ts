export interface IUser {
  id: number;
  name: string;
  email: string;
  role: "contributor" | "maintainer";
  created_at: Date | string;
  updated_at: Date | string;
}

export interface INewUser {
  name: string;
  email: string;
  password: string;
  role?: "contributor" | "maintainer";
}
