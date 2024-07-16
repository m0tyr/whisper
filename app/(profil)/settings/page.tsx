import { auth } from "@/auth";
import TopBar from "@/components/Topbar/Topbar";
import SettingsAccountMenu from "@/components/Settings/SettingsAccountMenu";

import { fetchUser, fetchUserbyEmail, getActivityFromUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import NavSettings from "@/components/NavigationMenu/Settings/NavSettings";

export function generateMetadata() {

  return {
    title: `Paramètres • Whisper`,
  };
}

async function Page() {
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
  return (
    <>
      <TopBar />
      <section className="mobile:activity-container flex min-h-screen min-w-full flex-1 flex-col items-center bg-insanedark pt-16 pb-[4.55rem] px-0">
        <div className="w-7/12  mobile:max-w-xl max-xl:w-4/5 max-lg:w-full" aria-hidden="true">
          <div className=" pt-5 pb-3" >
            <span className="relative block whitespace-pre-line break-words overflow-x-visible overflow-y-visible text-left font-extrabold text-[23px]">
              Paramètres
            </span>

          </div>
          <NavSettings navigation={""} />
          <SettingsAccountMenu />
        </div>


      </section>
    </>
  )
}

export default Page;