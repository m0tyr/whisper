import { ComposerDialogEditProfileType, DialogContext } from "@/contexts/DialogContext"
import { useContext } from "react"

export const useDialog = () => {
    const { handleActionDialog, setActionDialog, setEditProfileComposerDialog, handleComposerEditProfileDialog } = useContext(DialogContext)

    const CreateComposerEditProfileDialog = (
        editableDivHeight: number,
        composerEditProfileFieldType: string,
        composerProfileCachedData: string,
        composerFieldInputLimit: number,
        onUpdateData: (value: string, type: string) => void,
        triggerCloseDialog: () => void,
    ) => {
        setEditProfileComposerDialog({
            editableDivHeight,
            composerEditProfileFieldType,
            composerProfileCachedData,
            composerFieldInputLimit,
            onUpdateData,
            triggerCloseDialog
        });
        handleComposerEditProfileDialog(true);
    }


    const CreateActionDialog = (
        title: string, 
        content: string, 
        action: string, 
        onAction: () => void
    ) => {
        setActionDialog({
            title,
            content,
            action,
            onAction,
        });
        handleActionDialog(true);
    };
    return {
        CreateComposerEditProfileDialog,
        CreateActionDialog
    }
}