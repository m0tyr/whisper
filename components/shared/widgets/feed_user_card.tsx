"use client";
import { useSessionUser } from "@/hooks/useSessionUser";
import UserCardColumn from "./user_card_col";
import useQueryUserSuggestion from "@/hooks/queries/useQueryUserSuggestion";
import { convertToReadableClientData } from "@/lib/utils";

interface Props {
  follow: any;
}

export default function FeedUserCard({ follow }: Props) {
  const [user] = useSessionUser();
  const { data, isFetched } = useQueryUserSuggestion();
  return (
    <div>
      <p className="text-[14px] font-light mt-2 relative top-2 ml-6 drop-shadow-xl">
        Suggestion pour vous
      </p>
      {isFetched ? (
        <UserCardColumn
          grid_display={4}
          suggestions={data}
          follow={follow}
          my_username={user?.username as string}
        />
      ) : (
        <span>Loading</span>
      )}
    </div>
  );
}
