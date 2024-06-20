import { signIn } from "@/auth";
import { SignInButton } from "./sign-in-button";

export default function SignIn() {
  return (
    <main className="py-16 flex justify-center">
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/" });
        }}
      >
        <SignInButton />
      </form>
    </main>
  );
}
