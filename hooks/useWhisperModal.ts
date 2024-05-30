import { MouseEventHandler, useContext, useState } from "react";
import { useSessionUser } from "./useSessionUser";
import { CreateWhisperModalContextApi } from "@/contexts/CreateWhisperModalContext";
import { UpdateProfilModalContextApi } from "@/contexts/UpdateProfilModalContext";

export const useWhisperModal = () => {
    const { setdismisstate, setModalProps, setModalType, toggleModal } = useContext(CreateWhisperModalContextApi);
    const { toggleModalV2 } = useContext(UpdateProfilModalContextApi) 
    const [user] = useSessionUser()

    const ModifyDismissState = (state: boolean) => {
        setdismisstate(state)
    }
    const lauchUpdateProfilContext = () => {
        if (user) {
            toggleModalV2(true,false)();
        }
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
    // exit all the modalcontext need to work on use a hub of modal
    const exitMainContext = () => {
        toggleModal(false,false)();
        toggleModalV2(false,false)();
    };
    return {
        ModifyDismissState,
        exitMainContext,
        launchCreateContext,
        launchReplyContext,
        lauchUpdateProfilContext
    }
}