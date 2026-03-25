"use client";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrency } from "@/lib/utils";

export const generateInvoicePDF = (invoice: any, user: any) => {
  const doc = new jsPDF();
  const items = JSON.parse(invoice.items);

  // Header
  doc.setFontSize(22);
  doc.text("INVOICE", 105, 20, { align: "center" });
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Invoice ID: ${invoice.id}`, 20, 40);
  doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, 20, 45);
  doc.text(`Due Date: ${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}`, 20, 50);

  // Billing Info
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text("Bill To:", 20, 70);
  doc.setFontSize(10);
  doc.text(user.name || "Customer Name", 20, 78);
  doc.text(user.email, 20, 83);

  // Table
  autoTable(doc, {
    startY: 100,
    head: [["Item", "Quantity", "Price", "Total"]],
    body: items.map((item: any) => [
      item.name,
      item.quantity,
      formatCurrency(item.price),
      formatCurrency(item.price * item.quantity),
    ]),
    foot: [
      ["", "", "Subtotal", formatCurrency(invoice.subtotal)],
      ["", "", "Tax (10%)", formatCurrency(invoice.tax)],
      ["", "", "Total", formatCurrency(invoice.total)],
    ],
    theme: "striped",
    headStyles: { fillColor: [79, 70, 229] },
    footStyles: { fillColor: [249, 250, 251], textColor: [0, 0, 0], fontStyle: "bold" },
  });

  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text("Thank you for your business!", 105, pageHeight - 20, { align: "center" });

  doc.save(`invoice_${invoice.id}.pdf`);
};
