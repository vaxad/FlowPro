"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import { Link } from "lucide-react";

const formSchema = z.object({
  query: z.string().min(1, {
    message: "Query must be at least 1 character.",
  }),
});

export default function QueryForm() {
  const [file, setFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Here you would typically send the form data to your server
    console.log(values, file);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="py-2 pl-2 pr-4 bg-cyan-400/20 rounded-full mb-2 text-xs text-cyan-300">
            <span className="bg-cyan-300 text-black text-xs font-semibold px-2 py-0.5 rounded-full mr-2">Error Free!</span>
            Try this even if you are new to backend.
        </div>
      <h1 className="text-center text-4xl font-semibold mb-10 bg-clip-text bg-gradient-to-b from-white to-slate-500 text-transparent">
        How can we help you ship your Backend?
      </h1>

      <div className="w-full max-w-4xl px-4 border focus-within:border-white transition-colors rounded-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your query here..."
                      className="min-h-[40px] mt-3 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between mb-4">
              <div className="mb-4">
                <Input
                  type="file"
                  accept=".pdf"
                  id="pdf-upload"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="mr-2"
                  onClick={() => document.getElementById("pdf-upload")?.click()}
                >
                  <Link className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  {file ? file.name : "Upload PDF (optional)"}
                </span>
              </div>
              <div className="mb-4">
                <Button type="submit" className="w-fit">
                  <Upload className="h-4 mr-1"/> Submit
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
