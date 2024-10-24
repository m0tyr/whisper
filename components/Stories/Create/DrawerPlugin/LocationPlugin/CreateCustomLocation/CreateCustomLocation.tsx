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
    <div className="flex flex--col">
      <div className="flex flex-row gap-0.5">
        <p className="text-[13px] font-semibold tracking-tighter flex justify-center items-center opacity-70">
          Lieu
        </p>
        <div className="flex flex-col py-1.5 gap-1">
          <input
            type="text"
            className="text-white text-[12.5px] inline outline-none border-none p-2 rounded-lg"
          />
        </div>
      </div>
      <motion.div className="flex justify-start text-[11.5px] items-start w-fit rounded-lg cursor-pointer">
        <span className=" tracking-tighter text-[12px] inline select-none">
          valider
        </span>
      </motion.div>
    </div>
  );
};

export default CreateCustomLocation;
