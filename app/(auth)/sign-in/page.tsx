import LoginForm from "@/components/forms/LoginForm";

export async function generateMetadata() {


  return {
    title: "Connexion • Whisper",
    description: "a social app concept"
  };
} 


export default function Page() {
  
  return <LoginForm />;
}