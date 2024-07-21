import { auth } from "@/auth";
import TopBar from "@/components/Topbar/Topbar";
import { fetchUserbyEmail } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import NavSettings from "@/components/NavigationMenu/Settings/NavSettings";
import SettingsPrivacyMenu from "@/components/Settings/SettingsPrivacyMenu";
import SettingsOthersMenu from "@/components/Settings/SettingsOthersMenu";

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
  if (params.type === null) {
    params.type = '';
  }

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
          <NavSettings navigation={params.type} />
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
