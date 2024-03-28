
"use client"
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
const NavActivity = ({ currenttype }: { currenttype: string }) => {
    const router = useRouter();


    return (
        <div className="gap-2 flex flex-row">
            <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: .01 }}>
                <Link
                    href='.'
                    className={`min-w-[100px] text-[14.2px] flex justify-center items-center rounded-xl h-[34px]  px-3.5 hover:bg-dark transition-all duration-150 text-white border-[.15px] border-[rgba(243,245,247,.13333)] my-3  font-medium ${currenttype === "all" ? "bg-white !text-black" : ""}`}
                >Tout</Link>
            </motion.div>
            <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: .01 }}>
                <Link
                    href="/activity/follows"
                    className={`min-w-[100px] text-[14.2px] flex justify-center items-center rounded-xl h-[34px]  px-3.5 hover:bg-dark transition-all duration-150 text-white border-[.15px] border-[rgba(243,245,247,.13333)] my-3  font-medium ${currenttype === "follows" ? "bg-white !text-black" : ""}`}
                >Suivi(e)s</Link>
            </motion.div>
            <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: .01 }}>
                <Link
                    href="/activity/replies"
                    className={`min-w-[100px] text-[14.2px] flex justify-center items-center rounded-xl h-[34px]  px-3.5 hover:bg-dark transition-all duration-150 text-white border-[.15px] border-[rgba(243,245,247,.13333)] my-3  font-medium ${currenttype === "replies" ? "bg-white !text-black" : ""}`}
                >Réponses</Link>
            </motion.div>
            <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: .01 }}>
                <Link
                    href="/activity/mentions"
                    className={`min-w-[100px] text-[14.2px] flex justify-center items-center rounded-xl h-[34px]  px-3.5 hover:bg-dark transition-all duration-150 text-white border-[.15px] border-[rgba(243,245,247,.13333)] my-3  font-medium ${currenttype === "mentions" ? "bg-white !text-black" : ""}`}
                >Mentions</Link>
            </motion.div>
            <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: .01 }}>
                <Link
                    href="/activity/quotes"
                    className={`min-w-[100px] text-[14.2px] flex justify-center items-center rounded-xl h-[34px]  px-3.5 hover:bg-dark transition-all duration-150 text-white border-[.15px] border-[rgba(243,245,247,.13333)] my-3  font-medium ${currenttype === "quotes" ? "bg-white !text-black" : ""}`}
                >Citations</Link>
            </motion.div>
            <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: .01 }}>
                <Link
                    href="/activity/reposts"
                    className={`min-w-[100px] text-[14.2px] flex justify-center items-center rounded-xl h-[34px] px-3.5 hover:bg-dark transition-all duration-150 text-white border-[.15px] border-[rgba(243,245,247,.13333)] my-3  font-medium ${currenttype === "reposts" ? "bg-white !text-black" : ""}`}
                >
                    Republications
                </Link>
            </motion.div>
        </div>
    )
}
export default NavActivity;