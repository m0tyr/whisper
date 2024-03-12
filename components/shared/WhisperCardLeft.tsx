

interface Props {
    author: {
        username: string;
        image: string;
        id: string;
    };

    isComment?: boolean;
}
import Image from "next/image";
import Link from "next/link";

const WhisperCardLeft = ({
    author,
    isComment,
}: Props) => {
    return (
        <div className=" flex flex-col w-10  justify-center">
        <Link href={`${author.username}`}>
            <Image src={author.image} alt="logo" width={37} height={37} className="cursor-pointer rounded-full" />

        </Link>
        <div className="thread-card_bar" />


    </div>
    )

}
export default WhisperCardLeft;