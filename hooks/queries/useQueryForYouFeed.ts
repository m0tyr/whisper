import { useQuery } from "@tanstack/react-query";
import { fetchwhispers } from "@/lib/actions/whisper.actions";
import { useSessionUser } from "../useSessionUser";


function useQueryForYouFeed() {
    const { user } = useSessionUser();
    const { data, isFetched } = useQuery({
        queryKey: ['feed_key', '124TWH'],
        queryFn: async () => {
            if (!user?.id) {
                throw new Error('User data is undefined');
            }
            return await fetchwhispers(user?.id as string, 1, 30);  
        },
    });
    return { data, isFetched };
}

export default useQueryForYouFeed;