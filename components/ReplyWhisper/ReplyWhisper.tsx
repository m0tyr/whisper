"use client"
import * as z from "zod";
import Image from "next/image";
import { FieldValues, useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState, LegacyRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from 'framer-motion';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { CommentValidation } from "@/lib/validations/whisper";
import { createComment } from "@/lib/actions/whisper.actions";
import { computeSHA256, extractElements, extractMention, getClampedMultipleMediaAspectRatio } from "@/lib/utils";
import { AnimatePresence } from 'framer-motion'
import { useToast } from "../ui/use-toast";
import { DBImageData, ExtractedElement, MentionsDatas, PrevImageData, Whisper_to_Reply } from "@/lib/types/whisper.types";
import { s3GenerateSignedURL } from "@/lib/s3/actions";
import { MAX_FILE_NUMBER, MAX_FILE_SIZE } from "@/lib/errors/post.errors";
import { useCreatePost } from "@/hooks/useCreatePost";
import { useSessionUser } from "@/hooks/useSessionUser";
import { useWhisperModal } from "@/hooks/useWhisperModal";
import PostComposer from "../PostComposer/PostComposer";
import PostComposerDialog from "../PostComposer/PostComposerDialog";

interface Props {
  whisper_to_reply: Whisper_to_Reply;
}

const ReplyWhisper = ({ whisper_to_reply }: Props) => {
  const { user } = useSessionUser();
  const { ModifyDismissState, exitMainContext } = useWhisperModal();
  const { toast } = useToast()
  const {
    inputRef,
    router,
    pathname,
    editableDivHeight,
    addImageData,
    handleInput,
    imageDataArray,
    handleImage,
    abortimage,
    addImage,
    WatchText,
    editorRef,
    onInputClick
  } = useCreatePost();

  const form = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      content: [] as ExtractedElement[],
      media: [] as DBImageData[],
      mentions: [] as MentionsDatas[],
      accoundId: user?.id as string,
    },
  });
  async function onSubmit(values: z.infer<typeof CommentValidation>) {
    ModifyDismissState(false);
    (document.getElementById('button') as HTMLButtonElement).disabled = true;
    toast({
      title: "Publication...",
      duration: 20000,
    }
    )
    exitMainContext()
    const temp = JSON.stringify(editorRef.current.getEditorState());
    const datas = JSON.parse(temp);
    const editorStateTextString = editorRef.current.getRootElement()?.textContent;
    const extractedData = extractMention(datas);
    const extractedstuff = extractElements(datas)
    values.mentions = extractedData;
    values.content = extractedstuff
    if (imageDataArray.length >= 1) {
      if (imageDataArray.length > 4) {
        toast({
          title: MAX_FILE_NUMBER,
          duration: 3000,
        });
        (document.getElementById('button') as HTMLButtonElement).disabled = false;
        return
      }
      let allFilesAuthorized = true;
      for (const imageData of imageDataArray) {
        if (imageData.file.size > 1048576 * 25) {
          allFilesAuthorized = false;
          break;
        }
      }
      if (allFilesAuthorized) {
        for (const imageData of imageDataArray) {
          const result = await s3GenerateSignedURL({
            userId: user?.id as string,
            fileType: imageData.file.type,
            fileSize: imageData.file.size,
            checksum: await computeSHA256(imageData.file),
          });

          if (result.failure !== undefined) {
            toast({
              title: result.failure,
              duration: 3000,
            });
            (document.getElementById('button') as HTMLButtonElement).disabled = false;
            break;
          }

          if (result.success) {
            const url = result.success.url;
            imageData.s3url = url.split("?")[0];
            await fetch(url, {
              method: "PUT",
              headers: {
                "Content-Type": imageData.file.type,
              },
              body: imageData.file,
            });
          }
        }
      } else {
        toast({
          title: MAX_FILE_SIZE,
          duration: 3000,
        });
        (document.getElementById('button') as HTMLButtonElement).disabled = false;
        return
      }
    }
    const mongo_db_media_object = imageDataArray.map(obj => {
      const { url, file, ...rest } = obj;
      return rest;
    });

    values.media = mongo_db_media_object;

    await createComment({
      content: values.content,
      author: values.accoundId,
      media: values.media,
      mentions: values.mentions,
      caption: editorStateTextString,
      path: pathname,
    }, whisper_to_reply.id);


    toast({
      title: "Publié",
      duration: 2000,

    }
    )

    router.prefetch(pathname);
    router.push(pathname);

  }
  return (
    <>
      <Form {...form} >
        <AnimatePresence>
            <div className="relative">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
              >

                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.98,
                    x: "-50%",
                    y: "-50%"
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: "-50%",
                    y: "-50%",
                    transition: {
                      ease: "easeOut",
                      duration: 0.05,
                      delay: 0.1
                    },
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.95,
                    transition: {
                      ease: "easeIn",
                      duration: 0.05,
                      delay: 0.1
                    },
                  }}
                  className='fixed left-1/2 top-[47.333%] '
                  id="editableDiv"
                  onInput={handleInput}
                >
                  <div className="flex justify-center items-center p-4">
                    <span className=" text-white font-bold text-[16px] ">Répondre</span>
                  </div>
                  <div className="shadow-[0_12px_24px_0_rgba(0,0,0,0.08)] w-[620px]  space-y-[-1px] box-border relative">
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }: { field: FieldValues }) => (
                        <FormItem className="[overflow-anchor:none;] space-y-0" >
                          <PostComposer
                            whisper_to_reply={whisper_to_reply}
                            user={{ username: user?.username as string, image: user?.image as string, id: user?.id as string }}
                            form={form.control}
                            editorRef={editorRef}
                            WatchText={WatchText}
                            imageDataArray={imageDataArray}
                            addImageData={addImageData}
                            abortimage={abortimage}
                            addImage={addImage}
                            onInputClick={onInputClick}
                            inputRef={inputRef}
                            editableDivHeight={editableDivHeight}
                            handleInput={handleInput}
                            handleImage={handleImage}
                          />
                        </FormItem>
                      )}
                    />
                    <PostComposerDialog />
                  </div>

                </motion.div>
              </form>
            </div>
        </AnimatePresence>
      </Form >



    </>
  )


}

export default ReplyWhisper;
