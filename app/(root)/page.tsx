import TopChat from "@/components/TopChat/TopChat";
import TopBar from "@/components/Topbar/Topbar";
import { fetchUserbyEmail, getSession } from "@/lib/actions/user.actions";
import FeedGenerator from "@/lib/client_fetching/feed_generator";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getSession();
  const email = session?.user.email;
  const currentUser = await fetchUserbyEmail(email as string);
  if (!currentUser.onboarded) redirect("/onboarding");

  return (
    <>
      <section className="mobile:main-container flex min-h-screen min-w-full flex-1 flex-col items-center bg-insanedark px-0">
        <div className="flex flex-col w-[640px] max-w-[640px] grow">
          <div className="w-full sticky min-h-16 flex justify-center top-0 bg-[#0A0A0A] z-[1]">
            <div className="h-9 overflow-x-hidden top-[52px] w-9 overflow-y-hidden z-[1] left-[-12px] absolute">
              <div className=" h-12 w-12 absolute top-3  left-3 border border-l shadow-[0_0_12px_0_rgba(0,0,0,0.04),0_0_0_48px_rgb(10,10,10)] border-b rounded-l-3xl rounded-bl-3xl border-border"></div>
            </div>
          </div>
          <div
            className="w-full bg-good-gray basis-full grow shrink border border-border overflow-x-hidden overflow-y-auto relative z-0 "
            aria-hidden="true"
          >
            <TopChat />
            <div className="">
              <div>
                <FeedGenerator />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
