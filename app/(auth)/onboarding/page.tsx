import AccountProfile from "@/components/forms/AccountProfile";
import { currentUser } from "@clerk/nextjs";

async function Page() {
    const user = await currentUser();
    if (!user) return null;
    const userInfo = {};
  
    const userData = {
      id: user?.id,
      objectId: userInfo?._id,
      username: userInfo?.username || user.username,
      name: userInfo?.name || user.firstName,
      bio:  userInfo?.bio || "",
      image: userInfo?.image || user.imageUrl,
    };
    return (
        <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20 ">
          
            <h1 className="text-white head-text">Vos premiers pas...</h1>
            <p className="text-white">Parlez-nous de vous !</p>
         
            <section className="py-20 bg-insanedark px-5 my-4 rounded-xl">
                <AccountProfile user={userData} btnTitle='Continue' />
            </section>
        </main>
    );
}

export default Page;