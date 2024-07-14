'use client';
import CreateWhisper from '@/components/CreateWhisper/CreateWhisper';
import ReplyWhisper from '@/components/ReplyWhisper/ReplyWhisper';
import { Modal } from '@/components/shared/Modal';
import { DISMISS_ABANDON_WHPR_ACTION, DISMISS_ABANDON_WHPR_CONTENT, DISMISS_ABANDON_WHPR_TITLE } from '@/constants/message';
import { WhisperTypes, Whisper_to_Reply } from '@/lib/types/whisper.types';
import { AnimatePresence } from 'framer-motion';
import { createContext, useMemo, ReactNode, useState, MouseEventHandler, useEffect } from 'react';
import { useDialog } from '@/hooks/useDialog';

interface CreateWhisperModalContextDataProps {
  modalType: string | null;
  modalProps: Record<string, any>;
}

const CreateWhisperModalContextData = createContext<CreateWhisperModalContextDataProps>({
  modalType: null,
  modalProps: {},
});

interface CreateWhisperModalContextApiProps {
  toggleModal: (CreatePostStateSetter: boolean, dismiss_state: boolean) => () => void;
  setModalProps: (Prop: any) => void;
  setModalType: (type: WhisperTypes) => void;
  setdismisstate: (state: boolean) => void;
}

const CreateWhisperModalContextApi = createContext<CreateWhisperModalContextApiProps>({
  toggleModal: () => () => { },
  setModalProps: () => { },
  setModalType: () => { },
  setdismisstate: () => { },
});

function CreateWhisperModalContextProvider({ children }: { children: ReactNode }) {
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
    <CreateWhisperModalContextData.Provider value={{ modalType, modalProps }}>
      <CreateWhisperModalContextApi.Provider value={memoizedContextApiValue}>
        <AnimatePresence>
          {showModal && modalType === 'create' && (
            <>
              <Modal OnClickOutsideAction={toggleModal(false, dismissState)} />
              <CreateWhisper />
            </>
          )}
          {showModal && modalType === 'reply' && modalProps.whisper_to_reply && (
            <>
              <Modal OnClickOutsideAction={toggleModal(false, dismissState)} />
              <ReplyWhisper whisper_to_reply={modalProps.whisper_to_reply as Whisper_to_Reply} />
            </>
          )}
        </AnimatePresence>
        {children}
      </CreateWhisperModalContextApi.Provider>
    </CreateWhisperModalContextData.Provider>
  );
}

export { CreateWhisperModalContextData, CreateWhisperModalContextApi, CreateWhisperModalContextProvider };