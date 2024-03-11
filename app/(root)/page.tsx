import TopBar from "@/components/shared/Topbar";
import TopChat from "@/components/shared/TopChat";
import { currentUser } from "@clerk/nextjs";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { fetchwhispers } from "@/lib/actions/whisper.actions";
import WhisperCard from "@/components/cards/WhisperCard";

async function Page() {
  let showPopup = false;
  const user = await currentUser();

  if (!user) redirect('/sign-in');

  const allposts = await fetchwhispers(1, 60);


  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect('/onboarding');
  const userData = {
    id: user?.id,
    username: userInfo?.username || user.username,
    name: userInfo?.name || user.firstName,
    bio: userInfo?.bio || "",
    image: userInfo?.image || user.imageUrl,
  };
  
  return (
    <>
      <TopBar user={userData} _id={`${userInfo._id}`} />

      <section className="main-container">

        <div className=" w-7/12 max-w-xl max-xl:w-4/5 max-lg:w-full " aria-hidden="true">
          <div>
            <div className="">
            <TopChat user={userData} _id={`${userInfo._id}`} />
            </div>
            {allposts.posts_exec.length === 0 ? (
              <p className="text-white text-body1-bold ">No Whispers found...</p>
            ) : (
              <>
              {allposts.posts_exec.map((post) => (
                 <WhisperCard 
                 id={post._id} 
                 currentUserId={user?.id || ""} 
                 parentId={post.parentId} 
                 content={post.content} 
                 media={post.media}
                 author={post.author} 
                 createdAt={post.createdAt} 
                 comments={post.children} 
                 />
              )
              )}
               
              </>
            )
            }
          </div>
        </div>
      </section>

    </>
  )
}
export default Page;