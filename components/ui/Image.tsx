import type { ImgHTMLAttributes } from "react";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string;
  alt: string;
  // Igual que `fill` de next/image: ocupa todo el contenedor (que debe ser relative).
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
};

// Las imágenes vienen del CDN de Convex o de Notion ya optimizadas, así que basta un <img>.
export default function Image({ fill, priority, className, style, ...rest }: Props) {
  return (
    <img
      {...rest}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
      className={className}
      style={fill ? { position: "absolute", inset: 0, width: "100%", height: "100%", ...style } : style}
    />
  );
}
