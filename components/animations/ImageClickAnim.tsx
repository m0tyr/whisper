'use client'
import { motion } from "framer-motion";
import ShowImage from "../shared/ShowImage";
import { useEffect, useState } from "react";
import Image from "next/image";
import * as AspectRatio from '@radix-ui/react-aspect-ratio';
import { getMeta } from "@/lib/utils";

const ImageClickAnim = ({ src, aspectRatio }: any) => {
    const [showImage, setShowImage] = useState(false);

    const togglePopup = () => {
        setShowImage(!showImage);
       
    };
    
    return (
        <>
         <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={togglePopup}
                type="button"
            >
                <div id="picture" className="max-h-[430px] grid-rows-1 grid-cols-1 grid">
                    <picture style={{ aspectRatio: aspectRatio, maxHeight: '430px' }}>
                        <img
                            draggable="false"
                            className='object-contain rounded-xl mt-2.5 border-x-[.15px] border-y-[.15px] border-x-[rgba(243,245,247,.13333)] border-y-[rgba(243,245,247,.13333)]'
                            alt="Description of Image"
                            referrerPolicy="origin-when-cross-origin"
                            src={src}
                            sizes="(max-width: 222px) calc(100vw - 24px), 198px"
                        />
                    </picture>
                    
                </div>
            </motion.button>

            {showImage && (
                <ShowImage src={src} togglePopup={togglePopup} />
            )}
        </>

    );

};


export default ImageClickAnim;



