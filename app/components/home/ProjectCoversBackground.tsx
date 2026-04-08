"use client";

import { useState } from "react";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import styles from "./ProjectCoversBackground.module.css";

export default function ProjectCoversBackground() {
  const coverUrls = useQuery(api.projects.queries.getCoverImages);
  const [loadedCount, setLoadedCount] = useState(0);

  if (!coverUrls) {
    return (
      <div className={styles.backgroundContainer}>
        <div className={styles.loadingGrid} />
      </div>
    );
  }

  if (coverUrls.length === 0) {
    return (
      <div className={styles.backgroundContainer}>
        <div className={styles.placeholderGrid}>
          {Array.from({ length: 32 }).map((_, i) => (
            <div key={i} className={styles.placeholderItem} />
          ))}
        </div>
      </div>
    );
  }

  // Duplicar para garantizar cobertura completa del hero
  // Con más columnas (5) las imágenes son más grandes
  // Menos duplicaciones evitan repetición excesiva
  const DUPLICATION_COUNT = 35;
  
  const duplicatedImages = Array.from(
    { length: DUPLICATION_COUNT },
    () => coverUrls
  ).flat();
  
  const totalImages = duplicatedImages.length;
  const allLoaded = loadedCount >= totalImages;

  return (
    <div className={styles.backgroundContainer}>
      <div className={`${styles.coversGrid} ${allLoaded ? styles.animated : ""}`}>
        {duplicatedImages.map((url, index) => (
          <div key={`${url}-${index}`} className={styles.coverItem}>
            {url && (
              <Image
                src={url}
                alt={`Project cover ${index + 1}`}
                fill
                className={styles.coverImage}
                sizes="(max-width: 480px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
                quality={50}
                priority={index < 70}
                onLoadingComplete={() => {
                  setLoadedCount((prev) => prev + 1);
                }}
              />
            )}
            <div className={styles.coverOverlay} />
          </div>
        ))}
      </div>
    </div>
  );
}
