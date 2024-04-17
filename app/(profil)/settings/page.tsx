import TopBar from "@/components/shared/Topbar";
import NavMenu from "@/components/shared/widgets/nav_menu";
import SettingsMenu from "@/components/shared/widgets/settings_menu";

import { fetchUser, getActivityFromUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import Link from "next/link";
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
        <div className="w-7/12  mobile:max-w-xl max-xl:w-4/5 max-lg:w-full" aria-hidden="true">
          <div className=" pt-5 pb-3" >
            <span className="relative block whitespace-pre-line break-words overflow-x-visible overflow-y-visible text-left font-extrabold text-[23px]">
              Paramètres
            </span>

          </div>
          <NavMenu />
          <SettingsMenu />
        </div>


      </section>
    </>
  )
}

export default Page;