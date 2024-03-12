

interface Props {
    author: {
        username: string;
        image: string;
        id: string;
    };

    isNotComment?: boolean;
}
import Image from "next/image";
import Link from "next/link";

const WhisperCardLeft = ({
    author,
    isNotComment,
}: Props) => {
    return (<>
     {!isNotComment &&(
        <div className=" flex flex-col w-10  justify-center">
        <Link href={`${author.username}`}>
            <Image src={author.image} alt="logo" width={37} height={37} className="cursor-pointer rounded-full" />

        </Link>

       
        <div className="thread-card_bar" />
      

    </div>
      )}
       {isNotComment && (
            <div className=" flex flex-col w-10  justify-center relative">
            <Link href={`${author.username}`} className="absolute top-0.5">
                <Image src={author.image} alt="logo" width={37} height={37} className=" cursor-pointer rounded-full" />
    
            </Link>
    
           
          
    
        </div>
        )}
    </>
    )

}
export default WhisperCardLeft;