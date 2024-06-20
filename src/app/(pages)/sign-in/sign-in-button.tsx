"use client";

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

export function SignInButton() {
  const { pending } = useFormStatus();

  return <Button disabled={pending}>Sign in with Google</Button>;
}
