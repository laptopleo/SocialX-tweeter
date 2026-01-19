"use client";
import React, { useCallback } from "react";
import Dropzone from "react-dropzone";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import useUploadcare from "@/hooks/useUploadcare";
import { Spinner } from "@/components/spinner";

interface PropsType {
  value?: string;
  diabled?: boolean;
  name?: string;
  onChange: (image: string) => void;
}

const ProfileImageUpload: React.FC<PropsType> = ({ value, name, onChange }) => {
  const { uploadFile, uploading } = useUploadcare();

  const handleChange = useCallback(
    (image: string) => {
      onChange(image);
    },
    [onChange]
  );
  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles?.length === 0) return;
      const file = acceptedFiles[0];

      if (file) {
        const url = await uploadFile(file);
        console.log("Uploaded URL:", url);
        if (url) handleChange(url as string);
      }
    },
    [handleChange, uploadFile]
  );
  return (
    <div className="profile--uploader">
      <Dropzone
        accept={{
          "image/png": [".png"],
          "image/jpg": [".jpg"],
          "image/jpeg": [".jpeg"],
        }}
        onDrop={(acceptedFiles) => {
          handleDrop(acceptedFiles);
        }}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}>
            <input
              type="file"
              style={{ display: "none" }}
              accept=".png, .jpg, .jpeg"
              {...getInputProps()}
            />

            <div className="relative !h-[141px] !w-[141px] overflow-hidden rounded-full border-2 bg-neutral-400 p-[2px] dark:bg-neutral-800">
              <Avatar className="!h-full !w-full hover:opacity-90">
                <AvatarImage
                  src={value || value || ""}
                  alt={name || ""}
                  className="h-full w-full object-cover"
                />
                <AvatarFallback className="text-[60px] font-bold">{name?.[0]}</AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-gray-950/10 dark:bg-gray-950/30">
                {uploading ? (
                  <Spinner size="icon" />
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={uploading}
                    className="hover:bg-opacity-60 h-10 w-10 rounded-full bg-[#eee]/50 p-2 shadow transition-colors dark:bg-black/50">
                    <Camera size={18} />
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </Dropzone>
    </div>
  );
};

export default ProfileImageUpload;
