import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();

  // If user is logged in, redirect based on role
  if (session?.user) {
    if (session.user.role === "admin") {
      redirect("/admin");
    }
    redirect("/projects");
  }

  // If not logged in, redirect to login page
  redirect("/login");
}
