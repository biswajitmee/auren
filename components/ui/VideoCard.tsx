import Image from "next/image";
import { Play } from "lucide-react";

type VideoCardProps = {
  image: string;
  title: string;
  caption: string;
};

export function VideoCard({ image, title, caption }: VideoCardProps) {
  return (
    <div className="group relative min-h-[82vh] overflow-hidden border border-gold/18 bg-charcoal/45 shadow-gold-soft">
      <Image
        alt={title}
        className="image-lift object-cover opacity-86 transition duration-700 group-hover:scale-105 group-hover:opacity-95"
        fill
        priority={false}
        sizes="100vw"
        src={image}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/18 to-obsidian/14" />
      <button
        aria-label="Play campaign film"
        className="focus-ring absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold/70 bg-obsidian/30 text-gold backdrop-blur-sm transition group-hover:scale-105 group-hover:bg-gold group-hover:text-obsidian"
        type="button"
      >
        <Play className="h-8 w-8 fill-current" />
      </button>
      <div className="absolute bottom-8 left-6 right-6 flex flex-col gap-2 text-center sm:left-10 sm:right-10">
        <p className="font-display text-4xl text-ivory sm:text-6xl">{title}</p>
        <p className="font-mono text-xs uppercase text-gold/70">{caption}</p>
      </div>
    </div>
  );
}
