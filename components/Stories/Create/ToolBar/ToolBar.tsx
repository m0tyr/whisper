import { motion } from "framer-motion";

interface ToolBarProps {
  x: number;
  y: number;
}

const ToolBar = ({ x, y }: ToolBarProps) => {
  return (
    <motion.div
      className="w-fit h-full flex flex-row absolute gap-2 justify-center items-center"
      style={{
        position: "absolute",
        transform: `translate(${x}px, ${y}px)`,
      }}
    >
      <motion.div className="w-6 h-6 bg-white rounded-lg"></motion.div>
      <motion.div className="w-6 h-6 bg-white rounded-lg"></motion.div>
      <motion.div className="w-6 h-6 bg-white rounded-lg"></motion.div>
    </motion.div>
  );
};

export default ToolBar;
