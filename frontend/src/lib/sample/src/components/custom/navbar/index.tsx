"use client"
import React from "react";
import { ModeToggle } from "@/components/mode-toggle";
import * as all from "@/lib/entities";
import { SelectMap } from "@/components/select";
import { useRouter } from "next/navigation";

const navLinks = ["home", ...Object.keys(all).map((key) => {
  const entity = all[key as keyof typeof all];
  return entity.name
})];

export default function navbar() {
  const [active, setActive] = React.useState<string>(navLinks[0]);
  const router = useRouter();
  const onChange = (name: string) => {
    setActive(name);
    router.push(`/${name.toLowerCase() === "home" ? "" : name.toLowerCase()}`);
  }
  return (
    <>
      <div className="flex w-full px-10 justify-between items-center min-h-14 opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto bg-foreground/30">
        <div className="flex items-center gap-2 min-w-32">
          <div className="size-6 rounded-full bg-foreground"></div>
          <h1 className="text-lg font-black">FlowPro</h1>
        </div>
        <div className="min-w-32 flex items-center gap-2 justify-end">
          <SelectMap onChange={onChange} value={active} values={navLinks} />
          <ModeToggle />
        </div>
      </div>
      {/* <nav className="flex fixed top-2 text-xs font-medium text-gray-400 rounded-full p-0.5 w-fit border border-zinc-600 left-1/2 -translate-x-1/2 bg-white/10 z-50">
        {navLinks.map((link, index) => (
          <NavLink key={index} href={link.href} name={link.name} />
        ))}
      </nav> */}
    </>
  );
}
