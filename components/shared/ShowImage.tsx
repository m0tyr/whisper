"use client"
import { motion } from "framer-motion";
import { useEffect } from "react";

const ShowImage = ({ src, togglePopup }: any) => {
    useEffect(() => {
        const offsetY = window.scrollY;
        document.body.style.top = `-${offsetY}px`;
        document.body.classList.add('stop-scrolling');
        const navElement = document.querySelector('body > nav') as HTMLElement | null;
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
                initial={{ opacity: 0.4, zIndex: 9997 }}
                animate={{ opacity: 1, zIndex: 9997 }}
                exit={{ opacity: 0, zIndex: 9997 }}
                transition={{ duration: .1 }}
                id='top'
                role="dialog"
                className="fixed top-0 left-0 inset-0 bg-black w-full z-[9998] " onClick={togglePopup}>
                <button onClick={togglePopup}>
                    <svg aria-label="Fermer" role="img" viewBox="0 0 24 24" fill='currentColor' height='18' width='18px'>
                        <title>Fermer</title>
                        <line x1="21" x2="3" y1="3" y2="21">
                        </line><line x1="21" x2="3" y1="21" y2="3"></line>
                    </svg>
                </button>
                <img src={src} alt="" className="  fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full  z-[9999]" />

            </motion.div>


        </>
    );
};
export default ShowImage