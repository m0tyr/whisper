

import TopBar from "@/components/shared/Topbar";
import TopChat from "@/components/shared/TopChat";
import { currentUser } from "@clerk/nextjs";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect, usePathname } from "next/navigation";
import { fetchwhispers, isliking } from "@/lib/actions/whisper.actions";
import WhisperCard from "@/components/cards/WhisperCard";
import { Suspense } from "react";
import LoadingSkeleton from "@/components/shared/loader/LoadingSkeleton";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { getMeta } from "@/lib/utils";
import Loader from "@/components/shared/loader/loader";


export default async function Page() {
  const user = await currentUser();
  if (!user) redirect('/sign-in');

  const allposts = await fetchwhispers(1, 30);

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
      <Suspense fallback={
        <Loader />
      }>
        <TopBar user={userData} _id={`${userInfo._id}`} />


        <section className="mobile:main-container flex min-h-screen min-w-full flex-1 flex-col items-center bg-insanedark pt-20 pb-[4.55rem] px-0">

          <div className="w-7/12  mobile:max-w-xl max-xl:w-4/5 max-lg:w-full" aria-hidden="true">
            <TopChat user={userData} _id={`${userInfo._id}`} />


            <div>
              <div className="">
                <div>
                  {allposts.posts_exec.length === 0 ? (
                    <p className="text-white text-body1-bold">No Whispers found...</p>
                  ) : (
                    <>
                      {allposts.posts_exec.map(async (post: any) => {
                        return (
                          <WhisperCard
                            key={post._id} // Ensure each WhisperCard has a unique key
                            user={userData}
                            _id={`${userInfo._id}`}
                            id={`${post._id}`}
                            currentUserId={user?.id || ""}
                            parentId={post.parentId}
                            content={post.content.map((content: any) => ({
                              text: content.text,
                              type: content.type
                            }))}
                            media={post.media}
                            author={{
                              image: post.author.image,
                              username: post.author.username,
                              id: post.author.id
                            }}
                            createdAt={post.createdAt}
                            like_info={{
                              like_count: post.interaction_info.like_count,
                              liketracker: post.interaction_info.liketracker.map((likeid: any) => ({
                                id: likeid.id
                              }))
                            }}
                            comments={[{
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
                            }]}
                            isNotComment={post.children.length === 0}
                            aspectRatio={post.aspectRatio}
                            mentions={post.mentions.map((mention: any) => ({
                              link: mention.link,
                              text: mention.text,
                              version: mention.version
                            }))}
                          />
                        );
                      })}
                    </>
                  )}
                </div>
              </div>
            </div>

          </div>


        </section>
      </Suspense>
    </>
  )
}
