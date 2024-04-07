import WhisperCard from "@/components/cards/WhisperCard";
import { fetchallParentsFromWhisper, fetchwhisperById } from "@/lib/actions/whisper.actions";
import { currentUser } from "@clerk/nextjs";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import TopBar from "@/components/shared/Topbar";
import ViewWhisperCard from "@/components/cards/ViewWhisperCard";
import ParentWhisperCard from "@/components/cards/ParentWhisperCard";
import { userInfo } from "os";
import { Suspense } from "react";
import Loader from "@/components/shared/loader/loader";

export async function generateMetadata({ params }: { params: { id: string, username: string } }) {

    const whisperdatas = await fetchwhisperById(params.id);
    if (whisperdatas.content == "") {
        return {
            title: `Whisper`,
        };
    }
    return {
        title: `@${params.username} • ${whisperdatas.content}`,
    };
}


export default async function Page({ params }: { params: { id: string, username: string } }) {
    const user = await currentUser();
    if (!user) redirect('/sign-in');
    const currentuserInfo = await fetchUser(user.id);
    if (!currentuserInfo?.onboarded) redirect('/onboarding');
    const whisperdatas = await fetchwhisperById(params.id);
    const allparents = await fetchallParentsFromWhisper(whisperdatas.parentId);
    const userData = {
        id: user?.id,
        username: currentuserInfo?.username || user.username,
        name: currentuserInfo?.name || user.firstName,
        bio: currentuserInfo?.bio || "",
        image: currentuserInfo?.image || user.imageUrl,
    };
    return (
        <>  <TopBar user={userData} _id={`${currentuserInfo._id}`} />

            <section className="mobile:main-container flex min-h-screen min-w-full flex-1 flex-col items-center bg-insanedark pt-20 pb-[4.55rem] px-0">

                <div className="w-7/12  mobile:max-w-xl max-xl:w-4/5 max-lg:w-full" aria-hidden="true">
                        <div>
                            {Object.keys(allparents).map((postId) => {
                                const post = allparents[postId];
                                return (
                                    <ParentWhisperCard
                                        key={post._id}
                                        user={userData}
                                        _id={`${currentuserInfo._id}`}
                                        id={`${post._id}`}
                                        currentUserId={user?.id || ""}
                                        parentId={post.parentId}
                                        content={post.content}
                                        media={post.media}
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
                                                    content: child.content,
                                                    createdAt: child.createdAt
                                                }))
                                            }
                                        ]}
                                        isNotComment={post.children.length === 0}
                                        aspectRatio={post.aspectRatio}
                                    />
                                );
                            })}
                        </div>
                        <div>
                            <ViewWhisperCard
                            user={userData}
                            _id={`${currentuserInfo._id}`}
                            id={`${whisperdatas._id}`}
                            currentUserId={user?.id || ""}
                            parentId={whisperdatas.parentId}
                            content={whisperdatas.content}
                            media={whisperdatas.media}
                            author={{ image: whisperdatas.author.image, username: whisperdatas.author.username, id: whisperdatas.author.id }}
                            createdAt={whisperdatas.createdAt}
                            comments={[
                                {
                                    posts: {
                                        number: whisperdatas.children.length
                                    },
                                    childrens: {}
                                }
                            ]}
                            isNotComment={whisperdatas.children.length === 0}
                            aspectRatio={whisperdatas.aspectRatio}
                            mentions={whisperdatas.mentions.map((mention: any) => ({
                                link: mention.link,
                                text: mention.text,
                                version: mention.version
                              }))}                         />
                        </div>
                        <div>
                            <Suspense fallback={
                                <Loader />
                            }>
                                {whisperdatas.children.map((post: any) => (
                                    <WhisperCard
                                        user={userData}
                                        _id={`${currentuserInfo._id}`}
                                        id={`${post._id}`}
                                        currentUserId={user?.id || ""}
                                        parentId={post.parentId}
                                        content={post.content}
                                        media={post.media}
                                        author={{ image: post.author.image, username: post.author.username, id: post.author.id }}
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
                                                    content: child.content,
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
                                          }))}                                 />
                                )
                                )}
                            </Suspense>
                        </div>
                    </div>
            </section>
        </>
    )
}
