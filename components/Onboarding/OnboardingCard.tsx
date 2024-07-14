'use client'
import OnboardingAccountProfile from "./OnboardingAccountProfile";
import { AnimatePresence, delay, motion } from 'framer-motion'

interface Props {
    user: {
        id: string | undefined;
        username: string;
        name: string;
        bio: string;
        image: string;
        email: string;
    };
}

function OnboardingCard({
    user,
}: Props) {
    return (
        <>
            <AnimatePresence>
                <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-10  rounded-2xl ">
                    <motion.h1
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, type: 'spring', stiffness: 50 }}
                        className="head-text font-black drop-shadow-2xl text-white">Vos premiers pas...</motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay:0.05, duration: 0.6, type: 'spring', stiffness: 50 }}
                        className="text-white font-medium drop-shadow-2xl">Parlez-nous de vous !</motion.p>

                    <motion.section
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay:0.15, duration: 0.6, type: 'spring', stiffness: 50 }}
                     className="pb-4 pt-2 my-2 rounded-xl">
                        <OnboardingAccountProfile user={user} />
                    </motion.section>
                </main>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay:0.25, duration: 0.6, type: 'spring', stiffness: 50 }}
             className="h-full w-full flex justify-center items-center relative">
                <div className="absolute bottom-5">
                    <p className="text-[#7c7c7c] inline-block text-[12px] font-normal justify-center items-center">
                        Copyright © 2024 Whisper Inc. Tous droits réservés.
                    </p>
                </div>
            </motion.div>
            </AnimatePresence>

        </>
    )

}

export default OnboardingCard