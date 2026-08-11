import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "customer" | "admin";
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
