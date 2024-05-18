'use client'
import { useSession } from "next-auth/react";
import { useQueryUser } from "./queries/useQueryUser";

export const useSessionUser = () => {
    const { data: session } = useSession();
    const userId = session?.user.id;
    const { data } = useQueryUser(session?.user.id as string);
    return [data];
};