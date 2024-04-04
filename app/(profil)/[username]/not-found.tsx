'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
export function generateMetadata() {

    return {
        title: `Whisper`,
    };
}
export default function NotFound() {
    return (
        <div className="flex flex-col justify-center items-center h-screen ">
            <h2 className=' font-semibold text-[15px]'>Désolé, cette page n’est pas disponible</h2>
            <span className=' opacity-65 font-light text-[14px] mt-[0.75rem] text-center'>Le lien ou la page pourrait avoir été supprimé, ou peut-être vous <br></br> êtes-vous trompé(e).</span>
            <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: .01 }}>
                <Link
                    href='/'
                    className="min-w-[85px] text-[14.2px] flex justify-center items-center rounded-xl h-[32px]  px-3.5 hover:bg-dark transition-all duration-150 text-white border-[.15px] border-[rgba(243,245,247,.13333)] my-3  font-medium"
                >Retour</Link>
            </motion.div>
        </div>
    )
}