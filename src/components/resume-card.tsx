"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

interface ResumeCardProps {
  logoUrl: string;
  altText: string;
  title: string;
  subtitle?: string;
  href?: string;
  badges?: readonly string[];
  period: string;
  description?: string;
}

export const ResumeCard = ({
  logoUrl,
  altText,
  title,
  subtitle,
  href,
  badges,
  period,
  description,
}: ResumeCardProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const header = (
    <div className="flex items-center gap-4">
      <Avatar className="size-12 shrink-0 border bg-muted-background dark:bg-foreground">
        <AvatarImage src={logoUrl} alt={altText} className="object-contain" />
        <AvatarFallback>{altText[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between gap-x-2">
          <h3 className="inline-flex items-center gap-x-1.5 text-sm font-semibold leading-none">
            {title}
            {badges &&
              badges.map((badge, index) => (
                <Badge variant="secondary" className="text-xs" key={index}>
                  {badge}
                </Badge>
              ))}
            {description && (
              <ChevronDownIcon
                className={cn(
                  "size-4 text-muted-foreground transition-transform duration-300",
                  isExpanded && "rotate-180"
                )}
              />
            )}
          </h3>
          <div className="text-right font-mono text-xs tabular-nums text-muted-foreground">
            {period}
          </div>
        </div>
        {subtitle && (
          <div className="mt-1 font-sans text-xs text-muted-foreground">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );

  if (!description) {
    const card = (
      <div className="rounded-lg py-2 transition-colors hover:bg-muted/40">
        {header}
      </div>
    );
    return href ? (
      <Link href={href} className="block">
        {card}
      </Link>
    ) : (
      card
    );
  }

  return (
    <div className="rounded-lg">
      <button
        type="button"
        aria-expanded={isExpanded}
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full rounded-lg py-2 text-left transition-colors hover:bg-muted/40"
      >
        {header}
      </button>
      <motion.div
        initial={false}
        animate={{
          opacity: isExpanded ? 1 : 0,
          height: isExpanded ? "auto" : 0,
        }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden"
      >
        <p className="pb-2 pl-16 pt-1 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </motion.div>
    </div>
  );
};
