"use client"
import * as z from "zod";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from 'framer-motion';
import {
  Form,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { WhisperValidation } from "@/lib/validations/whisper";
import { createWhisper } from "@/lib/actions/whisper.actions";
import { computeSHA256, extractElements, extractMention } from "@/lib/utils";
import { AnimatePresence } from 'framer-motion'
import { useToast } from "../ui/use-toast";
import { DBImageData, ExtractedElement, MentionsDatas } from "@/lib/types/whisper.types";
import { s3GenerateSignedURL } from "@/lib/s3/actions";
import { MAX_FILE_NUMBER, MAX_FILE_SIZE } from "@/lib/errors/post.errors";
import { useCreatePost } from "@/hooks/useCreatePost";
import PostComposer from "../shared/widgets/composer_post_card";
import PostComposerDialog from "../shared/widgets/composer_post_dialog";
import { useSessionUser } from "@/hooks/useSessionUser";
import { useContext } from "react";
import { ModalContextApi } from "@/contexts/create_post.provider";
import { useWhisperModal } from "@/hooks/useWhisperModal";





const CreateWhisper = () => {
  const { toast } = useToast()
  const [user] = useSessionUser()
  const { ModifyDismissState, exitMainContext } = useWhisperModal();
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
  
  const form = useForm<z.infer<typeof WhisperValidation>>({
    resolver: zodResolver(WhisperValidation),
    defaultValues: {
      content: [] as ExtractedElement[],
      media: [] as DBImageData[],
      mentions: [] as MentionsDatas[],
      accoundId: user?.id as string,
    },
  });

  async function onSubmit(values: z.infer<typeof WhisperValidation>) {
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
    const editorStateTextString: string = editorRef.current.getRootElement()?.textContent;
    const mentions = extractMention(datas);
    const extractedstuff = extractElements(datas)
    values.mentions = mentions;
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

    await createWhisper({
      content: values.content,
      author: values.accoundId,
      media: values.media,
      mentions: values.mentions,
      caption: editorStateTextString,
      path: pathname,
    });

    /*     const lastWhisper = await GetLastestWhisperfromUserId({
      author: values.accoundId,
    }) */ // MAX CALL SIZE ERROR NEED TO FIX

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
            <div className="relative ">
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
                    <span className=" text-white font-bold text-[16px] ">Nouveau Whisper</span>
                  </div>

                  <div className="shadow-[0_12px_24px_0_rgba(0,0,0,0.08)] w-[620px]  space-y-[-1px] box-border relative">
                    <FormField
                      control={form.control}
                      name="content"

                      render={({ field }: { field: FieldValues }) => (
                        <FormItem className=" space-y-0" >
                          <PostComposer
                            user={{ username: user?.username as string, image: user?.image as string}}
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
              <div>
                <div id="parent" className=" fixed top-0  z-[51]"></div>
              </div>
            </div>
      </Form>
    </>
  )

}


export default CreateWhisper;