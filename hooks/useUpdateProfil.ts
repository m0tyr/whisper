import { DialogContext } from "@/contexts/DialogContext";
import { ProfileImageData } from "@/lib/types/whisper.types";
import { usePathname } from "next/navigation";
import { useState, useRef, ChangeEvent, useEffect, useContext } from "react";

interface Props {
    user: any;
}

export const useUpdateProfil = ({ user }: Props) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [imageData, setimageData] = useState<ProfileImageData[]>([])
    const [Processing, isProcessing] = useState(false);
    const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
    const [editableDivHeight, setEditableDivHeight] = useState(viewportHeight);
    const [namecachedata, setNamecachedata] = useState(user?.name);
    const [biocachedata, setBiocachedata] = useState(user?.bio);
    const [biostatus, setbiostatus] = useState(false);
    const editableDiv = document.getElementById('editableDiv');
    const pathname = usePathname();
    const { handleComposerEditProfileDialog } = useContext(DialogContext);

    const handleImage = (
        e: ChangeEvent<HTMLInputElement>,
    ) => {
        e.preventDefault();
        const fileread = e.target.files?.[0] as File
        const CACHEDBLOBURL = URL.createObjectURL(fileread)
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (!file.type.includes("image")) return;
            const img = new window.Image();
            img.src = CACHEDBLOBURL;
            setimageData([{ file: file, url: CACHEDBLOBURL }]);
        }
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

    const handleResize = () => {
        const newViewportHeight = window.innerHeight;
        setViewportHeight(newViewportHeight);
        setEditableDivHeight(newViewportHeight);
    };
    window.onresize = handleResize


    const handleInput = () => {
        if (editableDiv) {

            editableDiv.style.overflowY = 'scroll';
            setEditableDivHeight(viewportHeight);

            editableDiv.style.overflowY = 'hidden';
            setEditableDivHeight(viewportHeight);

        }
    };

    const closeDialog = () => {
        handleComposerEditProfileDialog(false)
    };

    const handleDataReacher = (value: string, type: string) => {
        if (type === "nom") {
            setNamecachedata(value);
        }
        if (type === "bio") {
            setbiostatus(true)
            setBiocachedata(value);
        }
    };
    const EnableImage = () => {
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
        imageData,
        pathname,
        handleImage,
        Processing,
        isProcessing,
        editableDivHeight,
        handleInput,
        closeDialog,
        namecachedata,
        biocachedata,
        biostatus,
        handleDataReacher,
        EnableImage,
        onInputClick
    };
}

export default useUpdateProfil;