"use client";
import { useReveal } from "@/hooks/useReveal";
import type { ElementType, ReactNode } from "react";

export function Reveal({
  as: Tag = "div",
  className = "",
  children,
  ariaHidden,
  id,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  ariaHidden?: boolean;
  id?: string;
}) {
  const { ref, revealed } = useReveal<HTMLDivElement>();
  return (
    <Tag
      ref={ref}
      id={id}
      className={`reveal${revealed ? " in" : ""} ${className}`.trim()}
      aria-hidden={ariaHidden}
    >
      {children}
    </Tag>
  );
}
