import { useSession } from "next-auth/react";
import { useQueryUser } from "./queries/useQueryUser";

export function useSessionUser(){
    const { data: session } = useSession();
    console.log("logging in ")
    const { data } = useQueryUser(session?.user.id as string);
    console.log("logging out")
    return [data] ;
};