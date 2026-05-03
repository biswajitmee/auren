import Image from "next/image";

import { GoldButton } from "@/components/ui/GoldButton";

type ProductCardProps = {
  name: string;
  size: string;
  price: string;
  image: string;
};

export function ProductCard({ name, size, price, image }: ProductCardProps) {
  return (
    <article className="gold-frame group relative flex min-h-[38rem] flex-col justify-between overflow-hidden border border-gold/22 bg-obsidian/62 p-5 transition duration-500 hover:-translate-y-2 hover:border-gold/62 hover:shadow-gold-soft">
      <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent opacity-0 transition group-hover:opacity-100" />
      <div className="relative h-80 overflow-hidden bg-charcoal/55">
        <Image
          alt={name}
          className="image-lift object-cover opacity-82 transition duration-700 group-hover:scale-105 group-hover:opacity-96"
          fill
          sizes="(min-width: 1024px) 30vw, 90vw"
          src={image}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent" />
      </div>
      <div className="pt-7">
        <p className="font-mono text-[0.68rem] uppercase text-gold/70">{size}</p>
        <h3 className="mt-3 font-display text-4xl leading-tight text-ivory">{name}</h3>
        <div className="mt-7 flex items-center justify-between gap-4">
          <span className="font-mono text-sm text-ivory/72">{price}</span>
          <GoldButton className="px-4 py-2">Add to Collection</GoldButton>
        </div>
      </div>
    </article>
  );
}
