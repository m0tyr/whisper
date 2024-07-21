"use client";
import { Modal } from "@/components/Modal/Modal";
import DataReacher from "@/components/shared/DataReacher";
import DirectDialog from "@/components/shared/DirectDialog";
import { AnimatePresence } from "framer-motion";
import {
  createContext,
  useMemo,
  ReactNode,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

export interface ActionDialogType {
  title: string;
  content: string;
  action: string;
  onAction: () => void;
}

export interface ComposerDialogGenericType {
  editableDivHeight: number;
  composerFieldInputLimit: number;
  onUpdateData: (value: string, type: string) => void;
  triggerCloseDialog: () => void;
}

export interface ComposerDialogEditProfileType
  extends ComposerDialogGenericType {
  composerEditProfileFieldType: string;
  composerProfileCachedData: string;
}

const DialogContext = createContext<{
  handleActionDialog: (OpenState: boolean) => void;
  handleComposerEditProfileDialog: (OpenState: boolean) => void;
  setEditProfileComposerDialog: Dispatch<
    SetStateAction<ComposerDialogEditProfileType>
  >;
  setActionDialog: Dispatch<SetStateAction<ActionDialogType>>;
  ExecuteDialogBehavior: () => void;
}>({
  handleActionDialog: () => {},
  handleComposerEditProfileDialog: () => {},
  setEditProfileComposerDialog: () => {},
  setActionDialog: () => {},
  ExecuteDialogBehavior: () => {},
});

function DialogContextProvider({ children }: { children: ReactNode }) {
  const [ActionDialogState, setActionDialogState] = useState(false);
  const [ComposerDialogState, SetComposerDialogState] = useState(false);
  const [ActionDialog, setActionDialog] = useState<ActionDialogType>({
    title: "",
    content: "",
    action: "",
    onAction: () => {},
  });
  const [EditProfileComposerDialog, setEditProfileComposerDialog] =
    useState<ComposerDialogEditProfileType>({
      editableDivHeight: 0,
      composerFieldInputLimit: 0,
      composerEditProfileFieldType: "",
      composerProfileCachedData: "",
      onUpdateData: (value: string, type: string) => {},
      triggerCloseDialog: () => {},
    });

  const handleActionDialog = (OpenState: boolean) => {
    setActionDialogState(OpenState);
  };

  const handleComposerEditProfileDialog = (OpenState: boolean) => {
    SetComposerDialogState(OpenState);
  };

  const ExecuteDialogBehavior = () => {
    if (ActionDialog.onAction) {
      ActionDialog.onAction();
    }
    setActionDialogState(false);
  };

  const memoizedContextApiValue = useMemo(
    () => ({
      handleActionDialog,
      setActionDialog,
      setEditProfileComposerDialog,
      handleComposerEditProfileDialog,
      ExecuteDialogBehavior,
    }),
    []
  );
  return (
    <DialogContext.Provider value={memoizedContextApiValue}>
      {children}
      <AnimatePresence>
        {ComposerDialogState && (
          <>
            <Modal
              OnClickOutsideAction={() => {
                handleComposerEditProfileDialog(false);
              }}
            />
            <DataReacher
              editableDivHeight={EditProfileComposerDialog.editableDivHeight}
              composerEditProfileFieldType={
                EditProfileComposerDialog.composerEditProfileFieldType
              }
              composerFieldInputLimit={
                EditProfileComposerDialog.composerFieldInputLimit
              }
              composerProfileCachedData={
                EditProfileComposerDialog.composerProfileCachedData
              }
              onUpdateData={EditProfileComposerDialog.onUpdateData}
              triggerCloseDialog={EditProfileComposerDialog.triggerCloseDialog}
            />
          </>
        )}
        {ActionDialogState && (
          <>
            <Modal
              OnClickOutsideAction={() => {
                handleActionDialog(false);
              }}
            />
            <DirectDialog
              title={ActionDialog.title}
              content={ActionDialog.content}
              onDismiss={() => {
                handleActionDialog(false);
              }}
              action={ActionDialog.action}
              onAction={() => {
                ExecuteDialogBehavior();
              }}
            />
          </>
        )}
      </AnimatePresence>
    </DialogContext.Provider>
  );
}

export { DialogContext, DialogContextProvider };
