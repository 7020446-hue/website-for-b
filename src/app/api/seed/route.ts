import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
  // Use a simple check or secret for security in real apps
  // For this demo, let's just seed if no users exist
  const usersCount = await prisma.user.count();
  
  if (usersCount > 0) {
    return NextResponse.json({ message: "Database already seeded" });
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);
  const customerPassword = await bcrypt.hash("customer123", 10);

  // Admin
  await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: hashedPassword,
      name: "Admin User",
      role: "ADMIN",
    },
  });

  // Customer
  await prisma.user.create({
    data: {
      email: "customer@example.com",
      password: customerPassword,
      name: "John Doe",
      role: "CUSTOMER",
    },
  });

  // Dummy products
  await prisma.product.createMany({
    data: [
      {
        name: "Enterprise Cloud Hosting",
        description: "Scale your business with our cloud infrastructure.",
        price: 299.99,
        category: "Services",
        type: "fixed",
        minQuantity: 1,
      },
      {
        name: "Custom Software Development",
        description: "Bespoke software solutions tailored to your needs.",
        price: null, // Custom quote
        category: "Services",
        type: "custom",
        minQuantity: 1,
      },
      {
        name: "Premium Workstation X1",
        description: "High performance workstation for power users.",
        price: 1899.00,
        category: "Hardware",
        type: "fixed",
        minQuantity: 1,
      },
    ],
  });

  return NextResponse.json({ message: "Database seeded successfully" });
}
