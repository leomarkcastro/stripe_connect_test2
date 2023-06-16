import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

// @ts-ignore
export default NextAuth(authOptions);
