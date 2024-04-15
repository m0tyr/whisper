"use client"
import { motion } from "framer-motion";
import { useEffect } from "react";

const ShowImage = ({ src, ar, togglePopup, isVideo, width }: any) => {
    useEffect(() => {
        const offsetY = window.scrollY;
        document.body.style.top = `-${offsetY}px`;
        document.body.classList.add('stop-scrolling');
        const navElement = document.querySelector('body > header') as HTMLElement | null;
        const sectionElement = document.querySelector('body > section') as HTMLElement | null;

        if (navElement && sectionElement) {
            sectionElement.style.position = 'fixed';
            sectionElement.style.zIndex = '0';
            navElement.style.zIndex = '0';
        }
        return () => {
            if (navElement && sectionElement) {
                sectionElement.style.position = 'static';
                sectionElement.style.zIndex = '10';
                navElement.style.zIndex = '10';
            }
            document.body.style.top = '';
            document.body.classList.remove('stop-scrolling');
            window.scrollTo(0, offsetY);
        };
    }, []);

    return (
        <>
            <motion.div
                initial={{ opacity: 0.4, zIndex: 9998 }}
                animate={{ opacity: 1, zIndex: 9998 }}
                exit={{ opacity: 0, zIndex: 9998 }}
                transition={{ duration: .1 }}
                id='top'
                role="dialog"
                className="fixed top-0 left-0 inset-0 bg-black w-full z-[9998] px-[92px] cursor-default"
                onClick={togglePopup}
            >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.01 }} className=" cursor-pointer z-[1] fixed top-0 left-0 flex px-6 py-6  bg-transparent" onClick={togglePopup}>
                    <span className="flex bg-[rgb(30,30,30)]  rounded-full justify-center items-center w-11 h-11">
                        <svg aria-label="Fermer" role="img" viewBox="0 0 24 24" className=" fill-white stroke-[rgba(243,245,247,.33333)] rounded-sm stroke-2 relative block" style={{ color: "white" }} fill='currentColor' height='20px' width='20px'>
                            <title>Fermer</title>
                            <line className=" fill-white stroke-2" x1="21" x2="3" y1="3" y2="21"></line>
                            <line className=" fill-white stroke-2" x1="21" x2="3" y1="21" y2="3"></line>
                        </svg>
                    </span>
                </motion.div>
                <div className="flex justify-center items-center w-full  h-full ">
                    <div className=" h-full scale-100 " style={{
                        aspectRatio: ar,
                        width : (parseInt(width) - 100).toString() + "px"

                    }}>


                        {isVideo ? (
                            <video
                                loop
                                autoPlay
                                playsInline
                                src={src} className="h-full object-contain " />

                        ) : (
                            <img draggable='false' src={src} className="w-full h-full object-contain " />
                        )}

                    </div>
                </div>
            </motion.div>

        </>
    );
};
export default ShowImage