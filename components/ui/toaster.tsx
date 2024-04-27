"use client"

import {
  Toast,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { FILE_TYPE_NOT_ALLOWED, MAX_FILE_SIZE } from "@/lib/errors/post.errors";
import { useState } from "react";

export function Toaster() {
  const { toasts } = useToast()
  return (

    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="flex flex-row  justify-center items-center ">
              {title === 'Publié' ? (
                <div className="flex flex-row gap-4 w-full h-full justify-center items-center">
                  <ToastTitle className="flex gap-3 items-center justify-center">

                    <div className="mt-0.5">
                      {title}
                    </div>
                  </ToastTitle>
                </div>
              ) : title === 'Publication...' ? (
                <div className="flex flex-row gap-4 w-full h-full justify-center items-center">
                    <svg aria-label="Chargement…" className="animate-spin text-black opacity-85" role="img" viewBox="0 0 100 100" width={28} height={28}>
                      <rect fill="black" height="10" opacity="0" rx="5" ry="5" transform="rotate(-90 50 50)" width="28" x="67" y="45"></rect>
                      <rect fill="black" height="10" opacity="0.125" rx="5" ry="5" transform="rotate(-45 50 50)" width="28" x="67" y="45"></rect>
                      <rect fill="black" height="10" opacity="0.25" rx="5" ry="5" transform="rotate(0 50 50)" width="28" x="67" y="45"></rect>
                      <rect fill="black" height="10" opacity="0.375" rx="5" ry="5" transform="rotate(45 50 50)" width="28" x="67" y="45"></rect>
                      <rect fill="black" height="10" opacity="0.5" rx="5" ry="5" transform="rotate(90 50 50)" width="28" x="67" y="45"></rect>
                      <rect fill="black" height="10" opacity="0.625" rx="5" ry="5" transform="rotate(135 50 50)" width="28" x="67" y="45"></rect>
                      <rect fill="black" height="10" opacity="0.75" rx="5" ry="5" transform="rotate(180 50 50)" width="28" x="67" y="45"></rect>
                      <rect fill="black" height="10" opacity="0.875" rx="5" ry="5" transform="rotate(225 50 50)" width="28" x="67" y="45"></rect>
                    </svg>
                  <ToastTitle className="flex gap-3 items-center justify-center">
                  
                    <div className="mt-0.5">
                      {title}
                    </div>
                  </ToastTitle>
                </div>
              ) : title === "Inscription..." ? (
                <div className="flex flex-row gap-4 w-full h-full justify-center items-center">
                   <svg aria-label="Chargement…" className="animate-spin text-black opacity-85" role="img" viewBox="0 0 100 100" width={28} height={28}>
                      <rect fill="black" height="10" opacity="0" rx="5" ry="5" transform="rotate(-90 50 50)" width="28" x="67" y="45"></rect>
                      <rect fill="black" height="10" opacity="0.125" rx="5" ry="5" transform="rotate(-45 50 50)" width="28" x="67" y="45"></rect>
                      <rect fill="black" height="10" opacity="0.25" rx="5" ry="5" transform="rotate(0 50 50)" width="28" x="67" y="45"></rect>
                      <rect fill="black" height="10" opacity="0.375" rx="5" ry="5" transform="rotate(45 50 50)" width="28" x="67" y="45"></rect>
                      <rect fill="black" height="10" opacity="0.5" rx="5" ry="5" transform="rotate(90 50 50)" width="28" x="67" y="45"></rect>
                      <rect fill="black" height="10" opacity="0.625" rx="5" ry="5" transform="rotate(135 50 50)" width="28" x="67" y="45"></rect>
                      <rect fill="black" height="10" opacity="0.75" rx="5" ry="5" transform="rotate(180 50 50)" width="28" x="67" y="45"></rect>
                      <rect fill="black" height="10" opacity="0.875" rx="5" ry="5" transform="rotate(225 50 50)" width="28" x="67" y="45"></rect>
                    </svg>
                <ToastTitle className="flex gap-3 items-center justify-center">
                  <div className="mt-0.5">
                    {title}
                  </div>
                </ToastTitle>
                </div>

              ) : title === FILE_TYPE_NOT_ALLOWED ? (
                <div className="flex flex-row gap-4 w-full h-full justify-center items-center">

                <ToastTitle className="flex gap-3 items-center justify-center bg-red-600">
                  <div className="mt-0.5 ">
                    {title}
                  </div>
                </ToastTitle>
                </div>
              ) : title === MAX_FILE_SIZE ? (
                <ToastTitle className="flex gap-3 items-center justify-center ">
                  <div className="mt-0.5 ">
                    {title}
                  </div>
                </ToastTitle>
              ) : (
                <ToastTitle className="flex gap-3 items-center justify-center">
                  <div className="mt-0.5">
                    {title}
                  </div>
                </ToastTitle>
              )}

              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
