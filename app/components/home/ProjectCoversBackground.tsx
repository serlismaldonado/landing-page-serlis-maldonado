"use client";

import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import styles from "./ProjectCoversBackground.module.css";

export default function ProjectCoversBackground() {
  const coverUrls = useQuery(api.projects.queries.getCoverImages);

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
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className={styles.placeholderItem} />
          ))}
        </div>
      </div>
    );
  }

  const duplicatedImages = [...coverUrls, ...coverUrls];

  return (
    <div className={styles.backgroundContainer}>
      <div className={styles.coversGrid}>
        {duplicatedImages.map((url, index) => (
          <div key={index} className={styles.coverItem}>
            <Image
              src={url}
              alt={`Project cover ${index + 1}`}
              fill
              className={styles.coverImage}
              sizes="(max-width: 768px) 25vw, (max-width: 1024px) 20vw, 16vw"
              quality={50}
              priority={index < 5}
            />
            <div className={styles.coverOverlay} />
          </div>
        ))}
      </div>
    </div>
  );
}
