"use client";
import React, { useCallback } from "react";
import Dropzone from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";
import Image from "next/image";

interface PropsType {
  value?: string;
  diabled?: boolean;
  onRemove?: () => void;
  onChange: (image: string) => void;
}

const CoverImageUpload: React.FC<PropsType> = ({ value, onChange, onRemove }) => {
  const [base64, setBase64] = React.useState(value);

  // Se asume que onChange es estable, por lo que no es necesario incluirlo en el array de dependencias
  const handleChange = useCallback(
    (image: string) => {
      onChange(image);
    },
    [onChange] // Aquí agregamos onChange como dependencia
  );

  // Nota: en handleRemove no se utiliza onChange, por lo que se elimina del array de dependencias.
  const handleRemove = useCallback(
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      setBase64("");
      onRemove?.();
    },
    [onRemove]
  );

  const handleDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles?.length === 0) return;
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (event: ProgressEvent<FileReader>) => {
      if (event.target?.result) {
        setBase64(event.target.result as string);
        handleChange(event.target.result as string);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="cover--uploader">
      <Dropzone
        accept={{
          "image/png": [".png"],
          "image/jpg": [".jpg"],
          "image/jpeg": [".jpeg"],
        }}
        onDrop={(acceptedFiles) => {
          handleDrop(acceptedFiles);
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}>
            <input
              type="file"
              style={{ display: "none" }}
              accept=".png, .jpg, .jpeg"
              {...getInputProps()}
            />
            <div className="relative h-44 w-full">
              {base64 && (
                <div className="h-full w-full overflow-hidden">
                  <Image
                    src={base64}
                    alt=""
                    fill
                    className="h-full w-full rounded-md object-cover object-center"
                  />
                </div>
              )}
              <div className="absolute inset-0 flex h-full w-full items-center justify-start rounded-md bg-gray-950/10">
                <div className="flex w-full items-center justify-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-background p-2 shadow hover:bg-opacity-60 dark:bg-black/80"
                  >
                    <Camera size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-background p-2 shadow hover:bg-opacity-60 dark:bg-black/80"
                    onClick={handleRemove}
                  >
                    <X size={18} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Dropzone>
    </div>
  );
};

export default CoverImageUpload;
