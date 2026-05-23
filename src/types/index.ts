export interface IRequestUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export type ROLES = "contributor" | "maintainer";
