'use client'

import UserCardItem from "./user_card_item"

interface Props {
    grid_display: number;
    suggestions: any;
    follow:any;
    my_username:any;
}
export default function UserCardColumn({ grid_display, suggestions,follow, my_username }: Props) {
    const renderRows = () => {
        const rows = [];
        for (let i = 0; i < grid_display; i++) {
            const startIndex = i * 3;
            rows.push(
                <div key={i} className="flex justify-center items-center flex-row mt-5">
                    <UserCardItem suggestion={suggestions[startIndex]} myusername={my_username} follow={follow} />
                    <UserCardItem suggestion={suggestions[startIndex + 1]} myusername={my_username} follow={follow} />
                    <UserCardItem suggestion={suggestions[startIndex + 2]} myusername={my_username} follow={follow} />
                </div>
            );
        }
        return rows;
    };

    return (
        <div className="flex flex-col ml-[1.25rem]">
            {renderRows()}
        </div>
    );
}