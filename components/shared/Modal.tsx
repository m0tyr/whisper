import { motion } from 'framer-motion';
import React from 'react';

interface ModalProps {
  OnClickOutsideAction: any;
}

export const Modal = ({ OnClickOutsideAction }: ModalProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, zIndex: 0 }}
      animate={{ opacity: 1, zIndex: 51 }}
      exit={{
        opacity: 0,
        transition: {
          ease: "easeIn",
          duration: 0.035,
          delay: 0.05
        },
      }}
      className="fixed top-0 left-0 inset-0 bg-black bg-opacity-75 w-full"
      onClick={OnClickOutsideAction}
    />
  );
};