import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  return (
      <div className="rounded-2xl border border-white/10 p-6">

  <p>
    <strong>Name:</strong> {session.user?.name}
  </p>

  <p className="mt-3">
    <strong>Email:</strong> {session.user?.email}
  </p>

  <p className="mt-3">
    <strong>Role:</strong> {(session.user as any)?.role}
  </p>

  <div className="mt-6">
    <a
      href="/orders"
      className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20"
    >
      My Orders
    </a>
  </div>

</div>
  );
}