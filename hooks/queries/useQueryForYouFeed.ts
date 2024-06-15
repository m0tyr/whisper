import { useQuery } from "@tanstack/react-query";
import { fetchwhispers } from "@/lib/actions/whisper.actions";
import { useSessionUser } from "../useSessionUser";


function useQueryForYouFeed() {
    const userData = useSessionUser();
    const { data, isFetched } = useQuery({
        queryKey: ['feed_key', '124TWH'],
        queryFn: async () => {
            if (!userData) {
                throw new Error('User data is undefined');
            }
            return await fetchwhispers(userData[0]?.id, 1, 30);  
        },
    });
    return { data, isFetched };
}

export default useQueryForYouFeed;