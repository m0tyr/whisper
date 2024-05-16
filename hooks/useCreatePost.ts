'use client'
import { PrevImageData } from "@/lib/types/whisper.types";
import { getClampedMultipleMediaAspectRatio } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";

export const useCreatePost = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const [dismisstate, setdismisstate] = useState(false)
    const pathname = usePathname();
    const editorRef: any = useRef();
    const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
    const [editableDivHeight, setEditableDivHeight] = useState(viewportHeight);
    const editableDiv = document.getElementById('editableDiv');
    const [imageDataArray, setImageDataArray] = useState<PrevImageData[]>([]);

    var elem = document.getElementById('scroll');
    let isscrolled = false;
    if (elem && !isscrolled)
      elem.scrollTo({
        top: elem.scrollHeight,
        behavior: 'instant'
      });
    isscrolled = true;

    const handleResize = () => {
        const newViewportHeight = window.innerHeight;
        setViewportHeight(newViewportHeight);
        setEditableDivHeight(newViewportHeight);
      };
      window.onresize = handleResize
      const handleInput = () => {
        if (editableDiv) {
    
          const scrollHeight = editableDiv.scrollHeight;
          editableDiv.style.overflowY = 'scroll';
          setEditableDivHeight(viewportHeight);
    
          editableDiv.style.overflowY = 'hidden';
          setEditableDivHeight(viewportHeight);
    
        }
      };
    const addImageData = (file: File, s3url: string | undefined, url: string, aspectRatio: string, width: string, height: string, isVideo: boolean) => {
        setImageDataArray([...imageDataArray, { file, url, aspectRatio, width, height, isVideo, s3url }]);
    };
    const removeImageData = (urlToRemove: string) => {
        console.log("URL to remove:", urlToRemove);
        setImageDataArray(prevImageDataArray => {
            const newArray = prevImageDataArray.filter((imageData: { url: string; }) => imageData.url !== urlToRemove);
            console.log("New array after filtering:", newArray);
            return newArray;
        });
    };
    useEffect(() => {
        const offsetY = window.scrollY;
        document.body.style.top = `-${offsetY}px`;
        document.body.classList.add('stop-scrolling');
        return () => {
            document.body.style.top = '';
            document.body.classList.remove('stop-scrolling');
            window.scrollTo(0, offsetY);
        };
    }, []);
    const WatchText = (node: any) => {
        var getText = document.getElementById("editable_content")?.textContent || "";
        var result = getText;
        if (result?.trim() === "" && imageDataArray.length === 0) {
            setdismisstate(false);
            (document.getElementById('button') as HTMLButtonElement).disabled = true;
        } else {
            setdismisstate(true);
            (document.getElementById('button') as HTMLButtonElement).disabled = false;
        }
    }

    const handleImage = (
        e: ChangeEvent<HTMLInputElement>,
        fieldChange: (value: string) => void,
        addImageData: (file: File, s3url: string | undefined, url: string, aspectRatio: string, witdh: string, height: string, isVideo: boolean) => void
    ) => {
        e.preventDefault();
        const fileread = e.target.files?.[0] as File
        const CACHEDBLOBURL = URL.createObjectURL(fileread)
        const mimeType = fileread.type;
        console.log(mimeType)
        if (mimeType.includes('image')) {
            const img = new window.Image();
            img.src = CACHEDBLOBURL;
            img.onload = () => {
                const width = img.naturalWidth;
                const height = img.naturalHeight;
                const aspectRatio = getClampedMultipleMediaAspectRatio({
                    mediaWidth: width,
                    mediaHeight: height
                });
                addImageData(fileread, undefined, CACHEDBLOBURL, aspectRatio.toString(), width.toString(), height.toString(), false);
            };
        } else if (mimeType.includes('video')) {
            const video = document.createElement('video');
            video.src = CACHEDBLOBURL;
            video.addEventListener('loadedmetadata', () => {
                const width = video.videoWidth;
                const height = video.videoHeight;
                const aspectRatio = getClampedMultipleMediaAspectRatio({
                    mediaWidth: width,
                    mediaHeight: height
                });
                addImageData(fileread, undefined, CACHEDBLOBURL, aspectRatio.toString(), width.toString(), height.toString(), true);
            });
        } else {
            console.error('Unsupported file type');
        }
        setdismisstate(true);
        (document.getElementById('button') as HTMLButtonElement).disabled = false;
    };
    const abortimage = (
        src: string,
    ) => {
        removeImageData(src)
        URL.revokeObjectURL(src)
        const editorStateTextString = editorRef.current.getRootElement()?.textContent;
        if (imageDataArray.length === 0 && editorStateTextString === "") {
            setdismisstate(false);
            (document.getElementById("button") as HTMLButtonElement).disabled = true;
            console.log("in")
        } else {
            setdismisstate(true);
            (document.getElementById('button') as HTMLButtonElement).disabled = false;
        }
    }
    const addImage = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };
    const onInputClick = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        const element = event.target as HTMLInputElement
        element.value = ''
    }
    return {
        inputRef,
        router,
        pathname,
        viewportHeight,
        editableDivHeight,
        addImageData,
        handleInput,
        imageDataArray,
        handleImage,
        abortimage,
        addImage,
        WatchText,
        editorRef,
        dismisstate,
        setdismisstate,
        onInputClick
    };

}
