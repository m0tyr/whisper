'use client'
import { Login } from "@/lib/actions/user.actions";
import { isValidEmail } from "@/lib/utils";
import { useState } from "react";
import { toast } from "../ui/use-toast";
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { motion } from "framer-motion";

export default function LoginForm() {
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isFormValid, setIsFormValid] = useState(false);
    const callbackUrl = searchParams.get('from') || '/';

    const handleform = (email: string, password: string) => {
        setPassword(password)
        setEmail(email)
        setIsFormValid(email.trim() !== "" && password.trim() !== "");

    }
    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            if (isValidEmail(email) && isFormValid) {
                const signInResult = await signIn('credentials', {
                    email: email.toLowerCase(),
                    password: password,
                    redirect: true,
                    callbackUrl,
                })
                console.log(signInResult)
            } else if (!isValidEmail(email) && isFormValid) {
                toast({
                    title: "Entrez un email valide",
                    duration: 2000,
                }
                )
                return;
            }
            else {
                toast({
                    title: "Entrez des informations valide",
                    duration: 2000,
                }
                )
                return;
            }
        } catch (error: any) {
            console.log(error);
        }
    }
    return (
        <div className="flex flex-col justify-center items-center h-screen pb-10">
            <div className="justify-center items-center w-full max-w-[370px] px-6 py-2">

                <form onSubmit={onSubmit}>
                    <div className="flex flex-col justify-center items-center">
                        <div className="mb-6">
                            <span>
                                Connectez-vous à <p className=" drop-shadow-xl bg-gradient-to-r from-[#314BFF] via-[#929FFF] to-[#9faaf1]  bg-clip-text text-transparent  inline-block font-semibold">Whisper</p>
                            </span>
                        </div>
                        <div className="bg-[rgb(30,30,30)] rounded-xl w-full mb-2">
                            <input onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleform(e.target.value, password)} autoComplete="off" style={{ outline: 'none' }} className="bg-[rgb(30,30,30)] focus:bg-[rgb(42,42,42)] placeholder:text-[14px] placeholder:font-light w-full px-4 py-4 rounded-xl opacity-70 focus:border-none border-none focus:ring-0 duration-100" type="text" placeholder="Adresse e-mail" />
                        </div>
                        <div className="bg-[rgb(30,30,30)] rounded-xl w-full mb-2">
                            <input onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleform(email, e.target.value)} autoComplete="off" style={{ outline: 'none' }} className="bg-[rgb(30,30,30)] focus:bg-[rgb(42,42,42)] focus:border focus:border-border placeholder:text-[14px] placeholder:font-light w-full px-4 py-4 rounded-xl opacity-70 focus:border-none border-none focus:ring-0 duration-100" type="password" placeholder="Mot de passe" />
                        </div>

                        <div className="mb-2 w-full h-full">
                            <div className="w-full h-full">
                                <div className="flex w-full">
                                    <button id="button" type="submit" className={`w-full px-4 py-4 rounded-xl ${isFormValid ? 'bg-white hover:bg-slate-100' : 'bg-border hover:bg-border cursor-not-allowed'} transition-all duration-150 !text-small-semibold text-black`} disabled={!isFormValid} style={{ cursor: !isFormValid ? 'not-allowed' : 'pointer' }}>
                                        Se connecter
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className=" my-6 py-2 w-full flex relative">
                            <div className="bg-insanedark absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] px-4">
                                <span className="text-[14px] text-[#747474] overflow-x-visible overflow-y-visible relative">ou</span>
                            </div>
                            <hr className=" my-0 mx-0 h-[.5px] border-0 rounded-full w-full bg-[rgba(243,245,247,0.15)] " />
                        </div>
                        <motion.div whileTap={{ scale: 0.98 }} onClick={() => {
                            signIn("google", { callbackUrl: 'http://localhost:3000/'});

                        }} className="select-none cursor-pointer flex flex-row py-6 px-6 relative basis-auto box-border items-center border-border border rounded-2xl w-full h-[70px]">
                            <img src="google_logo.png" className=" object-fill " alt="" width={50} height={50} />
                            <div className="flex justify-center flex-grow">
                                <span className=" min-w-0 max-w-full block overflow-x-visible overflow-y-visible text-left relative break-words whitespace-pre-line text-[15px]">Continuer avec Google</span>
                            </div>
                        </motion.div>
                    </div>

                </form>

                <div className=" w-full flex justify-center items-center">
                    <div className="absolute bottom-5">
                        <p className=" text-[#7c7c7c] text-body-bold inline-block  !text-[12px] !font-normal justify-center items-center">
                            Copyright © 2024 Whisper Inc. Tous droits réservés.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}