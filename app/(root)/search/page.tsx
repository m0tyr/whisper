

import TopBar from "@/components/shared/Topbar";
import TopChat from "@/components/shared/TopChat";
import { currentUser } from "@clerk/nextjs";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect, usePathname } from "next/navigation";
import { fetchwhispers, searchwhispersV1 } from "@/lib/actions/whisper.actions";
import WhisperCard from "@/components/cards/WhisperCard";
import LoadingSkeleton from "@/components/shared/loader/LoadingSkeleton";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { getMeta } from "@/lib/utils";
import Loader from "@/components/shared/loader/loader";
import SearchBar from "@/components/forms/SearchBar";
import { auth } from "@/auth";



export default async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const session = await auth()

  if (!session) { redirect('/sign-in') }
  const currentUser = await fetchUser(session?.user?.id as string);
  if (!currentUser?.onboarded) redirect('/onboarding');
  const { q } = searchParams ?? { q: "" };
  const results = await searchwhispersV1(q, 1, 15)
  const userData = {
    id: session?.user?.id,
    username: currentUser?.username,
    name: currentUser?.name || session?.user?.name,
    bio: currentUser?.bio || "",
    image: currentUser?.image || session?.user?.image,
  };

  return (
    <>

      <TopBar />


      <section className="mobile:main-container flex min-h-screen min-w-full flex-1 flex-col items-center bg-insanedark pt-20 pb-[4.55rem] px-0">

        <div className="w-7/12  mobile:max-w-xl max-xl:w-4/5 max-lg:w-full" aria-hidden="true">
          <SearchBar />
          <div>
            <div className=" mt-1.5">
              <div>
                {results?.whispers.length === 0 ? (
                  <div className=" justify-center items-center mx-auto my-auto" >
                    <p className="text-[13.5px] opacity-55 font-light">Aucune Résultat</p>
                  </div>) : (
                  <>
                    {results?.whispers.map((post: any) => (
                      <WhisperCard
                        key={post._id}
                        id={`${post._id}`}
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
                        }))} likewhisper={undefined}
                      />

                    )
                    )}
                  </>
                )
                }
              </div>
            </div>

          </div>
        </div>

      </section>
    </>
  )
}
