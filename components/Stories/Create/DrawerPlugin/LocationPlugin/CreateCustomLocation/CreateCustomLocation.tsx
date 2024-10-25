import { ModificationValidation } from "@/lib/validations/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { motion } from "framer-motion";

interface CreateCustomLocationProps {}

const CreateCustomLocation: React.FC<CreateCustomLocationProps> = ({}) => {
  return (
    <div className="flex gap-2 relative flex-row bg-white p-2 rounded-lg">
      <div className="flex flex-row gap-2.5">
        <p className="text-[13px] font-semibold tracking-tighter flex justify-center items-center text-border opacity-70">
          Lieu
        </p>
        <div className="flex flex-col py-1.5 gap-1">
          <input
            type="text"
            className="text-white text-[12.5px] inline outline-none border-none p-2 rounded-lg"
          />
        </div>
      </div>
      <motion.div
        whileTap={{
          scale: 0.98,
        }}
        className="flex justify-center text-[11.5px] items-center w-fit rounded-full cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 16 16"
        >
          <path
            fill="black"
            fill-rule="evenodd"
            d="M6.5 12a.502.502 0 0 1-.354-.146l-4-4a.502.502 0 0 1 .708-.708L6.5 10.793l6.646-6.647a.502.502 0 0 1 .708.708l-7 7A.502.502 0 0 1 6.5 12"
          />
        </svg>
      </motion.div>
    </div>
  );
};

export default CreateCustomLocation;
