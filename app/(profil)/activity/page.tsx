import { auth } from "@/auth";
import ActivityCard from "@/components/ActivityCard/ActivityCard";
import NavActivity from "@/components/NavigationMenu/Activity/NavActivity";
import TopBar from "@/components/Topbar/Topbar";
import { getNotifications } from "@/lib/actions/notifications.actions";
import { fetchUserbyEmail, follow } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
export function generateMetadata() {

    return {
        title: `Activité • Whisper`,
    };
}

export default async function Page() {
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
    const datas = await getNotifications(userData.id as string, "all");
    const addtofollowing = async (myusername: string, username: string) => {
        "use server";
        await follow(myusername, username)
    }
    return (
        <>
            <TopBar />
            <section className="mobile:activity-container flex min-h-screen min-w-full flex-1 flex-col items-center bg-insanedark pt-16 pb-[4.55rem] px-0">
                <div className="max-w-full overflow-x-auto " aria-hidden="true">
                    <NavActivity currenttype="all" />
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
