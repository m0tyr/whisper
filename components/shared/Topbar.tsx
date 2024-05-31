"use client"
import Image from "next/image";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion"
import { MouseEventHandler, useContext, useState } from "react";
import { signOut } from "next-auth/react";
import { toast } from "@/components/ui/use-toast"
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useNotificationsCountQuery } from "@/hooks/queries/NotificationQuery";
import { requestNewFeed } from "@/lib/actions/feed.actions";
import { useSessionUser } from "@/hooks/useSessionUser";
import { useWhisperModal } from "@/hooks/useWhisperModal";

const TopBar = () => {

    const [user] = useSessionUser();
    const { launchCreateContext } = useWhisperModal();
    const pathname = usePathname();
    function handleConfirm() {
        location.href = "/settings";
    }
    const SignOutUser = async () => {
        toast({
            title: "Déconnexion...",
            duration: 20000,
        });

        await signOut({
            redirect: true
        });
    };
    const { data: notificationCount } = useNotificationsCountQuery(user?.id as string);

    const refreshFeed = async () => {
        if (window.scrollY > 0) {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
            return;
        }
        await requestNewFeed(user?.id as string, pathname)
         if (pathname !== "/") {
            return;
        }
    }
    /*     const notificationCount = 0
        const data = 0 */
    const username = user ? user.username : '';
    return (
        <>
            <header className="backdrop-blur-3xl topbar top-0 left-0 right-0 w-full h-[74px] grid-cols-[1fr_50vw_1fr] mobile:grid-cols-[1fr_max-content_1fr] grid max-w-[1230px] mx-auto">
                <div className="mobile:block mobile:col-start-1 hidden"></div>

                <motion.div whileTap={{ scale: 0.92 }} onClick={() => { refreshFeed() }} className="flex flex-col w-18 h-18  col-start-2 mx-auto mmy-auto  mobile:ml-4 mobile:col-start-1 mobile:mr-auto ">
                    <div className="flex items-center gap-3 hover:scale-105 transition-all duration-300 cursor-pointer ">
                        <Image src="/logo_resize.png" alt="logo" width={45} height={45} priority />

                    </div>
                </motion.div>


                <div className="md:w-[620px] xs:w-[550px]  max-w-[620px] w-[620px] px-16 h-full mobile:col-start-2 col-start-1 mobile:block hidden">
                    <nav className="h-full grid grid-cols-[repeat(5,20%)] ">
                        <motion.div
                            whileTap={{ scale: 0.9 }}
                            onClick={() => { refreshFeed() }}
                        >
                            <div className="relative">
                                <Link href="/" className="py-5 px-5 my-1 mx-1 flex justify-center">
                                    <div className="h-full justify-center items-center">
                                        {pathname === '/' ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" height="30" viewBox="0 0 24 24" width="30">
                                                <path clipRule="evenodd" d="m20.479 7.57827-5.386-4.45325c-1.8143-1.50003-4.3717-1.50003-6.18597 0l-5.38606 4.45325c-.97038.80232-1.52097 2.01878-1.52097 3.28803v6.9446c0 2.2551 1.73415 4.1891 4 4.1891h2c1.10457 0 2-.8954 2-2v-3.2522c0-1.2675.9521-2.1891 2-2.1891s2 .9216 2 2.1891v3.2522c0 1.1046.8954 2 2 2h2c2.2659 0 4-1.934 4-4.1891v-6.9446c0-1.26924-.5506-2.48571-1.521-3.28803z"
                                                    fill="#fff" fillRule="nonzero" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 0 24 24" width="30" className=" opacity-20">
                                                <path clipRule="evenodd" d="m20.479 7.57827-5.386-4.45325c-1.8143-1.50003-4.3717-1.50003-6.18597 0l-5.38606 4.45325c-.97038.80232-1.52097 2.01878-1.52097 3.28803v6.9446c0 2.2551 1.73415 4.1891 4 4.1891h2c1.10457 0 2-.8954 2-2v-3.2522c0-1.2675.9521-2.1891 2-2.1891s2 .9216 2 2.1891v3.2522c0 1.1046.8954 2 2 2h2c2.2659 0 4-1.934 4-4.1891v-6.9446c0-1.26924-.5506-2.48571-1.521-3.28803z"
                                                    stroke="#fff" strokeWidth="2" fill="none" fillRule="nonzero" />
                                            </svg>
                                        )}

                                    </div>
                                    <div className="z-0 absolute top-0 w-[95%] h-full hover:bg-[rgba(243,245,247,.06)] opacity-60 duration-150 rounded-lg"></div>
                                </Link>
                            </div>
                        </motion.div>
                        <motion.div
                            whileTap={{ scale: 0.9 }}

                        >
                            <div className="relative">
                                <Link href="/search" className="py-5 px-5 my-1 mx-1 flex justify-center">
                                    <div className="h-full justify-center items-center">

                                        {pathname === '/search' ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" height="30" viewBox="0 0 24 24" width="30">
                                                <g clipRule="evenodd" fill="#fff" fillRule="evenodd">
                                                    <path d="m11 4c-3.86599 0-7 3.13401-7 7 0 3.866 3.13401 7 7 7 3.866 0 7-3.134 7-7 0-3.86599-3.134-7-7-7zm-9 7c0-4.97056 4.02944-9 9-9 4.9706 0 9 4.02944 9 9 0 4.9706-4.0294 9-9 9-4.97056 0-9-4.0294-9-9z" /><path d="m16.2929 16.2929c.3905-.3905 1.0237-.3905 1.4142 0l4 4c.3905.3905.3905 1.0237 0 1.4142s-1.0237.3905-1.4142 0l-4-4c-.3905-.3905-.3905-1.0237 0-1.4142z" />
                                                </g>
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" height="30" viewBox="0 0 24 24" width="30" className=" opacity-20">
                                                <g clipRule="evenodd" fill="#fff" fillRule="evenodd">
                                                    <path d="m11 4c-3.86599 0-7 3.13401-7 7 0 3.866 3.13401 7 7 7 3.866 0 7-3.134 7-7 0-3.86599-3.134-7-7-7zm-9 7c0-4.97056 4.02944-9 9-9 4.9706 0 9 4.02944 9 9 0 4.9706-4.0294 9-9 9-4.97056 0-9-4.0294-9-9z" /><path d="m16.2929 16.2929c.3905-.3905 1.0237-.3905 1.4142 0l4 4c.3905.3905.3905 1.0237 0 1.4142s-1.0237.3905-1.4142 0l-4-4c-.3905-.3905-.3905-1.0237 0-1.4142z" />
                                                </g>
                                            </svg>
                                        )}

                                    </div>
                                    <div className="z-0 absolute top-0 w-[95%] h-full hover:bg-[rgba(243,245,247,.06)] opacity-60 duration-150 rounded-lg"></div>
                                </Link>
                            </div>
                        </motion.div>
                        <motion.div
                            whileTap={{ scale: 0.9 }}

                        >
                            <div className="relative">
                                <div onClick={() => { launchCreateContext() }} className=" cursor-pointer py-5 px-5 my-1 mx-1 flex justify-center">
                                    <div className="h-full justify-center items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" height="30" viewBox="0 0 24 24" width="30" className="opacity-20">
                                            <g clipRule="evenodd" fill="#fff" fillRule="evenodd">
                                                <path stroke="currentColor" strokeLinecap="round" strokeWidth="0.2" d="m12 4c-4.41828 0-8 3.58172-8 8 0 4.4183 3.58172 8 8 8 4.4183 0 8-3.5817 8-8v-.5c0-.5523.4477-1 1-1s1 .4477 1 1v.5c0 5.5228-4.4772 10-10 10-5.52285 0-10-4.4772-10-10 0-5.52285 4.47715-10 10-10h.5c.5523 0 1 .44772 1 1s-.4477 1-1 1z" />
                                                <path d="M21.75 4.25L12.75 10.25" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />                                           </g>
                                        </svg>
                                    </div>
                                    <div className="z-0 absolute top-0 w-[95%] h-full  hover:bg-[rgba(243,245,247,.06)] opacity-60 duration-150 rounded-lg"></div>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            whileTap={{ scale: 0.9 }}

                        >
                            <div className="relative">
                                <Link href="/activity" className="py-5 px-5 my-1 mx-1 flex justify-center">
                                    <div className="h-full justify-center items-center">
                                        {notificationCount && notificationCount !== 0 ? (
                                            <div className=" justify-center items-center w-full h-full flex">
                                                <svg xmlns="http://www.w3.org/2000/svg" className=" absolute top-1.5 fill-[#FF0034] stroke-[#FF0034] drop-shadow-2xl" width={6} height={6} viewBox="0 0 122.88 122.88">
                                                    <g>
                                                        <path d="M61.44,0c33.93,0,61.44,27.51,61.44,61.44s-27.51,61.44-61.44,61.44S0,95.37,0,61.44S27.51,0,61.44,0L61.44,0z" />
                                                    </g>
                                                </svg>
                                                <svg xmlns="http://www.w3.org/2000/svg" className=" absolute top-1.5 fill-[#FF0034] animate-ping stroke-[#FF0034] drop-shadow-2xl" width={6} height={6} viewBox="0 0 122.88 122.88">
                                                    <g>
                                                        <path d="M61.44,0c33.93,0,61.44,27.51,61.44,61.44s-27.51,61.44-61.44,61.44S0,95.37,0,61.44S27.51,0,61.44,0L61.44,0z" />
                                                    </g>
                                                </svg>
                                            </div>
                                        ) : (
                                            null
                                        )
                                        }
                                        {pathname === '/activity' ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" height="30" viewBox="0 0 24 24" width="30">
                                                <path clipRule="evenodd" d="m8.55284 3.00012c-.61686 0-1.31443.06502-1.98075.29212-4.01715 1.31163-5.30868 5.60176-4.17332 9.13776l.00477.0148.00523.0147c.62558 1.7579 1.63349 3.3532 2.94459 4.6654l.00755.0075.00771.0074c1.8692 1.7925 3.90392 3.3555 6.10698 4.7117l.5178.3188.5213-.313c2.2079-1.3258 4.2817-2.9319 6.1285-4.7099l.0058-.0055.0057-.0057c1.3224-1.3147 2.3304-2.9218 2.9468-4.6813l.0051-.0147.0047-.0149c1.1138-3.52827-.1712-7.82354-4.1606-9.11582-.6531-.21727-1.3271-.30936-1.9859-.30936-1.482-.00001-2.579.62052-3.4644 1.25297-.8785-.62764-1.9828-1.25297-3.44756-1.25297z" fill="#fff" fillRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" height="30" viewBox="0 0 24 24" width="30" className=" opacity-20">
                                                <path clipRule="evenodd" d="m6.57221 3.29224c.66632-.2271 1.36389-.29212 1.98075-.29212 1.46474 0 2.56904.62533 3.44754 1.25297.8854-.63245 1.9824-1.25298 3.4644-1.25297.6588 0 1.3328.09209 1.9859.30936 3.9894 1.29228 5.2745 5.58755 4.1606 9.11582l-.0047.0149-.0051.0147c-.6164 1.7595-1.6244 3.3666-2.9468 4.6813l-.0057.0057-.0058.0055c-1.8468 1.778-3.9206 3.3841-6.1285 4.7099l-.5213.313-.5177-.3188c-2.20314-1.3562-4.23786-2.9192-6.10706-4.7117l-.00771-.0074-.00755-.0075c-1.3111-1.3122-2.31901-2.9075-2.94459-4.6654l-.00523-.0147-.00477-.0148c-1.13535-3.536.15617-7.82613 4.17332-9.13776zm1.98075 1.70788c-.49333 0-.95388.05435-1.3398.18664l-.00743.00255-.00747.00243c-2.68815.87458-3.78921 3.81991-2.89982 6.61216.5256 1.47 1.36884 2.8032 2.46242 3.8999 1.61451 1.5473 3.36114 2.9146 5.24474 4.1192 1.8775-1.1793 3.6495-2.5757 5.2447-4.1107 1.0993-1.0946 1.9413-2.4345 2.4585-3.9037.8771-2.80077-.2312-5.74217-2.8775-6.59747l-.0089-.00289v-.00004c-.4237-.14133-.8821-.20808-1.3575-.20808-1.0908-.00001-1.8449.52498-2.86 1.29612l-.6059.46033-.6052-.46128c-.9989-.76136-1.76951-1.29517-2.84084-1.29517z" fill="#fff" fillRule="evenodd" />
                                            </svg>
                                        )}




                                    </div>
                                    <div className="z-0 absolute top-0 w-[95%] h-full hover:bg-[rgba(243,245,247,.06)] opacity-60 duration-150 rounded-lg"></div>
                                </Link>
                            </div>
                        </motion.div>
                        <motion.div
                            whileTap={{ scale: 0.9 }}

                        >
                            <div className="relative">
                                <Link href={`/${username}`} className="py-5 px-5 my-1 mx-1 flex justify-center">
                                    <div className="h-full justify-center items-center">

                                    {pathname === `/${user?.username}` ? (
                                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" height="30" viewBox="0 0 24 24" width="30">
                                            <g clipRule="evenodd" fill="#fff" fillRule="evenodd"><path d="m12 2c-2.76142 0-5 2.23858-5 5s2.23858 5 5 5c2.7614 0 5-2.23858 5-5s-2.2386-5-5-5z"/><path d="m12 13c-3.96317 0-6.51231 1.4462-7.86162 3.655-.83744 1.3709-.51691 2.7976.33926 3.7924.82131.9544 2.14463 1.5526 3.52235 1.5526h8.00001c1.3777 0 2.701-.5982 3.5224-1.5526.8561-.9948 1.1767-2.4215.3392-3.7924-1.3493-2.2088-3.8984-3.655-7.8616-3.655z"/>
                                           </g></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" height="30" viewBox="0 0 24 24" width="30" className=" opacity-20">
                                            <g clipRule="evenodd" fill="#fff" fillRule="evenodd">
                                                <path d="m12 4c-1.6569 0-3 1.34315-3 3s1.3431 3 3 3 3-1.34315 3-3-1.3431-3-3-3zm-5 3c0-2.76142 2.23858-5 5-5 2.7614 0 5 2.23858 5 5s-2.2386 5-5 5c-2.76142 0-5-2.23858-5-5z" /><path d="m12 15c-3.44246 0-5.25209 1.2198-6.15487 2.6976-.31418.5144-.23516.9995.14841 1.4452.41842.4862 1.17504.8572 2.00645.8572h8.00001c.8314 0 1.588-.371 2.0064-.8572.3836-.4457.4626-.9308.1485-1.4452-.9028-1.4778-2.7125-2.6976-6.1549-2.6976zm-7.86162 1.655c1.34931-2.2088 3.89845-3.655 7.86162-3.655 3.9632 0 6.5123 1.4462 7.8616 3.655.8375 1.3709.5169 2.7976-.3392 3.7924-.8214.9544-2.1447 1.5526-3.5224 1.5526h-8.00001c-1.37772 0-2.70104-.5982-3.52235-1.5526-.85617-.9948-1.1767-2.4215-.33926-3.7924z" />
                                            </g></svg>
                                        )}
                                        
                                    </div>
                                    <div className="z-0 absolute top-0 w-[95%] h-full hover:bg-[rgba(243,245,247,.06)] opacity-60 duration-150 rounded-lg"></div>
                                </Link>
                            </div>
                        </motion.div>
                    </nav>
                </div>

                <div className="flex flex-col w-18 h-18 mr-4 col-start-3 ml-auto">
                    <DropdownMenu modal={false} >
                        <DropdownMenuTrigger className=" cursor-pointer  outline-none ">

                            <motion.div whileTap={{ scale: 0.97 }} transition={{ duration: .001 }} className=" outline-none" >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" height="30" viewBox="0 0 24 24" width="30" className=" hover:opacity-100  duration-150 opacity-20">
                                <g clip-rule="evenodd" fill="#f9f9f3" fill-rule="evenodd">
                                    <path fill="#f9f9f3" d="m2 12c0-5.52285 4.47715-10 10-10 5.5228 0 10 4.47715 10 10 0 5.5228-4.4772 10-10 10-5.52285 0-10-4.4772-10-10zm10-8c-4.41828 0-8 3.58172-8 8 0 4.4183 3.58172 8 8 8 4.4183 0 8-3.5817 8-8 0-4.41828-3.5817-8-8-8z"/><path d="m10.7 8.00001c0 .71797.582 1.3 1.3 1.3.7179 0 1.3-.58203 1.3-1.3s-.5821-1.3-1.3-1.3c-.718 0-1.3.58203-1.3 1.3z"/><path d="m10.7 16c0 .718.582 1.3 1.3 1.3.7179 0 1.3-.582 1.3-1.3s-.5821-1.3-1.3-1.3c-.718 0-1.3.582-1.3 1.3z"/><path d="m10.7 12c0 .718.582 1.3 1.3 1.3.7179 0 1.3-.582 1.3-1.3s-.5821-1.3-1.3-1.3c-.718 0-1.3.582-1.3 1.3z"/>
                            </g></svg>


                            </motion.div>
                        </DropdownMenuTrigger>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1, delay: .1 }}
                        >
                            <DropdownMenuContent sideOffset={-10}  className="w-[180px] drop-shadow-xl rounded-2xl bg-[#181818] border-x-[0.2333333px] border-b-[0.2333333px]  border-x-border border-y-border  text-small-semibold !text-[15px]">
                                <DropdownMenuGroup className="text-white text-[14px] m-1">
                                    <DropdownMenuItem >
                                        Apparence
                                    </DropdownMenuItem>

                                    <DropdownMenuItem onClick={handleConfirm}>
                                        Paramètres
                                    </DropdownMenuItem>

                                    <DropdownMenuItem >
                                        Vos J'aime
                                    </DropdownMenuItem>

                                    <DropdownMenuItem onClick={SignOutUser} className="!text-[rgb(255,48,64)]">
                                        Déconnexion
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </motion.div>
                    </DropdownMenu>

                </div>
            </header>
            <nav className="z-[1] w-full backdrop-blur-3xl bg-[rgba(16,16,16,.90)]  fixed bottom-0 my-auto  mobile:hidden grid grid-cols-[repeat(5,20%)] ">
                <motion.div
                    whileTap={{ scale: 0.9 }}
                    onClick={() => { refreshFeed() }}
                >
                    <div className="relative">
                        <Link href="/" className="py-5 px-5 my-1 mx-1 flex justify-center">
                            <div className="h-full justify-center items-center">


                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width={26} height={26} className=" opacity-20">
                                    <path fill="#706f6f" d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" />
                                </svg>

                            </div>
                            <div className="z-0 absolute top-0 w-[95%] h-full hover:bg-[rgba(243,245,247,.06)] opacity-60 duration-150 rounded-lg"></div>
                        </Link>
                    </div>
                </motion.div>
                <motion.div
                    whileTap={{ scale: 0.9 }}

                >
                    <div className="relative">
                        <Link href="/search" className="py-5 px-5 my-1 mx-1 flex justify-center">
                            <div className="h-full justify-center items-center">


                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="26px" height="26px" className=" opacity-20">
                                    <path fill="#706f6f" d="M 20.5 6 C 12.515556 6 6 12.515562 6 20.5 C 6 28.484438 12.515556 35 20.5 35 C 23.773158 35 26.788919 33.893018 29.220703 32.050781 L 38.585938 41.414062 A 2.0002 2.0002 0 1 0 41.414062 38.585938 L 32.050781 29.220703 C 33.893017 26.788918 35 23.773156 35 20.5 C 35 12.515562 28.484444 6 20.5 6 z M 20.5 10 C 26.322685 10 31 14.677319 31 20.5 C 31 23.295711 29.914065 25.820601 28.148438 27.697266 A 2.0002 2.0002 0 0 0 27.701172 28.144531 C 25.824103 29.912403 23.29771 31 20.5 31 C 14.677315 31 10 26.322681 10 20.5 C 10 14.677319 14.677315 10 20.5 10 z" />
                                </svg>

                            </div>
                            <div className="z-0 absolute top-0 w-[95%] h-full hover:bg-[rgba(243,245,247,.06)] opacity-60 duration-150 rounded-lg"></div>
                        </Link>
                    </div>
                </motion.div>
                <motion.div
                    whileTap={{ scale: 0.9 }}

                >
                    <div className="relative">
                        <div onClick={() => { launchCreateContext() }} className=" cursor-pointer py-5 px-5 my-1 mx-1 flex justify-center">
                            <div className="h-full justify-center items-center">


                                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#706f6f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className=" opacity-20">
                                    <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 8l-5-5-5 5M12 4.2v10.3" />
                                </svg>

                            </div>
                            <div className="z-0 absolute top-0 w-[95%] h-full  hover:bg-[rgba(243,245,247,.06)] opacity-60 duration-150 rounded-lg"></div>
                        </div>
                    </div>
                </motion.div>
                <motion.div
                    whileTap={{ scale: 0.9 }}

                >
                    <div className="relative">
                        <Link href="/activity" className="py-5 px-5 my-1 mx-1 flex justify-center">
                            <div className="h-full justify-center items-center">
                                {notificationCount && notificationCount !== 0 ? (
                                    <div className=" justify-center items-center w-full h-full flex">
                                        <svg xmlns="http://www.w3.org/2000/svg" className=" absolute top-3 fill-red-800 stroke-red-800 drop-shadow-2xl" width={6} height={6} viewBox="0 0 122.88 122.88">
                                            <g>
                                                <path d="M61.44,0c33.93,0,61.44,27.51,61.44,61.44s-27.51,61.44-61.44,61.44S0,95.37,0,61.44S27.51,0,61.44,0L61.44,0z" />
                                            </g>
                                        </svg>
                                    </div>
                                ) : (
                                    null
                                )
                                }

                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="opacity-20">
                                    <path d="M12 9.229c.234-1.12 1.547-6.229 5.382-6.229 2.22 0 4.618 1.551 4.618 5.003 0 3.907-3.627 8.47-10 12.629-6.373-4.159-10-8.722-10-12.629 0-3.484 2.369-5.005 4.577-5.005 3.923 0 5.145 5.126 5.423 6.231zm-12-1.226c0 4.068 3.06 9.481 12 14.997 8.94-5.516 12-10.929 12-14.997 0-7.962-9.648-9.028-12-3.737-2.338-5.262-12-4.27-12 3.737z" fill="white" />
                                </svg>
                            </div>
                            <div className="z-0 absolute top-0 w-[95%] h-full hover:bg-[rgba(243,245,247,.06)] opacity-60 duration-150 rounded-lg"></div>
                        </Link>
                    </div>
                </motion.div>
                <motion.div
                    whileTap={{ scale: 0.9 }}

                >
                    <div className="relative">
                        <Link href={`/${username}`} className="py-5 px-5 my-1 mx-1 flex justify-center">
                            <div className="h-full justify-center items-center">


                                <svg aria-label="Profil" role="img" viewBox="0 0 26 26" width={26} height={26} className="opacity-20">
                                    <title>Profil</title>
                                    <circle cx="13" cy="7.25" r="4" stroke="currentColor" strokeWidth="2.5">
                                    </circle>
                                    <path d="M6.26678 23.75H19.744C21.603 23.75 22.5 23.2186 22.5 22.0673C22.5 19.3712 18.8038 15.75 13 15.75C7.19625 15.75 3.5 19.3712 3.5 22.0673C3.5 23.2186 4.39704 23.75 6.26678 23.75Z" stroke="currentColor" strokeWidth="2.5"></path>
                                </svg>
                            </div>
                            <div className="z-0 absolute top-0 w-[95%] h-full hover:bg-[rgba(243,245,247,.06)] opacity-60 duration-150 rounded-lg"></div>
                        </Link>
                    </div>
                </motion.div>
            </nav>
        </>




    )
}
export default TopBar;

