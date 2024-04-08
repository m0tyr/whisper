import ActivityCard from "@/components/cards/ActivityCard";
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
                        <ActivityCard username={whisper.author.username} image={whisper.author.image} _id={whisper._id} caption={whisper.caption} createdAt={whisper.createdAt} />
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
