import { auth, signOut } from "@/auth";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddMovieForm } from "@/features/add-movie/add-movie-form";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <div>
      <header className="bg-primary/80 sticky top-0 backdrop-blur z-10">
        <div className="container py-2 justify-between items-center flex">
          <Link href="/" className="font-medium text-primary-foreground">
            Movie Review
          </Link>

          <nav className="gap-4 flex items-center">
            {session?.user.role === "admin" && (
              <Dialog>
                <DialogTrigger
                  className={buttonVariants({ variant: "secondary" })}
                >
                  Add movie
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add movie</DialogTitle>
                  </DialogHeader>

                  <AddMovieForm />
                </DialogContent>
              </Dialog>
            )}

            {session ? (
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <Button variant="secondary">Sign Out</Button>
              </form>
            ) : (
              <Link
                href="/sign-in"
                className={buttonVariants({ variant: "secondary" })}
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </header>

      {children}
    </div>
  );
}
