import TopBar from "@/components/shared/Topbar";

import { fetchUser, getActivityFromUser } from "@/lib/actions/user.actions";
import { calculateTimeAgo } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export function generateMetadata() {

  return {
      title: `Paramètres • Whisper`,
  };
}

async function Page() {
  const user = await currentUser();
  if (!user) redirect('/sign-in');
  const currentuserInfo = await fetchUser(user.id);
  if (!currentuserInfo?.onboarded) redirect('/onboarding');
  const userData = {
      id: user?.id,
      username: currentuserInfo?.username || user.username,
      name: currentuserInfo?.name || user.firstName,
      bio: currentuserInfo?.bio || "",
      image: currentuserInfo?.image || user.imageUrl,
  };
  return (
    <>
      <TopBar user={userData} _id={`${currentuserInfo._id}`} />
      <section className="mobile:activity-container flex min-h-screen min-w-full flex-1 flex-col items-center bg-insanedark pt-16 pb-[4.55rem] px-0">
        <div className="mt-1">Your password :  </div>
      </section>
    </>
  )
}

export default Page;