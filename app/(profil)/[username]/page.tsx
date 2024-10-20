'use server'
import { fetchUser, fetchUserWhisper, fetchUserbyEmail, fetchUserbyUsername, follow, isFollowing } from "@/lib/actions/user.actions";
import { notFound, redirect } from "next/navigation";
import TopBar from "@/components/shared/Topbar";
import UserCard from "@/components/cards/UserCard";
import WhisperCard from "@/components/cards/WhisperCard";
import { auth } from "@/auth";
import { likewhisper } from "@/lib/actions/whisper.actions";


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
            <TopBar user={currentuserData} _id={`${currentuserInfo._id}`} />

            <section className="mobile:main-container flex min-h-screen min-w-full flex-1 flex-col items-center bg-insanedark pt-20 pb-[4.55rem] px-0">

                <div className="w-7/12  mobile:max-w-xl max-xl:w-4/5 max-lg:w-full" aria-hidden="true">
                    <UserCard
                        myusername={currentuserData.username}
                        id={userData.id}
                        name={userData.name}
                        username={userData.username}
                        bio={userData.bio}
                        image={userData.image} _id={`${userInfo._id}`}
                        fetchedtype={"whisper"}
                        follow_count={userData.follow_count}
                        Isfollowing={isfollowing}
                        follow={addtofollowing}
                    />
                    {userposts.whispers.length === 0 ? (
                        <p className="text-white text-body1-bold ">No Whispers found...</p>
                    ) : (
                        <>
                            {userposts.whispers.map((post: any) => (
                                <WhisperCard
                                    user={currentuserData}
                                    _id={`${currentuserInfo._id}`}
                                    id={post._id}
                                    currentUserId={session?.user?.id || ""}
                                    parentId={post.parentId}
                                    content={post.content.map((content: any) => ({
                                        text: content.text,
                                        type: content.type
                                    }))}
                                    medias={post.media.map((media: any) => ({
                                        s3url: media.s3url,
                                        aspectRatio: media.aspectRatio,
                                        width: media.width,
                                        height: media.height,
                                        isVideo: media.isVideo
                                    }))}
                                    author={{ image: userposts.image, username: userposts.username, id: userposts.id }}
                                    createdAt={post.createdAt}
                                    comments={[
                                        {
                                            posts: {
                                                number: post.children.length
                                            },
                                            childrens: post.children.map((child: any) => ({
                                                author: {
                                                    image: child.author.image,
                                                    username: child.author.username,
                                                    id: child.author.id
                                                },
                                                content: [], //No data needed here
                                                createdAt: child.createdAt
                                            }))
                                        }
                                    ]}
                                    isNotComment={post.children.length === 0}
                                    mentions={post.mentions.map((mention: any) => ({
                                        link: mention.link,
                                        text: mention.text,
                                        version: mention.version
                                    }))}
                                    like_info={{
                                        like_count: post.interaction_info.like_count,
                                        liketracker: post.interaction_info.liketracker.map((likeid: any) => ({
                                            id: likeid.id
                                        }))
                                    }}
                                    likewhisper={likeAction}
                                />
                            ))}
                        </>
                    )}
                </div>
            </section>
        </>
    )
}
