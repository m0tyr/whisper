import { MouseEventHandler, useState } from "react";
import { useSessionUser } from "./useSessionUser";

export const useModal = () => {
    const [showModal, setShowModal] = useState(false);
    const [showPopOver, setShowPopOver] = useState(false);
    const [modalType, setModalType] = useState<string | null>(null);
    const [modalProps, setModalProps] = useState<Record<string, any>>({});

    const openPopOver = (isActuallyDismissing: boolean): MouseEventHandler<HTMLDivElement> => {
        return () => {
        if(isActuallyDismissing) {
            setShowModal(!showModal);
            setShowPopOver(!showPopOver)
        }else {
            setShowPopOver(!showPopOver)
        }        
    }
    };
    const toggleModal = (dismiss_state: boolean): any  => {
        return () => {
            setShowModal(!showModal);
            if (dismiss_state && showModal) {
                setShowPopOver(!showPopOver)
            } else{
                setShowModal(!showModal);
            }
            console.log("test")
        };
    };

    return {
        showModal,
        showPopOver,
        modalType,
        setModalType,
        setModalProps,
        modalProps,
        toggleModal,
        openPopOver,
    }
}