"use client";

import { useState } from "react";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import ImageLightbox from "./ImageLightbox";

interface ProjectGalleryCarouselProps {
  images: string[];
  projectTitle: string;
}

export default function ProjectGalleryCarousel({
  images,
  projectTitle,
}: ProjectGalleryCarouselProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!images || images.length === 0) {
    return null;
  }

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setLightboxOpen(true);
  };

  const validImages = images.filter((url): url is string => !!url);

  return (
    <div className="w-full">
      <Carousel
        opts={{
          align: "start",
          loop: true,
          slidesToScroll: 2,
        }}
        className="w-full"
      >
        <CarouselContent>
          {validImages.map((imageUrl, index) => (
            <CarouselItem key={index} className="basis-1/2">
              <div className="bg-black rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800">
                <button
                  onClick={() => handleImageClick(imageUrl)}
                  className="relative w-full aspect-video bg-black hover:opacity-90 transition-opacity cursor-pointer group"
                >
                  <Image
                    src={imageUrl}
                    alt={`${projectTitle} - Image ${index + 1}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                    <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 13H7"
                        />
                      </svg>
                    </div>
                  </div>
                </button>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {validImages.length > 2 && (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        )}
      </Carousel>

      {selectedImage && (
        <ImageLightbox
          imageUrl={selectedImage}
          alt={`${projectTitle} - Fullscreen view`}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
