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
            <div
            >
                <div id="picture" className="max-h-[430px] mt-2 grid-rows-1 grid-cols-1 grid">
                    <div style={{ aspectRatio: aspectRatio, maxHeight: "430px" }}>
                        <motion.div className="block relative h-full" onClick={togglePopup}>
                            <picture>

                                <img src={src}
                                    className='w-full max-w-full object-cover absolute top-0 bottom-0 left-0 right-0 h-full  rounded-xl border-x-[.15px] border-y-[.15px] border-x-[rgba(243,245,247,.13333)] border-y-[rgba(243,245,247,.13333)]'
                                />
                            </picture>

                        </motion.div>
                    </div>

                </div>
            </div>

            {showImage && (
                <ShowImage src={src} togglePopup={togglePopup} />
            )}
        </>

    );

};


export default ImageClickAnim;



