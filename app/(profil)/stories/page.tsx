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

  const config = {
    gallery: { width: 1200 },
    player: { height: 600, width: 800 },
    preview: { height: 300, width: 200 },
    previewCount: 5,
    previewScale: 1.2,
  };
  
  return (
    <>
    <StoriesGalleryViewer config={config} currentIndex={0}/>
    </>
  );
}

export default Page;
