import { PrevImageData } from '@/lib/types/whisper.types';
import { useState, useEffect, useRef } from 'react';

export const useTextInput = (imageDataArray: PrevImageData[]) => {
    const [dismisstate, setdismisstate] = useState(false);
    const editorRef = useRef<any>();
    const WatchText = () => {
        const getText = document.getElementById("editable_content")?.textContent || "";
        const result = getText.trim();
        if (result === "" && imageDataArray.length === 0) {
            setdismisstate(false);
            (document.getElementById('button') as HTMLButtonElement).disabled = true;
        } else {
            setdismisstate(true);
            (document.getElementById('button') as HTMLButtonElement).disabled = false;
        }
    };
/* 
    useEffect(() => {
        const offsetY = window.scrollY;
        document.body.style.top = `-${offsetY}px`;
        document.body.classList.add('stop-scrolling');
        return () => {
            document.body.style.top = '';
            document.body.classList.remove('stop-scrolling');
            window.scrollTo(0, offsetY);
        };
    }, []); */

    return { dismisstate, setdismisstate, editorRef, WatchText };
};