'use server'
import { fetchUser, fetchUserWhisper, fetchUserbyEmail, fetchUserbyUsername, follow, isFollowing } from "@/lib/actions/user.actions";
import { notFound, redirect } from "next/navigation";
import TopBar from "@/components/shared/Topbar";
import UserCard from "@/components/cards/UserCard";
import WhisperPost from "@/components/cards/WhisperPost";
import { auth } from "@/auth";
import { likewhisper } from "@/lib/actions/whisper.actions";
import { WhisperProvider } from "@/contexts/WhisperPostContext";
import { UpdateProfilModalContextProvider } from "@/contexts/UpdateProfilModalContext";


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
    const userposts = await fetchUserWhisper(userInfo.id);
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
                        <div>
                            {userposts.whispers.length === 0 ? (
                                <p className="text-white text-body1-bold ">No Whispers found...</p>
                            ) : (
                                <>
                                    {userposts.whispers.map((post: any) => (
                                        <WhisperProvider
                                            value={{
                                                id: post._id,
                                                parentId: post.parentId,
                                                content: post.content.map((content: any) => ({
                                                    text: content.text,
                                                    type: content.type
                                                })),
                                                medias: post.media.map((media: any) => ({
                                                    s3url: media.s3url,
                                                    aspectRatio: media.aspectRatio,
                                                    width: media.width,
                                                    height: media.height,
                                                    isVideo: media.isVideo
                                                })),
                                                author: {
                                                    image: userposts.image,
                                                    username: userposts.username,
                                                    id: userposts.id
                                                },
                                                createdAt: post.createdAt,
                                                like_info: {
                                                    like_count: post.interaction_info.like_count,
                                                    liketracker: post.interaction_info.liketracker.map((likeid: any) => ({
                                                        id: likeid.id
                                                    }))
                                                },
                                                comments: [{
                                                    posts: {
                                                        number: post.children.length
                                                    },
                                                    childrens: post.children.map((child: any) => ({
                                                        author: {
                                                            image: child.author.image,
                                                            username: child.author.username,
                                                            id: child.author.id
                                                        },
                                                        content: [], // No data needed here
                                                        createdAt: child.createdAt
                                                    }))
                                                }],
                                                isNotComment: post.children.length === 0,
                                                mentions: post.mentions.map((mention: any) => ({
                                                    link: mention.link,
                                                    text: mention.text,
                                                    version: mention.version
                                                })),
                                                likewhisper: likeAction,
                                                currentUserId: currentuserData.id as string,
                                                isInReplyContext: false,
                                                isInViewingView: false,
                                                isOnlyMediaPost: post.content && post.content.length === 0,
                                                ViewportIndicator : "default"
                                            }}
                                        >
                                            <WhisperPost />
                                        </WhisperProvider>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
