"use client";
import { useSessionUser } from "@/hooks/useSessionUser";
import SuggestedUserCarousel from "./SuggestedUserCarousel";
import useQueryUserSuggestion from "@/hooks/queries/useQueryUserSuggestion";

interface Props {
  follow: any;
}

export default function SuggestedUsers({ follow }: Props) {
  const { user } = useSessionUser();
  const { data, isFetched } = useQueryUserSuggestion();
  return (
    <div>
      <p className="text-[14px] font-light mt-2 relative top-2 ml-6 drop-shadow-xl">
        Suggestion pour vous
      </p>
      {isFetched ? (
        <SuggestedUserCarousel
          embedded_profile_amount={10}
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
