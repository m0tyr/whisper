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
import { motion } from "framer-motion";
import BasicLoader from "../shared/loader/basicloader";

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
                  <BasicLoader width={27} height={27} color="black" />
                  <ToastTitle className="flex gap-3 items-center justify-center">

                    <div className="mt-0.5">
                      {title}
                    </div>
                  </ToastTitle>
                </div>
              ) : title === "Inscription..." ? (
                <div className="flex flex-row gap-4 w-full h-full justify-center items-center">
                  <BasicLoader width={27} height={27} color="black" />
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
