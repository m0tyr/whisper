

import TopBar from "@/components/shared/Topbar";
import TopChat from "@/components/shared/TopChat";
import { currentUser } from "@clerk/nextjs";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect, usePathname } from "next/navigation";
import { fetchwhispers, searchwhispersV1 } from "@/lib/actions/whisper.actions";
import WhisperCard from "@/components/cards/WhisperCard";
import { Suspense } from "react";
import LoadingSkeleton from "@/components/shared/loader/LoadingSkeleton";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { getMeta } from "@/lib/utils";
import Loader from "@/components/shared/loader/loader";
import SearchBar from "@/components/forms/SearchBar";



export default async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const user = await currentUser();
  if (!user) redirect('/sign-in');
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect('/onboarding');
  const { q } = searchParams ?? { q: "" };
  const results = await searchwhispersV1(q, 1, 15)
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
                              content: [],//No data needed here
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
                        }))}
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
