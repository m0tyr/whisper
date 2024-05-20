'use client';
import { Modal } from '@/components/shared/Modal';
import DirectDialog from '@/components/shared/DirectDialog';
import { DISMISS_ABANDON_WHPR_ACTION, DISMISS_ABANDON_WHPR_CONTENT, DISMISS_ABANDON_WHPR_TITLE } from '@/constants/message';
import { AnimatePresence } from 'framer-motion';
import { createContext, useMemo, ReactNode, useState, Dispatch, SetStateAction } from 'react';

export interface DialogGenericType {
    title: string;
    content: string;
    action: string;
    onAction: () => void;
}


const DialogContext = createContext<{
    setShowDialog: (OpenState: boolean) => void;
    setDialog: Dispatch<SetStateAction<DialogGenericType>>;
    ExecuteDialogBehavior: () => void;
}>({
    setShowDialog: () => { },
    setDialog: () => { },
    ExecuteDialogBehavior: () => { },
});


function DialogContextProvider({ children }: { children: ReactNode }) {
    const [dialogstate, revealdialog] = useState(false)
    const [dialog, setDialog] = useState<DialogGenericType>({
        title: '',
        content: '',
        action: '',
        onAction: () => {},
    });
    const setShowDialog = (OpenState: boolean) => {
        revealdialog(OpenState)
    }
    const ExecuteDialogBehavior = () => {
        if (dialog.onAction) {
            dialog.onAction();
        }
        revealdialog(false);
    }
    const memoizedContextApiValue = useMemo(
        () => ({
            setShowDialog,
            setDialog,
            ExecuteDialogBehavior
        }),
        []
    );
    return (
        <DialogContext.Provider value={memoizedContextApiValue}>
            {children}
            <AnimatePresence>
                {dialogstate && (
                    <>
                        <Modal OnClickOutsideAction={() => { setShowDialog(false) }} />
                        <DirectDialog
                            title={dialog.title}
                            content={dialog.content}
                            onDismiss={() => { setShowDialog(false) }}
                            action={dialog.action}
                            onAction={() => {ExecuteDialogBehavior()}}
                        />
                    </>
                )}
            </AnimatePresence>
        </DialogContext.Provider>
    );
}

export { DialogContext, DialogContextProvider };