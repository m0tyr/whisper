import { auth } from "@/auth";
import AccountProfile from "@/components/forms/AccountProfile";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
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
    const userInfo = await fetchUser(session.user.id);
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
        <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20 ">

            <h1 className="text-white head-text">Vos premiers pas...</h1>
            <p className="text-white">Parlez-nous de vous !</p>

            <section className="py-20 bg-insanedark px-5 my-4 rounded-xl">
                <AccountProfile user={userData} btnTitle='Continue' />
            </section>
        </main>
    );
}

export default Page;