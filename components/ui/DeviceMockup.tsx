import Image from "next/image";

type DeviceMockupProps = {
  title: string;
  detail: string;
  ratio: string;
  image: string;
};

export function DeviceMockup({ title, detail, ratio, image }: DeviceMockupProps) {
  return (
    <article className="group">
      <div
        className="relative mx-auto w-full overflow-hidden border border-gold/18 bg-charcoal/50 shadow-gold-soft transition duration-500 group-hover:-translate-y-2 group-hover:border-gold/55"
        style={{ aspectRatio: ratio }}
      >
        <Image
          alt={title}
          className="image-lift object-cover opacity-78 transition duration-700 group-hover:scale-105 group-hover:opacity-95"
          fill
          sizes="(min-width: 1024px) 28vw, 80vw"
          src={image}
        />
        <div className="absolute inset-0 border-[10px] border-obsidian/82" />
      </div>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-3xl text-ivory">{title}</h3>
          <p className="mt-1 font-mono text-xs uppercase text-gold/65">{detail}</p>
        </div>
      </div>
    </article>
  );
}
