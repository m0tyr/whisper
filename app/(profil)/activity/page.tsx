import NavActivity from "@/components/shared/NavActivity";
import TopBar from "@/components/shared/Topbar";
import { fetchUser, getActivityFromUser } from "@/lib/actions/user.actions";
import { calculateTimeAgo } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
export function generateMetadata() {

    return {
        title: `Activité • Whisper`,
    };
}

export default async function Page() {
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
    const datas = await getActivityFromUser(userData.username,'all');

    return (
        <>
            <TopBar user={userData} _id={`${currentuserInfo._id}`} />
            <section className="mobile:activity-container flex min-h-screen min-w-full flex-1 flex-col items-center bg-insanedark pt-16 pb-[4.55rem] px-0">
                <div className="max-w-full overflow-x-auto " aria-hidden="true">
                   <NavActivity currenttype="all"/>
                </div>
                {datas ? (
                    datas.map(whisper => (
                        <div key={whisper._id}>
                            <div>
                               <span>{whisper.username}</span> 
                               <span>{calculateTimeAgo(whisper.createdAt.toString())}</span>
                            </div>
                            <p>{whisper.caption}</p>
                        </div>
                    ))
                ) : (
                    <div className=" justify-center items-center flex flex-grow">
                        <p className="text-[13.5px] opacity-55 font-light">Aucune Activité</p>
                    </div>
                )}
            </section>
        </>

    )
}
