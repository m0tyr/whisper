import WhisperCard from "@/components/cards/WhisperCard";
import { fetchallParentsFromWhisper, fetchwhisperById, likewhisper } from "@/lib/actions/whisper.actions";
import { fetchUser, follow } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import TopBar from "@/components/shared/Topbar";
import ViewWhisperCard from "@/components/cards/ViewWhisperCard";
import ParentWhisperCard from "@/components/cards/ParentWhisperCard";
import { Suspense } from "react";
import Loader from "@/components/shared/loader/loader";
import { auth } from "@/auth";
import { WhisperProvider } from "@/contexts/WhisperPostContext";

export async function generateMetadata({ params }: { params: { id: string, username: string } }) {

    const whisperdatas = await fetchwhisperById(params.id);
    if (whisperdatas.caption == "") {
        return {
            title: `Whisper`,
        };
    }
    return {
        title: `@${params.username} • ${whisperdatas.caption}`,
    };
}


export default async function Page({ params }: { params: { id: string, username: string } }) {
    const session = await auth()
    if (!session) return null;
    const email = session?.user.email
    const currentuserInfo = await fetchUser(session?.user.id as string);
    if (!currentuserInfo?.onboarded) redirect('/onboarding');
    const whisperdatas = await fetchwhisperById(params.id);
    const allparents = await fetchallParentsFromWhisper(whisperdatas.parentId);
    const userData = {
        id: session?.user?.id,
        username: currentuserInfo?.username,
        name: currentuserInfo?.name || session?.user?.name,
        bio: currentuserInfo?.bio || "",
        image: currentuserInfo?.image || session?.user?.image,
    };
    const likeAction = async (myusername: string, whisperid: string, username: string) => {
        "use server";
        return await likewhisper(myusername, whisperid, username)
    }
    return (
        <>  <TopBar />

            <section className="mobile:main-container flex min-h-screen min-w-full flex-1 flex-col items-center bg-insanedark pt-20 px-0">

                <div className="w-7/12 bg-good-gray basis-full grow shrink rounded-t-3xl border border-border overflow-x-hidden overflow-y-auto relative z-0   mobile:max-w-[40rem] max-xl:w-4/5 max-lg:w-full" aria-hidden="true">
                    <div className=" flex flex-col relative grow">
                        <div>
                            {Object.keys(allparents).map((postId) => {
                                const post = allparents[postId];
                                return (
                                    <ParentWhisperCard
                                        key={post._id}
                                        user={userData}
                                        _id={`${currentuserInfo._id}`}
                                        id={`${post._id}`}
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
                                        author={{
                                            image: post.author.image,
                                            username: post.author.username,
                                            id: post.author.id
                                        }}
                                        createdAt={post.createdAt}
                                        comments={[
                                            {
                                                posts: {
                                                    number: post.children.length
                                                },
                                                childrens: post.children.map((child: { author: { image: any; username: any; id: any; }; content: any; createdAt: any; }) => ({
                                                    author: {
                                                        image: child.author.image,
                                                        username: child.author.username,
                                                        id: child.author.id
                                                    },
                                                    content: child.content.map((content: any) => ({
                                                        text: content.text,
                                                        type: content.type
                                                    })),
                                                    createdAt: child.createdAt
                                                }))
                                            }
                                        ]}
                                        isNotComment={post.children.length === 0}
                                        aspectRatio={post.aspectRatio}
                                        mentions={post.mentions.map((mention: any) => ({
                                            link: mention.link,
                                            text: mention.text,
                                            version: mention.version
                                        }))} like_info={{
                                            like_count: post.interaction_info.like_count,
                                            liketracker: post.interaction_info.liketracker.map((likeid: any) => ({
                                                id: likeid.id
                                            }))
                                        }}
                                        likewhisper={likeAction}
                                    />
                                );
                            })}
                        </div>
                        <div >
                            <WhisperProvider
                                value={{
                                    id: `${whisperdatas._id}`,
                                    currentUserId: session?.user?.id || "",
                                    parentId: whisperdatas.parentId,
                                    content: whisperdatas.content.map((content: any) => ({
                                        text: content.text,
                                        type: content.type
                                    })),
                                    medias: whisperdatas.media.map((media: any) => ({
                                        s3url: media.s3url,
                                        aspectRatio: media.aspectRatio,
                                        width: media.width,
                                        height: media.height,
                                        isVideo: media.isVideo
                                    })),
                                    author: {
                                        image: whisperdatas.author.image,
                                        username: whisperdatas.author.username,
                                        id: whisperdatas.author.id
                                    },
                                    createdAt: whisperdatas.createdAt,
                                    comments: [
                                        {
                                            posts: {
                                                number: whisperdatas.children.length
                                            },
                                            childrens: {} // No data needed here
                                        }
                                    ],
                                    isNotComment: whisperdatas.children.length === 0,
                                    mentions: whisperdatas.mentions.map((mention: any) => ({
                                        link: mention.link,
                                        text: mention.text,
                                        version: mention.version
                                    })),
                                    like_info: {
                                        like_count: whisperdatas.interaction_info.like_count,
                                        liketracker: whisperdatas.interaction_info.liketracker.map((likeid: any) => ({
                                            id: likeid.id
                                        }))
                                    },
                                    likewhisper: likeAction
                                }}
                            >
                                <ViewWhisperCard />
                            </WhisperProvider>

                        </div>
                        <div className=" min-h-[70vh]">
                            <Suspense fallback={
                                <Loader />
                            }>
                                {whisperdatas.children.map((post: any) => (
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
                                                image: post.author.image,
                                                username: post.author.username,
                                                id: post.author.id
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
                                            currentUserId: currentuserInfo.id as string
                                        }}
                                    >
                                        <WhisperCard />
                                    </WhisperProvider>
                                )
                                )}
                            </Suspense>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
