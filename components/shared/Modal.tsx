import { DISMISS_ABANDON_WHPR_ACTION, DISMISS_ABANDON_WHPR_CONTENT, DISMISS_ABANDON_WHPR_TITLE } from "@/constants/message"
import { motion } from "framer-motion"
import Dismiss from "./Dismiss"
import dynamic from "next/dynamic"
import { Whisper_to_Reply } from "@/lib/types/whisper.types"
const DynamicCreateWhisper = dynamic(() => import("../forms/CreateWhisper"), {
    ssr: false,
})
const DynamicReplyWhisper = dynamic(() => import("../forms/ReplyWhisper"), {
    ssr: false,
})
interface ModalProps {
    type: string;
    _id?: string;
    user?: {
        id: string;
        username: string;
        name: string;
        bio: string;
        image: string;
    };
    whisper_to_reply?: Whisper_to_Reply;
    togglePopup: any;
    opendismiss: any;
    showDismiss: any;
    showPopup: any;
}

export const Modal = ({ ...props }: ModalProps) => {


    return (
        <>
        {props.type === 'create' && (
            <>
                {props.showDismiss && (
                    <>
                        <motion.div
                            initial={{ opacity: 0, zIndex: 0 }}
                            animate={{ opacity: 1, zIndex: 9999 }}
                            exit={{ opacity: 0 }}
                            transition={{}}
                            id='top'
                            className="fixed top-0 left-0 inset-0 bg-black bg-opacity-75 w-full "
                            onClick={() => props.opendismiss(false)}>
                        </motion.div>
    
                        <Dismiss
                            title={DISMISS_ABANDON_WHPR_TITLE}
                            content={DISMISS_ABANDON_WHPR_CONTENT}
                            onDismiss={props.opendismiss(false)}
                            action={DISMISS_ABANDON_WHPR_ACTION}
                            onAction={props.opendismiss(true)} />
                    </>
                )}
    
                {props.showPopup && (
                    <>
                        <DynamicCreateWhisper
                            user={props.user as any}
                            _id={props._id as string}
                            toclose={props.togglePopup}
                            posting={props.togglePopup(false)} />
                    </>
                )}
            </>
        )}
    
        {props.type === 'reply' && (
            <>
             {props.showDismiss && (
                    <>
                        <motion.div
                            initial={{ opacity: 0, zIndex: 0 }}
                            animate={{ opacity: 1, zIndex: 9999 }}
                            exit={{ opacity: 0 }}
                            transition={{}}
                            id='top'
                            className="fixed top-0 left-0 inset-0 bg-black bg-opacity-75 w-full "
                            onClick={() => props.opendismiss(false)}>
                        </motion.div>
    
                        <Dismiss
                            title={DISMISS_ABANDON_WHPR_TITLE}
                            content={DISMISS_ABANDON_WHPR_CONTENT}
                            onDismiss={props.opendismiss(false)}
                            action={DISMISS_ABANDON_WHPR_ACTION}
                            onAction={props.opendismiss(true)} />
                    </>
                )}
                
                {props.showPopup && (
                    <>
                        <motion.div
                            initial={{ opacity: 0, zIndex: 0 }}
                            animate={{ opacity: 1, zIndex: 51 }}
                            exit={{ opacity: 0 }}
                            transition={{}}
                            id='top'
                            className="fixed top-0 left-0 inset-0 bg-black bg-opacity-75 w-full "
                            onClick={props.togglePopup}>
                        </motion.div>
    
                        <DynamicReplyWhisper
                            whisper_to_reply={props.whisper_to_reply as Whisper_to_Reply}
                            _id={props._id as string}
                            user={props.user as any}
                            toclose={props.togglePopup}
                            posting={props.togglePopup(false)} />
                    </>
                )}
            </>
        )}
    </>

    )
}