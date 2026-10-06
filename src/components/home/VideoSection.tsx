"use client";

import { useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

export interface VideoSectionProps {
  videoSrc?: string;
}

export default function VideoSection({
  videoSrc = "/Video/home.mp4",
}: VideoSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {
        // Handle potential autoplay restrictions
      });
      setIsPlaying(true);
    }
  };

  return (
    <section 
      className="relative w-full h-[80vh] min-h-[350px] overflow-hidden bg-black group cursor-pointer flex items-center justify-center"
      onClick={togglePlayPause}
    >
      {/* Autoplay Loop Video */}
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Dark subtle overlay for contrast */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />

      {/* Hover-only Center Play/Pause Button */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <button
          onClick={(e) => {
            e.stopPropagation();
            togglePlayPause();
          }}
          aria-label={isPlaying ? "Pause video" : "Play video"}
          className="pointer-events-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white hover:bg-white/40 hover:scale-110 active:scale-95 transition-all duration-300 shadow-2xl cursor-pointer"
        >
          {isPlaying ? (
            <Pause className="w-7 h-7 sm:w-8 sm:h-8 fill-white stroke-none" />
          ) : (
            <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white stroke-none ml-1" />
          )}
        </button>
      </div>
    </section>
  );
}
