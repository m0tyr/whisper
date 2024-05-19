import { ModalContextApi } from "@/contexts/create_post.provider";
import { useCreateWhisper } from "@/hooks/useCreateWhisper";
import { GetBucketMetricsConfigurationCommand } from "@aws-sdk/client-s3";
import { motion } from "framer-motion"
import { useContext } from "react";

const PostComposerDialog = () => {
    return (
        <div id="editableDiv"
            className='items-center justify-center rounded-b-2xl  
bg-good-gray  border-x-[0.2333333px] border-b-[0.2333333px]  border-x-border border-b-border  w-basic h-20 mx-auto p-4'>

            <motion.button whileTap={{ scale: 0.95 }} transition={{ duration: .01 }}
                id="button"
                type="submit"
                className="absolute right-6 drop-shadow-2xl bottom-[22px] text-center items-center justify-center bg-white rounded-full py-1 w-[79.5px] h-9 px-3 mt-2 hover:bg-slate-200 disabled:opacity-20
transition-all duration-150 " disabled>
                <span className="font-semibold text-[15px] text-black justify-center items-center">
                    Publier
                </span>

            </motion.button>

        </div>
    )
}


export default PostComposerDialog;