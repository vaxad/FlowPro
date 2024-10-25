import { NavLinkProps } from "@/lib/types/common";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import React from "react";
import NavLink from "./nav-link";
import { ModeToggle } from "@/components/ui/theme-toggler";
import Link from "next/link";

export default function navbar() {
  const navLinks: NavLinkProps[] = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "ERD",
      href: "/create",
    },
        {
            name: "Prompt",
            href: "/prompt"
        },
    {
      name: "Docs",
      href: "/docs",
    },

  ];
  return (
    <>
      <div className="flex w-full px-10  justify-between items-center min-h-14 opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto">
        <div className="flex items-center gap-2 min-w-32">
          <div className="size-6 rounded-full bg-foreground"></div>
          <h1 className="text-lg font-black">FlowPI</h1>
        </div>
        <div className="min-w-32 flex items-center gap-2 justify-end">
          <Link
            href={"https://github.com/vaxad/FlowPro"}
            className="flex w-fit items-center gap-1 hover:border-b border-foreground cursor-pointer"
          >
            Repo
            <ArrowTopRightIcon />
          </Link>
          {/* <ModeToggle /> */}
        </div>
      </div>
      <nav className="flex fixed top-2 text-xs font-semibold backdrop-blur-sm text-gray-200 rounded-full p-0.5 w-fit border border-white/10 left-1/2 -translate-x-1/2 bg-white/10 z-50">
        {navLinks.map((link, index) => (
          <NavLink key={index} href={link.href} name={link.name} />
        ))}
      </nav>
    </>
  );
}
