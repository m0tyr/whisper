import { DialogContext } from "@/contexts/dialog.provider"
import { useContext } from "react"

export const useDialog = () => {
    const { setShowDialog, setDialog } = useContext(DialogContext)

    const CreateGenericDialog = (title: string,content: string, action:string) => {
        setDialog({
            title,
            content,
            action
        })
        setShowDialog(true)
    }
    return {
        CreateGenericDialog
    }
}