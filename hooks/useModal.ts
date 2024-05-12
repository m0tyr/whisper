import { MouseEventHandler, useState } from "react";

export const useModal = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [showPopOver, setPopOver] = useState(false)
    const openPopOver = (isActuallyDismissing: boolean): MouseEventHandler<HTMLDivElement> => {
        return () => {
        if(isActuallyDismissing) {
            setShowPopup(!showPopup);
            setPopOver(!showPopOver)
        }else {
            setPopOver(!showPopOver)
        }        
    }
    };
    const togglePopup = (dismiss_state: boolean): any => {
        return () => {
            console.log(dismiss_state)
            if (dismiss_state && showPopup) {
                setPopOver(!showPopOver)
            } else{
                setShowPopup(!showPopup);
            }
        };
    };
    return {
        togglePopup,
        openPopOver,
        showPopOver,
        showPopup,
        
    }
}