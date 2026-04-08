"use client";

import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

interface ProjectGalleryCarouselProps {
  images: string[];
  projectTitle: string;
}

export default function ProjectGalleryCarousel({
  images,
  projectTitle,
}: ProjectGalleryCarouselProps) {
  if (!images || images.length === 0) {
    return null;
  }

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
          {images
            .filter((url): url is string => !!url)
            .map((imageUrl, index) => (
              <CarouselItem key={index} className="basis-1/2">
                <div className="bg-white dark:bg-zinc-900 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800">
                  <div className="relative w-full aspect-video">
                    <Image
                      src={imageUrl}
                      alt={`${projectTitle} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
        </CarouselContent>

        {images.filter((url): url is string => !!url).length > 2 && (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        )}
      </Carousel>

      <div className="flex justify-center gap-2 mt-4">
        <div className="font-mono text-xs text-zinc-500">
          {images.filter((url): url is string => !!url).length} images
        </div>
      </div>
    </div>
  );
}
