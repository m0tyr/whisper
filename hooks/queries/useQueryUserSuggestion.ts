import { useQuery } from "@tanstack/react-query";
import { useSessionUser } from "../useSessionUser";
import { FamousUserSuggestion } from "@/lib/actions/user.actions";

function useQueryUserSuggestion() {
  const { user } = useSessionUser();
  const { data, isFetched } = useQuery({
    queryKey: ["suggestion_key", "124SWH"],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error("User data is undefined");
      }
      return await FamousUserSuggestion();
    },
  });
  return { data, isFetched };
}

export default useQueryUserSuggestion;
