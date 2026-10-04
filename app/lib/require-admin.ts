import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const id = (session?.user as { id?: string } | undefined)?.id;
  if (!id) redirect("/login");
  const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
  let me = await prisma.user.findUnique({ where: { id } });
  if (!me) redirect("/login");
  if (adminCount === 0 && me.role !== "ADMIN") {
    me = await prisma.user.update({ where: { id }, data: { role: "ADMIN" } });
  }
  if (me.role !== "ADMIN") {
    throw new Error("Admin access only.");
  }
  return me;
}
