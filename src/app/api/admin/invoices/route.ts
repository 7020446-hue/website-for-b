import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if ((session?.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
  const { userId, items, subtotal, tax, total, dueDate } = data;

  try {
    const invoice = await prisma.invoice.create({
      data: {
        userId,
        items: JSON.stringify(items),
        subtotal: parseFloat(subtotal),
        tax: parseFloat(tax),
        total: parseFloat(total),
        status: "DRAFT",
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    return NextResponse.json(invoice);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 });
  }
}
