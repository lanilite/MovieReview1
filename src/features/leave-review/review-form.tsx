"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { RatingSelect } from "./rating-select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { leaveReview } from "./actions";
import { type FormSchema, formSchema } from "./schema";

export function ReviewForm({
  movieId,
  authorId,
}: {
  movieId: number;
  authorId: string | undefined;
}) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
      rating: 1,
    },
  });

  const [isPending, startTransition] = useTransition();

  function handleSubmit(data: FormSchema) {
    startTransition(async () => {
      if (!authorId) {
        throw new Error("You must be logged in to leave a review");
      }

      await leaveReview({ ...data, movieId, authorId });
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Leave a review</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="w-fit mx-auto flex flex-col items-center">
              <span className="text-sm font-medium mb-2">
                How would you rate this movie?
              </span>

              <RatingSelect
                rating={form.watch("rating")}
                onSelect={(rating) => form.setValue("rating", rating)}
              />
            </div>

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment</FormLabel>

                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter>
            <Button disabled={isPending || !authorId}>Leave review</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
