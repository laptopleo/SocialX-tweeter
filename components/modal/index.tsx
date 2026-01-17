"use client";
import React, { Fragment, useCallback } from "react";
import { Dialog, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { DialogContent } from "../ui/dialog";
import Logo from "../logo";
import { cn } from "@/lib/utils";

interface PropsType {
  isOpen: boolean;
  title: string;
  subTitle?: string;
  showLogo?: boolean;
  isCentered?: boolean;
  body?: React.ReactElement;
  disabled?: boolean;
  children?: React.ReactNode;
  onClose?: () => void;
}

const Modal: React.FC<PropsType> = ({
  children,
  title,
  isCentered = false,
  subTitle,
  showLogo = true,
  isOpen,
  onClose,
  body,
  disabled,
}) => {
  const handleClose = useCallback(() => {
    if (disabled) {
      return;
    }
    onClose?.();
  }, [disabled, onClose]);
  return (
    <Fragment>
      <div>{children}</div>

      <Dialog modal open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-h-[90vh] min-h-[350px] !max-w-[95vw] overflow-y-auto !rounded-2xl pb-10 pt-5 scrollbar-hide md:!max-w-[1000px]">
          <DialogHeader className="dialog_top_header w-full !p-0">
            {showLogo && (
              <div className="flex h-[40px] w-full items-center justify-center">
                <Logo width="40px" height="40px" />
              </div>
            )}
            <div className="px-5 pb-0 pt-2">
              <DialogTitle
                className={cn("!p-0 text-[31px] font-bold leading-9", {
                  "text-center": isCentered,
                })}
              >
                {title}
              </DialogTitle>
              {subTitle && (
                <DialogDescription
                  className={cn("!mt-0 !p-0 text-[14px] text-muted-foreground", {
                    "mx-auto block w-full max-w-sm text-center": isCentered,
                  })}
                >
                  {subTitle}
                </DialogDescription>
              )}
            </div>
          </DialogHeader>
          <div className="flex w-full flex-col items-center justify-start">{body}</div>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default Modal;
