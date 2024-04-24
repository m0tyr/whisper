import { auth } from "@/auth";
import AccountProfile from "@/components/forms/AccountProfile";
import { fetchUser, fetchUserbyEmail } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

export async function generateMetadata() {
    return {
        title: "Encore une étape...",
        description: "a social app concept"
    };
}


async function Page() {
    const session = await auth()
    if (!session) return null;
    const email = session?.user.email
    const userInfo = await fetchUserbyEmail(email as string)
    if (userInfo) {
        if (userInfo?.onboarded) redirect('/');
    }

    const userData = {
        id: session.user.id,
        username: userInfo?.username || session.user.name,
        name: userInfo?.name || "",
        bio: userInfo?.bio || "",
        image: userInfo?.image || session.user.image,
        email: userInfo?.email || session.user.email
    };
    return (
        <>
            <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-10  rounded-2xl ">

                <h1 className="head-text font-black drop-shadow-2xl text-white">Vos premiers pas...</h1>
                <p className="text-white font-medium drop-shadow-2xl">Parlez-nous de vous !</p>

                <section className="pb-4 pt-2 my-2 rounded-xl">
                    <AccountProfile user={userData} btnTitle='Continue' />
                </section>
            </main>
            <div className="h-full w-full flex justify-center items-center relative">
                <div className="absolute bottom-5">
                    <p className="text-[#7c7c7c] inline-block text-[12px] font-normal justify-center items-center">
                        Copyright © 2024 Whisper Inc. Tous droits réservés.
                    </p>
                </div>
            </div>
        </>
    );
}

export default Page;