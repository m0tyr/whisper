import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CreatePostContextProps {
  dismisstate: boolean;
  setDismisstate: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreatePostContext = createContext<CreatePostContextProps | undefined>(undefined);

export const CreatePostProvider = ({ children }: { children: ReactNode }) => {
  const [dismisstate, setDismisstate] = useState(false);
  

  return (
    <CreatePostContext.Provider value={{ dismisstate, setDismisstate }}>
      {children}
    </CreatePostContext.Provider>
  );
};

export const useCreatePostContext = () => {
  const context = useContext(CreatePostContext);
  if (!context) {
    throw new Error('useCreatePostContext must be used within a CreatePostProvider');
  }
  return context;
};
