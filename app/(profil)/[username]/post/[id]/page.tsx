import { fetchallParentsFromWhisper, fetchwhisperById, likewhisper } from "@/lib/actions/whisper.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import TopBar from "@/components/shared/Topbar";
import { auth } from "@/auth";
import { Loader } from "lucide-react";
import { Suspense } from "react";
import RenderHomeViewWhisperPost from "@/components/cards/components/WhisperPostRenderer/renderHomeViewWhisperPost";
import RenderMainViewWhisperPost from "@/components/cards/components/WhisperPostRenderer/renderMainViewWhisperPost";
import RenderParentViewWhisperPost from "@/components/cards/components/WhisperPostRenderer/renderParentViewWhisperPost";

export async function generateMetadata({ params }: { params: { id: string, username: string } }) {

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


export default async function Page({ params }: { params: { id: string, username: string } }) {
    const session = await auth()
    if (!session) return null;
    const email = session?.user.email
    const currentuserInfo = await fetchUser(session?.user.id as string);
    if (!currentuserInfo?.onboarded) redirect('/onboarding');
    const whisperdatas = await fetchwhisperById(params.id);
    const allparents = await fetchallParentsFromWhisper(whisperdatas.parentId);

    return (
        <>  <TopBar />

            <section className="mobile:main-container flex min-h-screen min-w-full flex-1 flex-col items-center bg-insanedark pt-20 px-0">

                <div className="w-7/12 bg-good-gray basis-full grow shrink rounded-t-3xl border border-border overflow-x-hidden overflow-y-auto relative z-0   mobile:max-w-[40rem] max-xl:w-4/5 max-lg:w-full" aria-hidden="true">
                    <div className=" flex flex-col relative grow">
                        <div>
                            {Object.keys(allparents).map((postId) => {
                                const post = allparents[postId];
                                return (
                                    <RenderParentViewWhisperPost post={post} />
                                )

                            })}
                        </div>
                        <div >
                            <RenderMainViewWhisperPost post={whisperdatas} />
                        </div>
                        <div className=" min-h-[70vh]">
                            <Suspense fallback={
                                <Loader />
                            }>
                                {whisperdatas.children.map((post: any) => (
                                    <RenderHomeViewWhisperPost post={post} key={post._id} />
                                ))}
                            </Suspense>
                        </div>
                    </div>
                </div>
            </section >
        </>
    )
}
