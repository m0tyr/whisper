import LoginForm from "@/components/forms/LoginForm";
import Loader from "@/components/shared/loader/loader";
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
      <Loader />
    }>
      <LoginForm />
    </Suspense>
  );
}