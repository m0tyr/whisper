import { auth } from "@/auth";
import StoriesGalleryViewer from "@/components/Stories/StoriesGalleryViewer";

import { fetchUserbyEmail } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

export function generateMetadata() {
  return {
    title: `Stories • Whisper`,
  };
}

async function Page() {
  const session = await auth();
  const email = session?.user.email;
  const currentUser = await fetchUserbyEmail(email as string);
  if (!currentUser.onboarded) redirect("/onboarding");

  return (
    <>
    <StoriesGalleryViewer/>
    </>
  );
}

export default Page;
