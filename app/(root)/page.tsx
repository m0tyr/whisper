import TopChat from "@/components/TopChat/TopChat"
import TopBar from "@/components/Topbar/Topbar"
import { fetchUserbyEmail, getSession } from "@/lib/actions/user.actions"
import FeedGenerator from "@/lib/client_fetching/feed_generator"
import { redirect } from "next/navigation"

export default async function Page() {
  const session = await getSession()
  const email = session?.user.email
  const currentUser = await fetchUserbyEmail(email as string)
  if (!currentUser.onboarded) redirect('/onboarding');

  return (
    <>
      <TopBar />
      <section className="mobile:main-container flex min-h-screen min-w-full flex-1 flex-col items-center bg-insanedark pt-20 px-0">
        <div className=" absolute w-9 h-9 right-[-12px] top-[18px]"></div>
        <div className="w-7/12 bg-good-gray basis-full grow shrink rounded-t-3xl border border-border overflow-x-hidden overflow-y-auto relative z-0   mobile:max-w-[40rem] max-xl:w-4/5 max-lg:w-full" aria-hidden="true">
          <TopChat />
          <div className="">
            <div>
              <FeedGenerator />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}