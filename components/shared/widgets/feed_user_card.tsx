'use client'
import UserCardColumn from "./user_card_col";

interface Props {
    suggestions: any;
    follow:any;
    my_username:string;
}

export default function FeedUserCard({suggestions, follow, my_username}: Props) {
    return (
        <div>
            <p className="text-[16px] mt-4 ml-6 drop-shadow-xl">Suggestion personalisée</p>
            <UserCardColumn grid_display={4} suggestions={suggestions} follow={follow} my_username={my_username} />
        </div>
    )
}