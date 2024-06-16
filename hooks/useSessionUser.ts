import { useSession } from "next-auth/react";
import { useQueryUser } from "./queries/useQueryUser";

export function useSessionUser(){
    const { data: session } = useSession();
    const { data } = useQueryUser(session?.user.id as string);
    return [data] ;
};