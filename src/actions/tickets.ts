"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function createTicket(subject: string, message: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const userId = (session.user as any).id;

  const ticket = await prisma.ticket.create({
    data: {
      userId,
      subject,
      status: "OPEN",
    },
  });

  await prisma.message.create({
    data: {
      ticketId: ticket.id,
      senderId: userId,
      content: message,
    },
  });

  revalidatePath("/customer/dashboard");
  revalidatePath("/customer/tickets");
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/tickets");
  
  return ticket;
}

export async function sendMessage(ticketId: string, content: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const userId = (session.user as any).id;

  await prisma.message.create({
    data: {
      ticketId,
      senderId: userId,
      content,
    },
  });

  // If sender is admin, update ticket to PENDING/CLOSED or keep OPEN
  // For now just keep it simple
  
  revalidatePath(`/admin/tickets/${ticketId}`);
  revalidatePath(`/customer/tickets/${ticketId}`);
}

export async function updateTicketStatus(id: string, status: any) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") throw new Error("Unauthorized");

  await prisma.ticket.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin/tickets");
  revalidatePath("/customer/tickets");
}
