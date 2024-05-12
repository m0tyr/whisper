import { ProfileImageData } from "@/lib/types/whisper.types";
import { usePathname } from "next/navigation";
import { useState,useRef, ChangeEvent, useEffect } from "react";

interface Props {
    user: {
        id: string;
        username: string;
        name: string;
        bio: string;
        image: string;
    };
}

export const useUpdateProfil = ({user}: Props) => {
    const [files, setFiles] = useState<File[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const [imageData, setimageData] = useState<ProfileImageData[]>([])

    const [aspectRatio, setAspectRatio] = useState("revert");

    const pathname = usePathname();

    const handleImage = (
        e: ChangeEvent<HTMLInputElement>,
    ) => {
        e.preventDefault();
        const fileread = e.target.files?.[0] as File
        const CACHEDBLOBURL = URL.createObjectURL(fileread)

        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setFiles(Array.from(e.target.files));

            if (!file.type.includes("image")) return;
            const img = new window.Image();
            img.src = CACHEDBLOBURL;
            setimageData([{ file: file, url: CACHEDBLOBURL }]);
            img.onload = () => {
                const width = img.naturalWidth;
                const height = img.naturalHeight;
                const aspectRatio = (width / height).toString();
                setAspectRatio(aspectRatio);
            };

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
    const [Processing, isProcessing] = useState(false);
    const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
    const [editableDivHeight, setEditableDivHeight] = useState(viewportHeight);
    const editableDiv = document.getElementById('editableDiv');

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
    const [openPopup, setopenPopup] = useState(false);
    const [currentModification, setCurrentModification] = useState('');
    const [currentLimit, setcurrentLimit] = useState(0);
    const [cachedData, setcachedData] = useState("");
    const DoopenPopup = (from: string, limit: number, cache: string) => {
        if (cache === "") {
            setopenPopup(!openPopup)
            setCurrentModification(from);

            if (from == "Nom") {
                setcachedData(user?.name);
                setcurrentLimit(limit);
            } else {
                setcachedData(cache)
                setcurrentLimit(limit);

            }
        }
        else {
            setopenPopup(!openPopup)
            setCurrentModification(from);
            setcachedData(cache);
            setcurrentLimit(limit);
        }
    };
    const closepopup = () => {
        setopenPopup(!openPopup)
    };
    const [namecachedata, setNamecachedata] = useState("");
    const [biocachedata, setBiocachedata] = useState(user?.bio);
    const [biostatus, setbiostatus] = useState(false);
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
        openPopup,
        currentModification,
        currentLimit,
        cachedData,
        DoopenPopup,
        closepopup,
        namecachedata,
        biocachedata,
        biostatus,
        handleDataReacher,
        EnableImage,
        onInputClick
    };
}

export default useUpdateProfil;