import { UserRoles } from "@/types/userTypes";

export const users = [
  {
    id: "1",
    username: process.env.NEXTAUTH_USERNAME,
    password: process.env.NEXTAUTH_PASSWORD,
    name: process.env.NEXTAUTH_NAME,
    email: process.env.NEXTAUTH_EMAIL,
    role: UserRoles.Admin,
  },
];
