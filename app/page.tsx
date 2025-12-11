"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isSessionValid } from "@/lib/auth/session";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (isSessionValid()) {
      router.push("/editor");
    } else {
      router.push("/auth");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="text-zinc-600 dark:text-zinc-400">Loading...</div>
    </div>
  );
}
