'use client'
import { motion } from "framer-motion";
import Link from "next/link";

export default function NavMenu() {
    return (
        <div className="text-center text-gray-2 h-full grid grid-cols-[1fr_1fr_1fr] w-full justify-center items-center text-base-regular ">
            <motion.div className="w-full h-12 border-b border-solid  block">
                <Link href={"/"} className="hover:text-gray text-white  transition-all duration-150 text-[15px] mx-auto my-auto px-0 py-2.5 flex justify-center items-center font-normal">
                    <motion.div whileTap={{ scale: 0.98, opacity: 0.7 }} transition={{ duration: 0.01 }}>
                        Compte
                    </motion.div>
                </Link>
            </motion.div>
            <motion.div className="w-full h-12 border-b border-solid border-b-border  block">
                <Link href={"/"} className="hover:text-gray text-white opacity-35 transition-all duration-150 text-[15px] mx-auto my-auto px-0 py-2.5 flex justify-center items-center font-normal">
                    <motion.div whileTap={{ scale: 0.98, opacity: 0.7 }} transition={{ duration: 0.01 }}>
                        Confidentialité
                    </motion.div>
                </Link>
            </motion.div>
            <motion.div className="w-full h-12 border-b border-solid border-b-border  block">
                <Link href={"/"} className="hover:text-gray text-white opacity-35  transition-all duration-150 text-[15px] mx-auto my-auto px-0 py-2.5 flex justify-center items-center font-normal">
                    <motion.div whileTap={{ scale: 0.98, opacity: 0.7 }} transition={{ duration: 0.01 }}>
                        Plus
                    </motion.div>
                </Link>
            </motion.div>
        </div>
    )
}