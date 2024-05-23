
import { motion } from "framer-motion"


interface Props {
    isFixed: boolean;
}
const PostComposerButton = ({isFixed}: Props) => {
    return (
        <motion.button whileTap={{ scale: 0.96 }}
            id="button"
            type="submit"
            className={` bottom-[22px] text-center items-center justify-center bg-white rounded-3xl py-1 w-[79.5px] h-9 px-3 hover:bg-slate-200 disabled:opacity-20 transition-all duration-150 ${isFixed ? 'absolute right-6 mt-2' : ''}`}
            disabled>
            <span className="font-semibold text-[15px] text-black justify-center items-center">
                Publier
            </span>

        </motion.button>

    )
}


export default PostComposerButton;