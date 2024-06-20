"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ArrowDown01, ArrowDown10, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

type Filters = {
  title: string;
  sort: "asc" | "desc";
};

export function Filters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm<Filters>({
    defaultValues: {
      title: searchParams.get("title") ?? "",
      sort: searchParams.get("sort") === "asc" ? "asc" : "desc",
    },
  });

  function handleSubmit(data: Filters) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("title", data.title);
    params.set("sort", data.sort);
    router.push(pathname + "?" + params.toString());
  }

  return (
    <Form {...form}>
      <form className="flex gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Search movie..." {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {form.getValues().sort === "asc" ? (
          <Button
            size="icon"
            variant="outline"
            onClick={() => form.setValue("sort", "desc")}
          >
            <ArrowDown01 className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            size="icon"
            variant="outline"
            onClick={() => form.setValue("sort", "asc")}
          >
            <ArrowDown10 className="h-4 w-4" />
          </Button>
        )}

        <Button>
          <Search className="w-4 h-4 mr-2" />
          <span>Search</span>
        </Button>
      </form>
    </Form>
  );
}
