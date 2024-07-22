import { useSession } from "next-auth/react";
import { useQueryUser } from "./queries/useQueryUser";

export function useSessionUser(){
    const { data: session } = useSession();
    const { data: user, refetch } = useQueryUser(session?.user.id as string);

    const refetchCurrentSessionUser = () => {
        refetch()
    }

    return {
        user,
        refetchCurrentSessionUser
    } ;
};