import Image from "next/image";

interface Props {
    name:string;
    username: string;
    image: string;
    id: string;
    bio:string;

}

function UserCard({
    name,
    username,
    image,
    id,
    bio,
}: Props) {
    return (
        <div className=" w-[99%] mx-auto">
            <div className="my-3">
                <div className="grid grid-cols-1 items-center columns-12">
                    <div className=" col-start-1">
                        <h2 className="text-white text-heading3-bold !text-[24px]  ">{name}</h2>
                        <p className=" text-slate-200 text-body1-normal !text-[15px] ">{`${username}`}</p>
                    </div>
                    <div className=" col-start-2">
                        
                        <Image src={image} alt="pfp" width={85} height={85} className="rounded-full" />
                    </div>
                </div>
                <div className="mt-4">
                    <span className="text-white text-small-medium font-normal !text-[15px]">
                        {bio}
                    </span>
                </div>
                <div className="mt-3">
                    <span className=" text-white opacity-50 text-small-medium font-extralight !text-[15px] line-clamp-2 ">no data :/</span>
                </div>
            </div>
            <div>
                <div>
                    <button className="w-full rounded-xl h-[34px] hover:bg-dark transition-all duration-150 text-white 
         border-x-[.15px] border-y-[.15px] border-x-[rgba(243,245,247,.13333)] 
         border-y-[rgba(243,245,247,.13333)] my-3 !text-[15px] font-medium">Modifier le profil</button>
                </div>
                <div className="text-center text-gray-2 h-8 flex items-center text-base-regular mb-2 mt-3.5  ">
                    <div className="w-48 border-b  border-solid border-white pb-3">
                        <a href={`./${username}`} className="hover:text-white transition-all duration-150 text-white text-[15px] font-normal">Whispers</a>
                    </div>
                    <div className="w-48 border-b  border-solid border-gray-2 pb-3">
                        <a href={`./${username}/replies`} className="hover:text-gray transition-all duration-150 text-[15px] font-normal">Réponses</a>
                    </div>
                    <div className="w-48 border-b  border-solid border-gray-2 pb-3">
                        <a href={`./${username}/reposts`} className="hover:text-gray transition-all duration-150 text-[15px] font-normal">Republications</a>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default UserCard