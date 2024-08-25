import { auth } from "@/auth";
import WhisperSignatureAnimation from "@/lib/css/lotties/whisper_signature_anim.json";
import { fetchUserbyEmail } from "@/lib/actions/user.actions";
import Lottie from "lottie-react";
import { redirect } from "next/navigation";
import StoryCreate from "@/components/Stories/Create/StoryCreate";

export function generateMetadata() {
  return {
    title: `Create Story • Whisper`,
  };
}

async function Page() {
  const session = await auth();
  const email = session?.user.email;
  const currentUser = await fetchUserbyEmail(email as string);
  if (!currentUser.onboarded) redirect("/onboarding");

  return (
    <>
      <StoryCreate />
    </>
  );
}

export default Page;
