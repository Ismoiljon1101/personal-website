import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import Markdown from "react-markdown";

interface Props {
  title: string;
  href?: string;
  description: string;
  dates: string;
  tags: readonly string[];
  image?: string;
  video?: string;
  links?: readonly {
    icon: React.ReactNode;
    type: string;
    href: string;
  }[];
}

export function ProjectCard({
  title,
  href,
  description,
  dates,
  tags,
  image,
  video,
  links,
}: Props) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border transition-colors duration-300 hover:border-foreground/30 sm:flex-row">
      <Link
        href={href || "#"}
        className="block shrink-0 cursor-pointer overflow-hidden sm:w-[42%]"
        aria-label={title}
      >
        {video && (
          <video
            src={video}
            autoPlay
            loop
            muted
            playsInline
            className="pointer-events-none h-44 w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03] sm:h-full"
          />
        )}
        {image && !video && (
          <Image
            src={image}
            alt={title}
            width={640}
            height={400}
            className="h-44 w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03] sm:h-full"
          />
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        <div className="flex items-baseline justify-between gap-3">
          <Link href={href || "#"} className="hover:underline underline-offset-4">
            <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
          </Link>
          <time className="shrink-0 font-mono text-xs text-muted-foreground">
            {dates}
          </time>
        </div>

        <Markdown className="prose max-w-full text-pretty font-sans text-sm leading-relaxed text-muted-foreground dark:prose-invert">
          {description}
        </Markdown>

        {tags && tags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {tags.map((tag) => (
              <Badge
                className="px-1.5 py-0 text-[11px] font-normal"
                variant="secondary"
                key={tag}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {links && links.length > 0 && (
          <div className="flex flex-row flex-wrap items-start gap-1.5 pt-1">
            {links.map((link, idx) => (
              <Link href={link.href} key={idx} target="_blank">
                <Badge className="flex gap-1.5 px-2 py-1 text-[11px]">
                  {link.icon}
                  {link.type}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
