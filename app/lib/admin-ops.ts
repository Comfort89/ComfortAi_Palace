"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { ORDER_STATUSES } from "@/lib/order-status";

export async function updateOrderStatus(orderId: string, status: string) {
  await requireAdmin();
  if (!ORDER_STATUSES.includes(status)) throw new Error("Invalid status.");
  await prisma.order.update({ where: { id: orderId }, data: { status } });
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath(`/orders/${orderId}`);
}

export async function deleteReview(reviewId: string) {
  await requireAdmin();
  await prisma.review.delete({ where: { id: reviewId } });
  revalidatePath("/admin/reviews");
}

export async function setSupportHandled(messageId: string, handled: boolean) {
  await requireAdmin();
  await prisma.supportMessage.update({ where: { id: messageId }, data: { handled } });
  revalidatePath("/admin/support");
}

export async function setUserRole(userId: string, role: string) {
  await requireAdmin();
  if (!["ADMIN", "CUSTOMER"].includes(role)) throw new Error("Invalid role.");
  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/customers");
}
