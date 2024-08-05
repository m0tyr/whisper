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
  const stories = [
    <div key="1" className="story-item bg-red-500">
      Histoire 1
    </div>,
    <div key="2" className="story-item bg-blue-500">
      Histoire 2
    </div>,
    <div key="3" className="story-item bg-green-500">
      Histoire 3
    </div>,
    <div key="4" className="story-item bg-yellow-500">
      Histoire 4
    </div>,
  ];

  return (
    <>
      <StoriesGalleryViewer config={config} stories={stories} />
    </>
  );
}

export default Page;
