"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";

interface PropsType {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

interface TenorResult {
  media_formats: {
    mp4?: { url: string };
    gif: { url: string };
  };
}

const TENOR_API_KEY = process.env.NEXT_PUBLIC_TENOR_API_KEY;

const GifButton = ({ onFileSelect, disabled }: PropsType) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [gifs, setGifs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchGifs = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://tenor.googleapis.com/v2/search?q=funny&key=${TENOR_API_KEY}&limit=100`
      );
      const data = await response.json();

      const mp4Urls = data.results
        .map((gif: TenorResult) => gif.media_formats.mp4?.url || gif.media_formats.gif.url)
        .filter((url: string | undefined): url is string => !!url);

      setGifs(mp4Urls);
    } catch {
      console.error("Error fetching GIFs:");
      toast({
        title: "Error",
        description: "No se pudieron cargar los GIFs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectGif = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File([blob], "post-gif.gif", { type: blob.type });
      onFileSelect(file);
      setModalOpen(false);
    } catch {
      toast({
        title: "Error",
        description: "No se pudo cargar el GIF",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        disabled={disabled}
        className="gap-1 !bg-transparent !p-0 !text-primary"
        onClick={() => {
          setModalOpen(true);
          fetchGifs();
        }}>
        <Image src="/icons/gif.svg" alt="GIF Icon" width={24} height={24} />
      </Button>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-h-[80vh] w-[90%] max-w-2xl rounded-lg bg-background p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Seleccionar GIF</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-foreground/50 hover:text-foreground">
                ✕
              </button>
            </div>

            {loading ? (
              <p className="text-center">Cargando GIFs...</p>
            ) : (
              <div className="max-h-[80vh] w-full max-w-2xl overflow-auto scroll-smooth rounded-lg bg-background p-6 scrollbar-thin">
                <div className="grid grid-cols-2 gap-3 overflow-auto md:grid-cols-3">
                  {gifs.map((gifUrl) => (
                    <div
                      key={gifUrl}
                      className="group relative cursor-pointer"
                      onClick={() => handleSelectGif(gifUrl)}>
                      <video
                        src={gifUrl}
                        muted
                        loop
                        autoPlay
                        playsInline
                        disablePictureInPicture
                        controls={false}
                        className="h-32 w-full rounded-lg object-cover transition-opacity group-hover:opacity-90"
                        style={{
                          objectFit: "cover",
                          backgroundColor: "transparent",
                        }}
                        controlsList="nodownload nofullscreen noremoteplayback"
                        preload="auto"
                        onMouseEnter={(e) => e.currentTarget.play()}
                        onMouseLeave={(e) => e.currentTarget.pause()}
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                        <span className="rounded bg-black/50 px-2 py-1 text-sm text-white">
                          Seleccionar
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default GifButton;
