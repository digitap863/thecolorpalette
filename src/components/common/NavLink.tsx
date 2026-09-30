"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface NavLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

const NavLink = ({ href, children, className }: NavLinkProps) => {
  const pathname = usePathname();

  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`${isActive ? "text-black font-bold" : "text-neutral-700 hover:text-black font-medium"} ${className}`}
    >
      {children}
    </Link>
  );
};

export default NavLink;