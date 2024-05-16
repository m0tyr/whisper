import { UserObject } from "@/lib/types/user.types";
import { useState } from "react";

export const useTempUserData = (user: UserObject) => {
    const [nameCache, setNameCache] = useState(user?.name || "");
    const [bioCache, setBioCache] = useState(user?.bio || "");
    const [bioStatus, setBioStatus] = useState(false);

    const handleDataUpdate = (value: string, type: string) => {
        if (type === "name") {
            setNameCache(value);
        } else if (type === "bio") {
            setBioCache(value);
            setBioStatus(true);
        }
    };

    return {
        nameCache,
        bioCache,
        bioStatus,
        handleDataUpdate
    };
};