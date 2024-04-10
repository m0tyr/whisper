

import TopBar from "@/components/shared/Topbar";
import TopChat from "@/components/shared/TopChat";
import { currentUser } from "@clerk/nextjs";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect, usePathname } from "next/navigation";
import { fetchwhispers } from "@/lib/actions/whisper.actions";
import WhisperCard from "@/components/cards/WhisperCard";
import { Suspense } from "react";
import LoadingSkeleton from "@/components/shared/loader/LoadingSkeleton";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { getMeta } from "@/lib/utils";
import Loader from "@/components/shared/loader/loader";
import SearchBar from "@/components/forms/SearchBar";


export default async function Page() {
  const user = await currentUser();
  if (!user) redirect('/sign-in');
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect('/onboarding');
  const userData = {
    id: user?.id,
    username: userInfo?.username || user.username,
    name: userInfo?.name || user.firstName,
    bio: userInfo?.bio || "",
    image: userInfo?.image || user.imageUrl,
  };
  return (
    <>

      <TopBar user={userData} _id={`${userInfo._id}`} />


      <section className="mobile:main-container flex min-h-screen min-w-full flex-1 flex-col items-center bg-insanedark pt-20 pb-[4.55rem] px-0">

        <div className="w-7/12  mobile:max-w-xl max-xl:w-4/5 max-lg:w-full" aria-hidden="true">
          <SearchBar/>
        </div>

      </section>
    </>
  )
}
