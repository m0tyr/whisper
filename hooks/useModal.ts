import { MouseEventHandler, useState } from "react";

export const useModal = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [showDismiss, setDismiss] = useState(false)
    const opendismiss = (isActuallyDismissing: boolean): MouseEventHandler<HTMLDivElement> => {
        return () => {
        if(isActuallyDismissing) {
            setShowPopup(!showPopup);
            setDismiss(!showDismiss)
        }else {
            setDismiss(!showDismiss)
        }        
    }
    };
    const togglePopup = (dismiss_state: boolean): any => {
        return () => {
            console.log(dismiss_state)
            if (dismiss_state && showPopup) {
                setDismiss(!showDismiss);
            } else{
                setShowPopup(!showPopup);
            }
        };
    };
    return {
        togglePopup,
        opendismiss,
        showDismiss,
        showPopup,
        
    }
}