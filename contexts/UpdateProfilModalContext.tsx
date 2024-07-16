'use client';
import UpdateProfil from '@/components/UpdateProfil/UpdateProfil';
import { Modal } from '@/components/Modal/Modal';
import { AnimatePresence } from 'framer-motion';
import { createContext, useMemo, ReactNode, useState } from 'react';


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