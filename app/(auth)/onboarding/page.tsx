import { auth } from "@/auth";
import OnboardingCard from "@/components/Onboarding/OnboardingCard";
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
       <OnboardingCard user={userData}/>
    );
}

export default Page;