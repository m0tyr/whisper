import { auth } from "@/auth";
import ActivityCard from "@/components/cards/ActivityCard";
import NavActivity from "@/components/shared/NavActivity";
import TopBar from "@/components/shared/Topbar";
import NavMenu from "@/components/shared/widgets/nav_menu";
import SettingsAccountMenu from "@/components/shared/widgets/settings_account_menu";
import SettingsOthersMenu from "@/components/shared/widgets/settings_others_menu";
import SettingsPrivacyMenu from "@/components/shared/widgets/settings_privacy_menu";
import { fetchUser, fetchUserbyEmail, getActivityFromUser, getMentionActivityFromUser } from "@/lib/actions/user.actions";
import { calculateTimeAgo } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { redirect } from "next/navigation";

export function generateMetadata() {

  return {
    title: `Paramètres • Whisper`,
  };
}


export default async function Page({ params }: { params: { type: string } }) {
  const session = await auth()
  const email = session?.user.email
  const currentUser = await fetchUserbyEmail(email as string)
  if (!currentUser.onboarded) redirect('/onboarding');
  const userData = {
    id: session?.user?.id,
    username: currentUser?.username,
    name: currentUser?.name || session?.user?.name,
    bio: currentUser?.bio || "",
    image: currentUser?.image || session?.user?.image,
  };
  if (params.type === null) {
    params.type = '';
  }

  return (
    <>
      <TopBar user={userData} _id={`${currentUser._id}`} />
      <section className="mobile:activity-container flex min-h-screen min-w-full flex-1 flex-col items-center bg-insanedark pt-16 pb-[4.55rem] px-0">
        <div className="w-7/12  mobile:max-w-xl max-xl:w-4/5 max-lg:w-full" aria-hidden="true">
          <div className=" pt-5 pb-3" >
            <span className="relative block whitespace-pre-line break-words overflow-x-visible overflow-y-visible text-left font-extrabold text-[23px]">
              Paramètres
            </span>

          </div>
          <NavMenu navigation={params.type} />
          {
            params.type === 'privacy' && <SettingsPrivacyMenu/>
          }
          {
            params.type === 'others' && <SettingsOthersMenu/>
          }
        </div>


      </section>
    </>

  )
}
