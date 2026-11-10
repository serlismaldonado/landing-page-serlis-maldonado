import Image from "next/image";
import DecodeHeadline from "./DecodeHeadline";
import PixelTrail from "./PixelTrail";

const CONTACT_EMAIL = "serlismaldonado@heskala.com";

function WindowBar({ title }: { title: string }) {
  return (
    <div className="mb-3.5 flex items-center gap-2 font-mono text-[13px] text-zinc-500">
      <span className="h-3 w-3 rounded-full bg-red-500" />
      <span className="h-3 w-3 rounded-full bg-yellow-500" />
      <span className="h-3 w-3 rounded-full bg-green-500" />
      <span className="ml-1.5">{title}</span>
    </div>
  );
}

const windowClass =
  "rounded-[10px] border border-zinc-800 bg-zinc-950 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]";

export default function Hero() {
  return (
    <section className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-black px-6 py-20">
      <PixelTrail />

      <div className="relative z-10 flex w-full max-w-[804px] flex-col items-center gap-6 md:flex-row md:items-center">
        <div className={`${windowClass} w-full max-w-[260px] shrink-0 p-3.5`}>
          <WindowBar title="serlis.png" />
          <Image
            src="/serlis.jpg"
            alt="Serlis Maldonado"
            width={900}
            height={900}
            priority
            className="h-[280px] w-full rounded-md object-cover"
          />
        </div>

        <div className="flex w-full flex-col items-center gap-6 md:items-start">
          <div className={`${windowClass} w-full px-6 pb-6 pt-[18px]`}>
            <WindowBar title="serlismaldonado.com" />
            <DecodeHeadline
              text="Desarrollo de Software, IA y Herramientas"
              className="mt-1.5 font-(family-name:--font-doto) text-[34px] font-black leading-[1.05] tracking-[-0.04em] sm:text-[46px]"
            />
          </div>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="rounded-full border-2 border-[#D8E64A] bg-black px-10 py-3 font-mono text-sm text-white transition-colors hover:bg-[#D8E64A] hover:text-black"
          >
            Hablemos →
          </a>
        </div>
      </div>
    </section>
  );
}
