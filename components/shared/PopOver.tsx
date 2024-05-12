import { motion } from "framer-motion";

const PopOver = ({ title, content, onDismiss, action, onAction }: any) => {
  return (
    <motion.div
    initial={{
        opacity: 0,
        scale: 0.98,
        x: "-50%",
        y: "-50%"
    }}
    animate={{
        opacity: 1,
        scale: 1,
        x: "-50%",
        y: "-50%",
        transition: {
            ease: "easeOut",
            duration: 0.05,
            delay: 0.1
        },
    }}
    exit={{
        opacity: 0,
        scale: 0.95,
        transition: {
            ease: "easeIn",
            duration: 0.05,
            delay: 0.1
        },
    }}
    className=' fixed left-1/2 top-[47.333%] w-[280px] z-[9999] '
    >
    <div className="bg-good-gray flex flex-col justify-center items-center  rounded-2xl  border-[0.2333333px]
    border-border shadow-md w-[280px]">
      <div className="flex flex-col cursor-default">
        <div className=" flex mb-2 pt-5 px-5 justify-center items-center">
          <h2 className="text-lg font-bold ">{title}</h2>
        </div>
        <div className=" flex mb-2 px-5 justify-center items-center text-center">

          <p className="text-md font-light text-[rgb(255,255,255,0.533333)] mb-2">
            {content}
          </p>
        </div>

      </div>
      <div className="flex flex-row select-none w-full border-t border-t-border">
        <motion.div whileTap={{ backgroundColor: "#141414" }} transition={{ duration: .01 }} onClick={onDismiss} className=" cursor-pointer rounded-bl-2xl flex justify-center items-center shrink-0 relative h-14 w-[140px]  border-r border-r-border ">
          <div
            className=" text-white rounded-xl transition-colors"
            
          >
            Annuler
          </div>
        </motion.div>
        <motion.div whileTap={{ backgroundColor: "#141414" }} transition={{ duration: .01 }} onClick={onAction} className=" cursor-pointer rounded-br-2xl flex justify-center items-center shrink-0 relative h-14  w-[140px] ">
          <div
            className="text-red-500  rounded-xl  transition-colors"
            
          >
            {action}
          </div>

        </motion.div>

      </div>
    </div>
    </motion.div>

  );
};

export default PopOver;