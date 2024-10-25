import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from 'next/font/google'
import Navbar from "@/components/custom/navbar";
import { BackgroundBeamsWithCollision } from "@/components/ui/bg-beams";
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner";

const font = Poppins({
  subsets: ['latin'],
  weight: ["400", "500", "600", "700"],
});
export const metadata: Metadata = {
  title: "FlowPI",
  description: "Generated by vaxad",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${font.className} antialiased min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          <BackgroundBeamsWithCollision className="w-full h-full">
            <Navbar />
            {children}
          </BackgroundBeamsWithCollision>
        </ThemeProvider>
      </body>
    </html>
  );
}
