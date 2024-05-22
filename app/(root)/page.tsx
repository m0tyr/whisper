import TopChat from "@/components/shared/TopChat"
import TopBar from "@/components/shared/Topbar"
import FeedSkeleton from "@/components/shared/loader/feed_skeleton"
import { fetchUserbyEmail, getSession } from "@/lib/actions/user.actions"
import FeedGenerator from "@/lib/client_fetching/feed_generator"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { headers } from 'next/headers'

export default async function Page() {
  const session = await getSession()
  const email = session?.user.email
  const currentUser = await fetchUserbyEmail(email as string)
  if (!currentUser.onboarded) redirect('/onboarding');

  const userData = {
    id: session?.user?.id,
    username: currentUser?.username,
    name: currentUser?.name || session?.user?.name,
    bio: currentUser?.bio || "",
    image: currentUser?.image || session?.user?.image,
    _id: currentUser?._id
  };

  return (
    <>

      <TopBar />
      <section className="mobile:main-container flex min-h-screen min-w-full flex-1 flex-col items-center bg-insanedark pt-20 pb-[4.55rem] px-0">
        <div className="w-7/12  mobile:max-w-xl max-xl:w-4/5 max-lg:w-full" aria-hidden="true">
          <TopChat />
          <div className="">
            <div>
             {/*  <Suspense fallback={<FeedSkeleton feed_length={15} />}>
                <FeedGenerator  userID={userData.id as string} />
              </Suspense> */}

            </div>
          </div>



        </div>


      </section>
    </>
  )
}