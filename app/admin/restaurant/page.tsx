import { redirect } from "next/navigation";

export default function AdminRestaurantRedirect() {
  redirect("/admin/dashboard");
}
