import { auth } from "@/auth"
import WhisperCard from "@/components/cards/WhisperCard"
import TopChat from "@/components/shared/TopChat"
import TopBar from "@/components/shared/Topbar"
import Loader from "@/components/shared/loader/loader"
import { fetchUserbyEmail, getSession } from "@/lib/actions/user.actions"
import { fetchwhispers } from "@/lib/actions/whisper.actions"
import { redirect } from "next/navigation"
import { Suspense } from "react"




export default async function Page() {
  const session = await getSession()
  const email = session?.user.email
  const currentUser = await fetchUserbyEmail(email as string)
  if (!currentUser.onboarded) redirect('/onboarding');
  const allposts = await fetchwhispers(1, 30);
  const userData = {
    id: session?.user?.id,
    username: currentUser?.username,
    name: currentUser?.name || session?.user?.name,
    bio: currentUser?.bio || "",
    image: currentUser?.image || session?.user?.image,
  };
  return (
    <>
      <Suspense fallback={
        <Loader />
      }>
        <TopBar user={userData} _id={`${currentUser._id}`} />


        <section className="mobile:main-container flex min-h-screen min-w-full flex-1 flex-col items-center bg-insanedark pt-20 pb-[4.55rem] px-0">

          <div className="w-7/12  mobile:max-w-xl max-xl:w-4/5 max-lg:w-full" aria-hidden="true">
            <TopChat user={userData} _id={`${currentUser._id}`} />


            <div className="">
              <div>
                {allposts.posts_exec.length === 0 ? (
                  <p className="text-white text-body1-bold">No Whispers found...</p>
                ) : (
                  <>
                    {allposts.posts_exec.map((post: any) => {
                      return (
                        <WhisperCard
                          key={post._id}
                          user={userData}
                          _id={`${currentUser._id}`}
                          id={`${post._id}`}
                          currentUserId={userData.id || ""}
                          parentId={post.parentId}
                          content={post.content.map((content: any) => ({
                            text: content.text,
                            type: content.type
                          }))}
                          medias={post.media.map((media: any) => ({
                            s3url: media.s3url,
                            aspectRatio: media.aspectRatio,
                            width: media.width,
                            isVideo: media.isVideo
                          }))}
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


        </section>
      </Suspense>
    </>
  )
}
