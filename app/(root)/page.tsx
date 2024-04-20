

import TopBar from "@/components/shared/Topbar";
import TopChat from "@/components/shared/TopChat";
import { currentUser } from "@clerk/nextjs";
import { fetchUser, fetchUserbyEmail } from "@/lib/actions/user.actions";
import { redirect, usePathname } from "next/navigation";
import { fetchwhispers, isliking } from "@/lib/actions/whisper.actions";
import WhisperCard from "@/components/cards/WhisperCard";
import { Suspense } from "react";
import LoadingSkeleton from "@/components/shared/loader/LoadingSkeleton";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { getMeta } from "@/lib/utils";
import Loader from "@/components/shared/loader/loader";
import { SessionProvider } from "next-auth/react";
import { auth, signOut } from "@/auth";


export default async function Page() {
  const session = await auth()
  const email = session?.user.email
  const currentUser = await fetchUserbyEmail(email as string)



  if(!currentUser.onboarding) redirect('/onboarding');
  return (
    <>
      <div>
        <p>Welcome {session?.user?.name}!</p>
        <p> {session?.user?.email}!</p>
        <p> {JSON.stringify(session?.user)}!</p>
      </div>
      <form
           action={async () => {
            // signOut() Method will be declared later
             'use server';
             await signOut();
            }}
        >
          <button>
             Log Out
          </button>
        </form>
    </>
  )
}
