import LoginForm from "@/components/Login/LoginForm";
import Spinner from "@/components/Spinner/Spinner";
import { Suspense } from "react";

export async function generateMetadata() {
  return {
    title: "Connexion • Whisper",
    description: "a social app concept"
  };
}


export default async function Page() {

  return (
    <Suspense fallback={
      <Spinner width={24} height={24} color={"white"} Centered={true} />
    }>
      <LoginForm />
    </Suspense>
  );
}