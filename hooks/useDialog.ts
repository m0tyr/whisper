import { DialogContext } from "@/contexts/DialogContext"
import { useContext } from "react"

export const useDialog = () => {
    const { setShowDialog, setDialog } = useContext(DialogContext)

    const CreateGenericDialog = (
        title: string, 
        content: string, 
        action: string, 
        onAction: () => void
    ) => {
        setDialog({
            title,
            content,
            action,
            onAction,
        });
        setShowDialog(true);
    };
    return {
        CreateGenericDialog
    }
}