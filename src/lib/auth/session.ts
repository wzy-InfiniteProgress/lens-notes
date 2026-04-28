import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAdminEmails, hasSupabaseEnv } from "@/lib/env";

export async function getOptionalUser() {
  if (!hasSupabaseEnv()) {
    return null;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function requireAdminUser(nextPath = "/admin") {
  if (!hasSupabaseEnv()) {
    return { user: null, previewMode: true };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/sign-in?next=${encodeURIComponent(nextPath)}`);
  }

  const adminEmails = getAdminEmails();
  const userEmail = user.email?.toLowerCase();

  if (adminEmails.length > 0 && (!userEmail || !adminEmails.includes(userEmail))) {
    redirect("/");
  }

  return { user, previewMode: false };
}
