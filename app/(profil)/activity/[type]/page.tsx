import { auth } from "@/auth";
import ActivityCard from "@/components/cards/ActivityCard";
import NavActivity from "@/components/shared/NavActivity";
import TopBar from "@/components/shared/Topbar";
import { getNotifications } from "@/lib/actions/notifications.actions";
import { fetchUser, fetchUserbyEmail, follow, getActivityFromUser, getMentionActivityFromUser } from "@/lib/actions/user.actions";
import { ActivityType, UserNotification } from "@/lib/types/notification.types";
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
    const session = await auth()
    const email = session?.user.email
    const currentUser = await fetchUserbyEmail(email as string)
    if (!currentUser.onboarded) redirect('/onboarding');
    const userData = {
      id: session?.user?.id,
      username: currentUser?.username,
      name: currentUser?.name || session?.user?.name,
      bio: currentUser?.bio || "",
      image: currentUser?.image || session?.user?.image,
    };
    if (params.type === null) {
        params.type = 'all';
    }
    
    //Ugly
    let datas: UserNotification[] = []
    if(params.type === "replies"){
        datas = await getNotifications(userData.id as string, ActivityType.REPLY);
    } else if (params.type === "follows") {
        datas = await getNotifications(userData.id as string, ActivityType.FOLLOW);
    } else if (params.type === "quotes") {
        datas = await getNotifications(userData.id as string, ActivityType.QUOTE);
    } else if (params.type === "mentions") {
        datas = await getNotifications(userData.id as string, ActivityType.MENTION);
    } else if (params.type === "reposts") {
        datas = await getNotifications(userData.id as string, ActivityType.REPOST);
    }
    
    const addtofollowing = async (myusername: string, username: string) => {
        "use server";
        await follow(myusername, username)
    }
    return (
        <>
            <TopBar user={userData} _id={`${currentUser._id}`} />
            <section className="mobile:activity-container flex min-h-screen min-w-full flex-1 flex-col items-center bg-insanedark pt-16 pb-[4.55rem] px-0">
                <div className="max-w-full overflow-x-auto " aria-hidden="true">
                    <NavActivity currenttype={params.type} />
                </div>

                {datas ? (
                    datas.map(notification => (
                        <ActivityCard username={notification?.user_notification_sender?.user.username} image={notification?.user_notification_sender?.user.image} notification_link={`${notification.notification_link}`} caption={notification.caption} createdAt={notification.time.toString()} type={notification.activity_type} my_username={userData.username} isFollowing={notification?.user_notification_sender?.isFollowing} follow={addtofollowing}  />
                    ))
                ) : (
                    <div className=" justify-center items-center m-auto" >
                        <p className="text-[13.5px] opacity-55 font-light">Aucune {'activité'}</p>
                    </div>
                )}

            </section>
        </>

    )
}
