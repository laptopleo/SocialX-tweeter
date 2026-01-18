"use client";

import React, { useCallback } from "react";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@/components/spinner";
import { useCurrentUserContext } from "@/context/currentuser-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import useUploadcare from "@/hooks/useUploadcare";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { BASE_URL } from "@/lib/base-url";
import { toast } from "@/hooks/use-toast";
import { addComment } from "../../../actions/comment.action";

import useUploadcareVideo from "@/hooks/useUploadcareVideo";
import Image from "next/image";
import UploadMediaButton from "@/components/upload-button";
import GifButton from "@/components/gif";

import useTenorGifsCare from "@/hooks/useTenorGifs";
import { Modal, Dialog, DialogContent } from "@mui/material";
import { UserType } from "@/types/user.type";

interface PropsType {
  placeholder: string;
  isComment?: boolean;
  postUsername?: string;
  postId?: number;
  open: boolean;
  onClose: () => void;
}
const PostFormModal: React.FC<PropsType> = ({
  placeholder,
  isComment,
  postUsername,
  postId,
  open,
  onClose,
}) => {
  // 🔴 Añade estos nuevos estados para GIFs
  const {
    uploadGif,
    gifUploadedUrls,
    loading: uploadingGif,
    clearFile: clearGif,
  } = useTenorGifsCare();

  // 🔴 Función para subir GIFs

  const { uploadFile, uploadedUrl, uploading, clearFile } = useUploadcare();
  const {
    uploadVideo,
    uploadedUrl: uploadedVideoUrl,
    uploading: uploadingVideo,
    clearVideo,
  } = useUploadcareVideo(); // Hook para videos
  const { data, isLoading } = useCurrentUserContext();
  const queryClient = useQueryClient();

  const [loading, setLoading] = React.useState(false);

  const currentUser = data?.currentUser ?? ({} as UserType);

  const formSchema = z.object({
    body: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      body: "",
    },
  });

  const handleClose = useCallback(() => {
    onClose();
    clearGif();
    form.reset();
    clearFile();
    clearVideo();
  }, [onClose, clearGif, form, clearFile, clearVideo]); // Agregamos todas las dependencias necesarias

  // 🔴 Actualiza la función onSubmit
  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      try {
        setLoading(true);
        if (isComment && postId) {
          await addComment({
            body: values.body,
            postId: postId,
            commentImage: uploadedUrl || "",
            commentVideo: uploadedVideoUrl || "",
            commentGif: gifUploadedUrls || "", // 🎯 Nuevo campo
          });
          console.log("📝 Comentario enviado con GIF:");
          toast({
            title: "Success",
            description: "Comment created successfully",
            variant: "default",
          });
          queryClient.invalidateQueries({
            queryKey: isComment ? ["post", postId] : ["posts", "allposts"],
          });
        } else {
          await axios.post(`${BASE_URL}/api/posts`, {
            body: values.body,
            postImage: uploadedUrl || "",
            postVideo: uploadedVideoUrl || "",
            postGif: gifUploadedUrls || "", // 🎯 Nuevo campo
          });
          console.log("📝 Post enviado con GIF:", gifUploadedUrls);
          toast({
            title: "Success",
            description: "Post created successfully",
            variant: "default",
          });
          queryClient.invalidateQueries({
            queryKey: ["posts", "allposts"],
          });
        }
        handleClose(); // 🎯 Limpia el estado del GIF
      } catch {
        console.error("❌ Error en la creación del post:");
        toast({
          title: "Error",
          description: "Failed to create post or comment",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [
      isComment,
      postId,
      queryClient,
      uploadedUrl,
      uploadedVideoUrl,
      gifUploadedUrls,
      handleClose, // Solo dejamos handleClose aquí porque es la que afecta el resultado de onSubmit
    ]
  );

  const handleUploadFile = useCallback(
    async (file: File) => {
      if (!file) return;
      await uploadFile(file);
    },
    [uploadFile]
  );

  const handleUploadVideo = useCallback(
    async (file: File) => {
      if (!file) return;
      await uploadVideo(file);
    },
    [uploadVideo]
  );

  const handleUploadGif = useCallback(
    async (file: File) => {
      if (!file) return;
      await uploadGif(file);
    },
    [uploadGif]
  );

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="post-form-modal"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(3px)",
      }}>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "background.paper",
            minWidth: "600px",
            maxHeight: "80vh",
            overflow: "hidden",
          },
        }}>
        <DialogContent dividers sx={{ p: 0 }}>
          <div className="flex w-[100%] items-center justify-center dark:bg-[#000000] lg:w-full">
            <FormProvider {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="relative flex w-[60%] flex-col items-center justify-center p-3 lg:h-full lg:w-full">
                {isLoading ? (
                  <Spinner size="lg" />
                ) : (
                  <div className="flex w-full gap-4 px-4 pb-11">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="text-md absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-slate-700 font-semibold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 lg:h-8 lg:w-8">
                      x
                    </button>

                    <div className="shrink-0">
                      <Avatar>
                        <AvatarImage
                          src={currentUser?.profileImage || ""}
                          alt={currentUser?.username || ""}
                          className="object-cover"
                        />
                        <AvatarFallback className="font-bold">
                          {currentUser?.name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="line-clamp-6 flex flex-1 flex-col gap-1 overflow-hidden break-words p-2 text-white lg:w-full">
                      {isComment && (
                        <div className="flex items-center">
                          <p className="text-sm font-normal !text-[#959fa8]">
                            Replying to{" "}
                            <Link className="!text-primary" href={`/${postUsername}`}>
                              @{postUsername}
                            </Link>
                          </p>
                        </div>
                      )}

                      <div className="mb-3 !max-h-80 min-h-6 overflow-auto overflow-x-hidden">
                        <Textarea
                          placeholder={placeholder}
                          className="max-h-80 min-h-[3rem] resize-y text-[18px]"
                          {...form.register("body")}
                        />
                      </div>
                      {/* IMAGENNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN */}
                      <div className="flex items-center">
                        {uploadedUrl && (
                          <div className="relative h-[10em] w-full overflow-hidden rounded-md border lg:h-[20em] lg:w-[20em]">
                            <button
                              type="button"
                              onClick={clearFile}
                              className="absolute right-0 top-0 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-gray-800/80 text-white hover:bg-gray-700/90">
                              ×
                            </button>
                            <Image
                              src={uploadedUrl}
                              width={400}
                              height={400}
                              alt=""
                              className="h-full w-full rounded-md object-cover"
                            />
                            {uploading && (
                              <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-gray-950/10 dark:bg-gray-950/30">
                                <Spinner size="lg" />
                              </div>
                            )}
                          </div>
                        )}

                        {uploadedVideoUrl && (
                          <div className="relative h-[10em] w-auto overflow-hidden rounded-md border lg:h-[20em] lg:w-[20em]">
                            <button
                              type="button"
                              onClick={clearFile}
                              className="absolute right-0 top-0 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-gray-800/80 text-white hover:bg-gray-700/90">
                              ×
                            </button>
                            <video
                              src={uploadedVideoUrl}
                              width={44}
                              height={44}
                              controls
                              className="h-full w-full rounded-md object-cover"
                            />
                            {uploadingVideo && (
                              <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-gray-950/10 dark:bg-gray-950/30">
                                <Spinner size="lg" />
                              </div>
                            )}
                          </div>
                        )}
                        {/* 🎯 Añade visualización de GIF */}
                        {gifUploadedUrls && (
                          <div className="relative h-[10em] w-auto overflow-hidden rounded-md border lg:h-[20em] lg:w-[20em]">
                            <button
                              type="button"
                              onClick={clearGif}
                              className="absolute right-0 top-0 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-gray-800/80 text-white hover:bg-gray-700/90">
                              ×
                            </button>

                            <video
                              src={gifUploadedUrls}
                              muted
                              loop
                              autoPlay
                              playsInline
                              disablePictureInPicture
                              disableRemotePlayback
                              controls={false}
                              className="h-full w-full rounded-lg object-cover transition-opacity group-hover:opacity-90"
                              style={{
                                objectFit: "cover",
                                backgroundColor: "transparent",
                              }}
                              controlsList="nodownload nofullscreen noremoteplayback"
                            />

                            {uploading && (
                              <div className="absolute inset-0 flex items-center justify-center bg-gray-950/10 dark:bg-gray-950/30">
                                <Spinner size="lg" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <hr className="mb-1 h-[0.5px] w-full px-3 opacity-0 transition dark:border-[rgb(34,37,40)]" />
                      <div className="flex w-full items-center justify-between">
                        <div className="flex flex-1 items-center">
                          <UploadMediaButton
                            disabled={uploading || uploadingVideo}
                            onFileSelect={(file) => {
                              if (file.type.startsWith("image/")) {
                                handleUploadFile(file);
                              } else if (file.type.startsWith("video/")) {
                                handleUploadVideo(file);
                              }
                            }}
                          />
                          {/* 🎯 Añade el GifButton aquí */}
                          <GifButton
                            disabled={uploadingGif}
                            onFileSelect={(file) => {
                              if (file.type.startsWith("image/")) {
                                handleUploadGif(file);
                              } else if (file.type.startsWith("video/")) {
                                handleUploadGif(file);
                              }
                            }}
                          />
                        </div>
                        <Button
                          type="submit"
                          variant="brandPrimary"
                          size="brandsm"
                          disabled={
                            loading ||
                            uploading ||
                            uploadingVideo ||
                            uploadingGif ||
                            !form?.getValues()?.body
                          }
                          className="!h-auto cursor-pointer text-base font-semibold !text-white">
                          {loading ? <Spinner size="default" /> : isComment ? "Reply" : "Post"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </FormProvider>
          </div>
        </DialogContent>
      </Dialog>
    </Modal>
  );
};

export default PostFormModal;
