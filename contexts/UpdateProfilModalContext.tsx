'use client';
import UpdateProfil from '@/components/forms/UpdateProfil';
import ReplyWhisper from '@/components/forms/ReplyWhisper/ReplyWhisper';
import { Modal } from '@/components/shared/Modal';
import { DISMISS_ABANDON_WHPR_ACTION, DISMISS_ABANDON_WHPR_CONTENT, DISMISS_ABANDON_WHPR_TITLE } from '@/constants/message';
import { WhisperTypes, Whisper_to_Reply } from '@/lib/types/whisper.types';
import { AnimatePresence } from 'framer-motion';
import { createContext, useMemo, ReactNode, useState, MouseEventHandler, useEffect } from 'react';


interface UpdateProfilModalContextApiProps {
  toggleModalV2: (CreatePostStateSetter: boolean, dismiss_state: boolean) => () => void;
}

const UpdateProfilModalContextApi = createContext<UpdateProfilModalContextApiProps>({
  toggleModalV2: () => () => { },
});

function UpdateProfilModalContextProvider({ children }: { children: ReactNode }) {
  const [showModal, setShowModal] = useState(false);
  const toggleModalV2 = (CreatePostStateSetter: boolean, dismiss_state: boolean): any => {
    return () => {
        // conditionally make the dismiss state available
        setShowModal(CreatePostStateSetter);
    };
  };

  const memoizedContextApiValue = useMemo(
    () => ({
      toggleModalV2,
    }),
    []
  );

  return (
      <UpdateProfilModalContextApi.Provider value={memoizedContextApiValue}>
        <AnimatePresence>
          {showModal && (
            <>
              <Modal OnClickOutsideAction={toggleModalV2(false, false)} />
              <UpdateProfil />
            </>
          )}
        </AnimatePresence>
        {children}
      </UpdateProfilModalContextApi.Provider>
  );
}

export { UpdateProfilModalContextApi, UpdateProfilModalContextProvider };