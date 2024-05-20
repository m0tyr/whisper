'use client'
import { useSessionUser } from "@/hooks/useSessionUser";
import UserCardColumn from "./user_card_col";

interface Props {
    suggestions: any;
    follow:any;
}

export default function FeedUserCard({suggestions, follow}: Props) {
    const [user] = useSessionUser()
    return (
        <div>
            <p className="text-[14px] font-light mt-2 relative top-2 ml-6 drop-shadow-xl">Suggestion pour vous</p>
            <UserCardColumn grid_display={4} suggestions={suggestions} follow={follow} my_username={user?.username as string} />
        </div>
    )
}