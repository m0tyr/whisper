import { MouseEventHandler, useContext, useState } from "react";
import { useSessionUser } from "./useSessionUser";
import { ModalContextApi } from "@/contexts/create_post.provider";

export const useWhisperModal = () => {
    const { setdismisstate, setModalProps, setModalType, toggleModal } = useContext(ModalContextApi);
    
    const [user] = useSessionUser()

    const ModifyDismissState = (state: boolean) => {
        setdismisstate(state)
    }
    const launchCreateContext = () => {
        if (user) {
            setModalType('create');
            setModalProps({ user });
            toggleModal(true,false)();
        }
    };

    const launchReplyContext = (whisper: any) => {
        setModalType('reply');
        setModalProps({ whisper_to_reply: whisper, user: user });
        toggleModal(true,false)();
    };

    const exitMainContext = () => {
        toggleModal(false,false)();
    };
    return {
        ModifyDismissState,
        exitMainContext,
        launchCreateContext,
        launchReplyContext,
    }
}