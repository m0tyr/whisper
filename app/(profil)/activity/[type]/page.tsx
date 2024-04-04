import NavActivity from "@/components/shared/NavActivity";
import TopBar from "@/components/shared/Topbar";
import { fetchUser, getActivityFromUser, getMentionActivityFromUser } from "@/lib/actions/user.actions";
import { calculateTimeAgo } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { redirect } from "next/navigation";
export function generateMetadata() {

    return {
        title: `Activité • Whisper`,
    };
}

export default async function Page({ params }: { params: { type: string } }) {
    const user = await currentUser();
    if (!user) redirect('/sign-in');
    const currentuserInfo = await fetchUser(user.id);
    if (!currentuserInfo?.onboarded) redirect('/onboarding');
    const userData = {
        id: user?.id,
        username: currentuserInfo?.username || user.username,
        name: currentuserInfo?.name || user.firstName,
        bio: currentuserInfo?.bio || "",
        image: currentuserInfo?.image || user.imageUrl,
    };
    const datas = await getActivityFromUser(userData.username, params.type || 'activité');
    if (params.type === null) {
        params.type = 'activité';
    }
    return (
        <>
            <TopBar user={userData} _id={`${currentuserInfo._id}`} />
            <section className="mobile:activity-container flex min-h-screen min-w-full flex-1 flex-col items-center bg-insanedark pt-16 pb-[4.55rem] px-0">
                <div className="max-w-full overflow-x-auto " aria-hidden="true">
                    <NavActivity currenttype={params.type} />
                </div>
               
                    {datas ? (
                        datas.map(whisper => (
                            <> 
                            <div className="w-full mobile:max-w-[580px]" >
                                <div className="mt-1">
                                    <div className="grid grid-cols-[48px_minmax(0,1fr)] gap-1.5">
                                        <div className="relative block mx-auto mt-3 w-[34px] h-[34px] justify-center items-center">
                                            <img src={whisper.author.image} alt="" className="rounded-full " />
                                        </div>

                                        <div className="flex py-2 max-w-full">
                                            <div key={whisper._id} className="flex-grow min-w-0">
                                                <div className="flex-grow">
                                                    <span className=" max-w-full text-[15px] font-semibold">{whisper.author.username}</span>
                                                    <span className="max-w-full ml-2 text-[14px] font-normal opacity-65">{calculateTimeAgo(whisper.createdAt.toString())}</span>
                                                </div>
                                                <div className="flex-grow max-w-full">
                                                <span  className="text-[15px]  font-light">{whisper.content}</span>
                                                </div>
                                                <hr className="border-x-2 opacity-20 rounded-full mt-2 " />

                                            </div>
                                        </div>
                                        
                                    </div>
                                   
                                </div>
                                </div>
                            </>
                        ))
                    ) : (
                        <div className=" justify-center items-center m-auto" >
                            <p className="text-[13.5px] opacity-55 font-light">Aucune {params.type || 'activité'}</p>
                        </div>
                    )}
             
            </section>
        </>

    )
}
