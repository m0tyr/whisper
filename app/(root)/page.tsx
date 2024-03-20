
import TopBar from "@/components/shared/Topbar";
import TopChat from "@/components/shared/TopChat";
import { currentUser } from "@clerk/nextjs";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect, usePathname } from "next/navigation";
import { fetchwhispers } from "@/lib/actions/whisper.actions";
import WhisperCard from "@/components/cards/WhisperCard";
import { Suspense } from "react";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { getMeta } from "@/lib/utils";


export default async function Page() {
  const user = await currentUser();
  if (!user) redirect('/sign-in');

  const allposts = await fetchwhispers(1, 20);


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
          <TopChat user={userData} _id={`${userInfo._id}`} />
          <Suspense fallback={
            <div className="flex flex-grow justify-center items-center">
              <svg aria-label="Chargement…" className="animate-spin absolute left-[50%] top-[50%] text-[rgb(119,119,119)] opacity-60" role="img" viewBox="0 0 100 100" width={25} height={25}>
                <rect height="10" opacity="0" rx="5" ry="5" transform="rotate(-90 50 50)" width="28" x="67" y="45"></rect>
                <rect height="10" opacity="0.125" rx="5" ry="5" transform="rotate(-45 50 50)" width="28" x="67" y="45"></rect>
                <rect height="10" opacity="0.25" rx="5" ry="5" transform="rotate(0 50 50)" width="28" x="67" y="45"></rect>
                <rect height="10" opacity="0.375" rx="5" ry="5" transform="rotate(45 50 50)" width="28" x="67" y="45"></rect>
                <rect height="10" opacity="0.5" rx="5" ry="5" transform="rotate(90 50 50)" width="28" x="67" y="45"></rect>
                <rect height="10" opacity="0.625" rx="5" ry="5" transform="rotate(135 50 50)" width="28" x="67" y="45"></rect>
                <rect height="10" opacity="0.75" rx="5" ry="5" transform="rotate(180 50 50)" width="28" x="67" y="45"></rect>
                <rect height="10" opacity="0.875" rx="5" ry="5" transform="rotate(225 50 50)" width="28" x="67" y="45"></rect>
              </svg>
            </div>
          }>

            <div>
              <div className="">
                <div>
                  {allposts.posts_exec.length === 0 ? (
                    <p className="text-white text-body1-bold ">No Whispers found...</p>
                  ) : (
                    <>
                      {allposts.posts_exec.map((post: any) => (
                        <><WhisperCard
                          user={userData}
                          _id={`${userInfo._id}`}
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
                          aspectRatio={post.aspectRatio} /><hr className="border-x-2 opacity-20 rounded-full " /></>

                      )
                      )}
                    </>
                  )
                  }
                </div>
              </div>

            </div>
          </Suspense>

        </div>


      </section>

    </>
  )
}
