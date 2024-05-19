'use client';
import CreateWhisper from '@/components/forms/CreateWhisper';
import { Modal } from '@/components/shared/Modal';
import PopOver from '@/components/shared/PopOver';
import { DISMISS_ABANDON_WHPR_ACTION, DISMISS_ABANDON_WHPR_CONTENT, DISMISS_ABANDON_WHPR_TITLE } from '@/constants/message';
import { useCreatePost } from '@/hooks/useCreatePost';
import { useModal } from '@/hooks/useModal';
import { UserObject } from '@/lib/types/user.types';
import { WhisperTypes, Whisper_to_Reply } from '@/lib/types/whisper.types';
import { AnimatePresence } from 'framer-motion';
import { createContext, useMemo, ReactNode, useState, MouseEventHandler, useEffect } from 'react';

interface ModalContextDataProps {
  modalType: string | null;
  modalProps: Record<string, any>;
}

const ModalContextData = createContext<ModalContextDataProps>({
  modalType: null,
  modalProps: {},
});

interface ModalContextApiProps {
  toggleModal: (dismiss_state: boolean) => () => void;
  openPopOver: (isActuallyDismissing: boolean) => React.MouseEventHandler<HTMLDivElement>;
  setModalProps: (Prop: any) => void;
  setModalType: (type: WhisperTypes) => void;
  setdismisstate: (state: boolean) => void;
}

const ModalContextApi = createContext<ModalContextApiProps>({
  toggleModal: () => () => { },
  openPopOver: () => () => { },
  setModalProps: () => { },
  setModalType: () => { },
  setdismisstate: () => { },
});

function ModalContextProvider({ children }: { children: ReactNode }) {
  const [showModal, setShowModal] = useState(false);
  const [showPopOver, setShowPopOver] = useState(false);
  const [modalType, setModalType] = useState<string | null>(null);
  const [modalProps, setModalProps] = useState<Record<string, any>>({});
  const [dismissState, setdismisstate] = useState(false);

  const openPopOver = (isActuallyDismissing: boolean): MouseEventHandler<HTMLDivElement> => {
    return () => {
      if (isActuallyDismissing) {
        setShowModal(!showModal);
        setShowPopOver(!showPopOver)
      } else {
        setShowPopOver(!showPopOver)
      }
    }
  };

  const toggleModal = (dismiss_state: boolean): any => {
    return () => {
      console.log("Toggle Modal", dismiss_state)
      if (dismiss_state && showModal) {
        setShowPopOver(!showPopOver)
      } else {
        setShowModal(!showModal);
      }
    };
  };

  const memoizedContextApiValue = useMemo(
    () => ({
      toggleModal,
      openPopOver,
      setModalProps,
      setModalType,
      setdismisstate
    }),
    []
  );

  return (
    <ModalContextData.Provider value={{ modalType, modalProps }}>
      <ModalContextApi.Provider value={memoizedContextApiValue}>
        <AnimatePresence>
          {showModal && (
            <>
              <Modal OnClickOutsideAction={toggleModal(dismissState)} />
              <CreateWhisper />
              {showPopOver && (
                <>
                  <Modal OnClickOutsideAction={openPopOver(false)} />
                  <PopOver
                    title={DISMISS_ABANDON_WHPR_TITLE}
                    content={DISMISS_ABANDON_WHPR_CONTENT}
                    onDismiss={openPopOver(false)}
                    action={DISMISS_ABANDON_WHPR_ACTION}
                    onAction={openPopOver(true)} />
                </>
              )}
            </>
          )}
        </AnimatePresence>
        {children}
      </ModalContextApi.Provider>
    </ModalContextData.Provider>
  );
}

export { ModalContextData, ModalContextApi, ModalContextProvider };