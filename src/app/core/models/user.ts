export interface User {
    createdAt: string;
    email: string;
    id: number;
    name: string;
    password: string;
    role: "ADMIN" | "USER";
    updatedAt: string;
  }