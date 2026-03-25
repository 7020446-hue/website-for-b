import { redirect } from "next/navigation";

export default function HomePage() {
  // For this SaaS app, we want to drive people directly to the products or login
  // We'll redirect to the public product catalog by default
  redirect("/products");
}
