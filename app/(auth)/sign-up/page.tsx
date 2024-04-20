import RegisterForm from "@/components/forms/RegisterForm";
export async function generateMetadata() {


  return {
    title: "Inscription • Whisper",
    description: "a social app concept"
  };
} 

export default function Page() {
  
  return <RegisterForm />;
}