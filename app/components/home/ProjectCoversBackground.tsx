"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import styles from "./ProjectCoversBackground.module.css";

export default function ProjectCoversBackground() {
  const coverUrls = useQuery(api.projects.queries.getCoverImages);

  console.log("Cover URLs from query:", coverUrls);

  if (!coverUrls) {
    return (
      <div className={styles.backgroundContainer}>
        <div className={styles.loadingGrid} />
        <div style={{ position: "fixed", top: "10px", left: "10px", color: "white", zIndex: 1000 }}>
          Loading covers...
        </div>
      </div>
    );
  }

  if (coverUrls.length === 0) {
    console.log("No cover images found");
    return (
      <div className={styles.backgroundContainer}>
        <div className={styles.placeholderGrid}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className={styles.placeholderItem} />
          ))}
        </div>
        <div style={{ position: "fixed", top: "10px", left: "10px", color: "white", zIndex: 1000 }}>
          No covers available
        </div>
      </div>
    );
  }

  console.log("Found covers:", coverUrls.length);

  const duplicatedImages = [...coverUrls, ...coverUrls];

  return (
    <div className={styles.backgroundContainer}>
      <div style={{ position: "fixed", top: "10px", left: "10px", color: "white", zIndex: 1000, fontSize: "12px" }}>
        {coverUrls.length} covers loaded
      </div>
      <div className={styles.coversGrid}>
        {duplicatedImages.map((url, index) => (
          <div key={`${url}-${index}`} className={styles.coverItem}>
            {url && (
              <img
                src={url}
                alt={`Project cover ${index + 1}`}
                className={styles.coverImage}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}
            <div className={styles.coverOverlay} />
          </div>
        ))}
      </div>
    </div>
  );
}
