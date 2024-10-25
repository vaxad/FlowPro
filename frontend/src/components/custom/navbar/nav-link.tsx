"use client"
import { NavLinkProps } from "@/lib/types/common";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({ href, name }: NavLinkProps) {
    const path = usePathname();
    const isActive = path === href;
    return (
        <Link href={href} className={cn("px-4 py-2 rounded-full hover:bg-foreground hover:text-background transition-all", {
            "bg-foreground text-background": isActive
        })}>{name}</Link>
    )
}
