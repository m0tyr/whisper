'use client';
import CreateWhisper from '@/components/forms/CreateWhisper';
import ReplyWhisper from '@/components/forms/ReplyWhisper';
import { Modal } from '@/components/shared/Modal';
import DirectDialog from '@/components/shared/DirectDialog';
import { DISMISS_ABANDON_WHPR_ACTION, DISMISS_ABANDON_WHPR_CONTENT, DISMISS_ABANDON_WHPR_TITLE } from '@/constants/message';
import { useCreatePost } from '@/hooks/useCreatePost';
import { UserObject } from '@/lib/types/user.types';
import { WhisperTypes, Whisper_to_Reply } from '@/lib/types/whisper.types';
import { AnimatePresence } from 'framer-motion';
import { createContext, useMemo, ReactNode, useState, MouseEventHandler, useEffect } from 'react';
import { useDialog } from '@/hooks/useDialog';

interface CreateWhisperContextDataProps {
  modalType: string | null;
  modalProps: Record<string, any>;
}

const CreateWhisperContextData = createContext<CreateWhisperContextDataProps>({
  modalType: null,
  modalProps: {},
});

interface CreateWhisperContextApiProps {
  toggleModal: (CreatePostStateSetter: boolean, dismiss_state: boolean) => () => void;
  setModalProps: (Prop: any) => void;
  setModalType: (type: WhisperTypes) => void;
  setdismisstate: (state: boolean) => void;
}

const CreateWhisperContextApi = createContext<CreateWhisperContextApiProps>({
  toggleModal: () => () => { },
  setModalProps: () => { },
  setModalType: () => { },
  setdismisstate: () => { },
});

function CreateWhisperContextProvider({ children }: { children: ReactNode }) {
  const { CreateGenericDialog } = useDialog()
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<string | null>(null);
  const [modalProps, setModalProps] = useState<Record<string, any>>({});
  const [dismissState, setdismisstate] = useState(false);

  const toggleModal = (CreatePostStateSetter: boolean, dismiss_state: boolean): any => {
    return () => {
      if (dismiss_state && showModal) {
        CreateGenericDialog(
          DISMISS_ABANDON_WHPR_TITLE,
          DISMISS_ABANDON_WHPR_CONTENT,
          DISMISS_ABANDON_WHPR_ACTION,
          toggleModal(false,false)
        )
      } else {
        setdismisstate(false)
        setShowModal(CreatePostStateSetter);
      }
    };
  };

  const memoizedContextApiValue = useMemo(
    () => ({
      toggleModal,
      setModalProps,
      setModalType,
      setdismisstate
    }),
    []
  );

  return (
    <CreateWhisperContextData.Provider value={{ modalType, modalProps }}>
      <CreateWhisperContextApi.Provider value={memoizedContextApiValue}>
        <AnimatePresence>
          {showModal && modalType === 'create' && (
            <>
              <Modal OnClickOutsideAction={toggleModal(false, dismissState)} />
              <CreateWhisper />
            </>
          )}
          {showModal && modalType === 'reply' && (
            <>
              <Modal OnClickOutsideAction={toggleModal(false, dismissState)} />
              <ReplyWhisper whisper_to_reply={modalProps.whisper_to_reply as Whisper_to_Reply} />
            </>
          )}
        </AnimatePresence>
        {children}
      </CreateWhisperContextApi.Provider>
    </CreateWhisperContextData.Provider>
  );
}

export { CreateWhisperContextData, CreateWhisperContextApi, CreateWhisperContextProvider };