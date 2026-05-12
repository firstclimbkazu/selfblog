"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

function AutoSignIn() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";

  useEffect(() => {
    signIn("google", { callbackUrl });
  }, [callbackUrl]);

  return null;
}

export default function SignInPage() {
  return (
    <Suspense>
      <AutoSignIn />
    </Suspense>
  );
}
