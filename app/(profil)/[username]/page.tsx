'use server'
import {
  notFound,
  redirect,
} from 'next/navigation';

import { auth } from '@/auth';
import UserCard from '@/components/UserCard/UserCard';
import TopBar from '@/components/Topbar/Topbar';
import WhisperPost from '@/components/WhisperPostLayout/WhisperPost';
import {
  UpdateProfilModalContextProvider,
} from '@/contexts/UpdateProfilModalContext';
import {
  fetchUserbyEmail,
  fetchUserbyUsername,
  fetchUserWhisper,
  follow,
  isFollowing,
} from '@/lib/actions/user.actions';
import { likewhisper } from '@/lib/actions/whisper.actions';
import UserWhispers from '@/components/UserWhispers/UserWhispers';
import { convertToReadableClientData } from '@/lib/utils';

export async function generateMetadata({ params }: { params: { username: string } }) {

    const userInfo = await fetchUserbyUsername(params.username);
    if (!userInfo) {
        return notFound()
    }
    if (!userInfo?.onboarded) redirect('/onboarding');
    const userData = {
        id: userInfo?.id,
        username: userInfo?.username,
        name: userInfo?.name,
        bio: userInfo?.bio,
        image: userInfo?.image,
    };
    return {
        title: `${userData.name} (@${userData.username})`,
        description: userData.bio,
    };
}
export default async function Page({ params }: { params: { username: string } }) {
    const session = await auth();
    if (!session) redirect('/sign-in');
    const email = session?.user?.email
    const currentuserInfo = await fetchUserbyEmail(email as string)

    if (!currentuserInfo?.onboarded) redirect('/onboarding');
    const userInfo = await fetchUserbyUsername(params.username);
    if (!userInfo) {
        return notFound()
    }
    if (!userInfo?.onboarded) redirect('/onboarding');
    const userData = {
        id: userInfo?.id,
        follow_count: userInfo?.user_social_info.follow_count,
        username: userInfo?.username,
        name: userInfo?.name,
        bio: userInfo?.bio,
        image: userInfo?.image,
    };
    const userposts = convertToReadableClientData(await fetchUserWhisper(userInfo.id));
    const currentuserData = {
        id: session?.user?.id,
        username: currentuserInfo?.username,
        name: currentuserInfo?.name,
        bio: currentuserInfo?.bio,
        image: currentuserInfo?.image,
    };
    const isfollowing = await isFollowing(currentuserData.username, userData.username)

    const addtofollowing = async (myusername: string, username: string) => {
        "use server";
        await follow(myusername, username)
    }
    const likeAction = async (myusername: string, whisperid: string, username: string) => {
        "use server";
        return await likewhisper(myusername, whisperid, username)
    }
    return (
        <>
            <TopBar />

            <section className="mobile:main-container flex min-h-screen min-w-full flex-1 flex-col items-center bg-insanedark pt-20 px-0">
        <div className="w-7/12 bg-good-gray basis-full grow shrink rounded-t-3xl border border-border overflow-x-hidden overflow-y-auto relative z-0   mobile:max-w-[40rem] max-xl:w-4/5 max-lg:w-full" aria-hidden="true">
                    <UpdateProfilModalContextProvider>
                        <UserCard
                            myusername={currentuserData.username}
                            name={userData.name}
                            username={userData.username}
                            bio={userData.bio}
                            image={userData.image}
                            fetchedtype={"whisper"}
                            follow_count={userData.follow_count}
                            Isfollowing={isfollowing}
                            follow={addtofollowing}
                        />
                    </UpdateProfilModalContextProvider>
                    <div className="">
                        <UserWhispers UserPosts={userposts} />
                    </div>
                </div>
            </section>
        </>
    )
}
