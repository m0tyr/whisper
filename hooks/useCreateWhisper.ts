import { MouseEventHandler, useContext, useState } from "react";
import { useSessionUser } from "./useSessionUser";
import { ModalContextApi } from "@/contexts/create_post.provider";

export const useCreateWhisper = () => {
    const { setModalProps, setModalType, toggleModal } = useContext(ModalContextApi);
    const [user] = useSessionUser()

    const launchCreateContext = () => {
        if (user) {
            setModalType('create');
            setModalProps({ user });
            toggleModal(false)();
        }
    };

    const launchReplyContext = (whisper: any) => {
        setModalType('reply');
        setModalProps({ whisper_to_reply: whisper, user: user });
        toggleModal(false)();
    };
    return {
        launchCreateContext,
        launchReplyContext,
    }
}