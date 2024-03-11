import { fetchUser, fetchUserWhisper, fetchUserbyUsername } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import TopBar from "@/components/shared/Topbar";
import { currentUser } from "@clerk/nextjs";
import UserCard from "@/components/cards/UserCard";
import WhisperCard from "@/components/cards/WhisperCard";


export async function generateMetadata({ params }: { params: { username: string } }) {

    const userInfo = await fetchUserbyUsername(params.username);
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
async function Page({ params }: { params: { username: string } }) {
    const user = await currentUser();

    if (!user) redirect('/sign-in');
    const currentuserInfo = await fetchUser(user.id);
    const userInfo = await fetchUserbyUsername(params.username);
    if (!userInfo?.onboarded) redirect('/onboarding');
    const userData = {
        id: userInfo?.id,
        username: userInfo?.username,
        name: userInfo?.name,
        bio: userInfo?.bio,
        image: userInfo?.image,
    };
    const userposts = await fetchUserWhisper(userInfo.id);
    const currentuserData = {
        id: currentuserInfo?.id,
        username: currentuserInfo?.username,
        name: currentuserInfo?.name,
        bio: currentuserInfo?.bio,
        image: currentuserInfo?.image,
    };
    return (
        <>
            <TopBar user={currentuserData} _id={`${currentuserInfo._id}`} />
            <section className="main-container">
                <div className=" w-7/12 max-w-xl max-xl:w-4/5 max-lg:w-full" aria-hidden="true">
                    <UserCard
                        id={userData.id}
                        name={userData.name}
                        username={userData.username}
                        bio={userData.bio}
                        image={userData.image}
                    />
                    {userposts.whispers.length === 0 ? (
                        <p className="text-white text-body1-bold ">No Whispers found...</p>
                    ) : (
                        <>
                            {userposts.whispers.map((post: any) => (
                                <WhisperCard
                                    id={post._id}
                                    currentUserId={user?.id || ""}
                                    parentId={post.parentId}
                                    content={post.content}
                                    media={post.media}
                                    author={
                                        { image: userposts.image, username: userposts.username, id: userposts.id }
                                    }
                                    createdAt={post.createdAt}
                                    comments={post.children}
                                />
                            ))}
                        </>
                    )}
                </div>
            </section>
        </>
    )
}
export default Page;