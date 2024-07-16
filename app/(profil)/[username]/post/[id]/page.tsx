import {
  fetchallParentsFromWhisper,
  fetchwhisperById,
} from "@/lib/actions/whisper.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import TopBar from "@/components/Topbar/Topbar";
import { auth } from "@/auth";
import ViewWhisperLayout from "@/components/ViewWhisperLayouts/ViewWhisperLayouts";
import { convertToReadableClientData } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: { id: string; username: string };
}) {
  const whisperdatas = await fetchwhisperById(params.id);
  if (whisperdatas.caption == "") {
    return {
      title: `Whisper`,
    };
  }
  return {
    title: `@${params.username} • ${whisperdatas.caption}`,
  };
}

export default async function Page({
  params,
}: {
  params: { id: string; username: string };
}) {
  const session = await auth();
  if (!session) return null;
  const email = session?.user.email;
  const currentuserInfo = await fetchUser(session?.user.id as string);
  if (!currentuserInfo?.onboarded) redirect("/onboarding");
  const whisperdatas = convertToReadableClientData(await fetchwhisperById(params.id));
  const allparents =  convertToReadableClientData(await fetchallParentsFromWhisper(whisperdatas.parentId));

  return (
    <>
      <TopBar />
      <section className="mobile:main-container flex min-h-screen min-w-full flex-1 flex-col items-center bg-insanedark pt-20 px-0">
        <div
          className="w-7/12 bg-good-gray basis-full grow shrink rounded-t-3xl border border-border overflow-x-hidden overflow-y-auto relative z-0   mobile:max-w-[40rem] max-xl:w-4/5 max-lg:w-full"
          aria-hidden="true"
        >
          <div className=" flex flex-col relative grow">
            <ViewWhisperLayout allparents={allparents} whisperdatas={whisperdatas} />
          </div>
        </div>
      </section>
    </>
  );
}
