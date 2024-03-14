import WhisperCard from "@/components/cards/WhisperCard";
import { fetchwhisperById } from "@/lib/actions/whisper.actions";
import { currentUser } from "@clerk/nextjs";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import TopBar from "@/components/shared/Topbar";
import ViewWhisperCard from "@/components/cards/ViewWhisperCard";

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
    const whisperdatas = await fetchwhisperById(params.id);
    const userData = {
        id: user?.id,
        username: currentuserInfo?.username || user.username,
        name: currentuserInfo?.name || user.firstName,
        bio: currentuserInfo?.bio || "",
        image: currentuserInfo?.image || user.imageUrl,
    };
    console.log(whisperdatas)
    return (
        <>  <TopBar user={userData} _id={`${currentuserInfo._id}`} />

            <section className="main-container">

                <div className=" w-7/12 max-w-xl max-xl:w-4/5 max-lg:w-full " aria-hidden="true">
                    <div>
                        <ViewWhisperCard
                            user={userData}
                            _id={`${currentuserInfo._id}`}
                            id={`${whisperdatas._id}`}
                            currentUserId={user?.id || ""}
                            parentId={whisperdatas.parentId}
                            content={whisperdatas.content}
                            media={whisperdatas.media}
                            author={
                                { image: whisperdatas.author.image, username: whisperdatas.author.username, id: whisperdatas.author.id }
                            }
                            createdAt={whisperdatas.createdAt}
                            comments={[
                                {

                                    posts: {
                                        number: whisperdatas.children.length
                                    },
                                    author: {
                                        image: whisperdatas.children.image,
                                        username: whisperdatas.children.username,
                                        id: whisperdatas.children.id
                                    }
                                }
                            ]}
                            isNotComment={whisperdatas.children.length === 0}
                        />
                    </div>
                    <div>
                        {whisperdatas.children.map((post: any) => (
                            <WhisperCard
                                user={userData}
                                _id={`${currentuserInfo._id}`}
                                id={`${post._id}`}
                                currentUserId={user?.id || ""}
                                parentId={post.parentId}
                                content={post.content}
                                media={post.media}
                                author={
                                    { image: whisperdatas.author.image, username: whisperdatas.author.username, id: whisperdatas.author.id }
                                }
                                createdAt={post.createdAt}
                                comments={[
                                    {

                                        posts: {
                                            number: post.children.length
                                        },
                                        author: {
                                            image: post.children.image,
                                            username: post.children.username,
                                            id: post.children.id
                                        }
                                    }
                                ]}
                                isNotComment={post.children.length === 0}
                            />
                        )
                        )}
                    </div>
                </div>
            </section>
        </>
    )
}
