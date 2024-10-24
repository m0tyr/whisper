import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

interface Props {
    opendismiss: () => void;
}

const WhisperDropDownAction = ({opendismiss}: Props) => {
    return (
        <DropdownMenu modal={false} >
            <DropdownMenuTrigger className=" cursor-pointer ">
                <motion.div whileTap={{ scale: 0.9 }} transition={{ duration: .01 }} className="ml-2 relative bottom-1.5 left-0  text-sm align-middle group hover:bg-[#6262624c] transition-all duration-100 rounded-full w-8 h-8  flex items-center justify-center">
                    <svg aria-label="Plus" role="img" viewBox="0 0 24 24" className="h-5 w-5" fill="#fff">
                        <title>Plus</title>
                        <circle cx="12" cy="12" r="1.5"></circle>
                        <circle cx="6" cy="12" r="1.5"></circle>
                        <circle cx="18" cy="12" r="1.5"></circle>
                    </svg>


                </motion.div>
            </DropdownMenuTrigger>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, delay: .1 }}
            >
                <DropdownMenuContent   className="w-[170px] mr-3 drop-shadow-xl rounded-2xl bg-[#181818] border-x-[0.2333333px] border-b-[0.2333333px]  border-x-border border-y-border  text-small-semibold !text-[15px]">
                    <DropdownMenuGroup className="text-white text-[14px]">
                        <DropdownMenuItem >
                            Enregistrer
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem>
                            Bloquer
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem className="!text-[rgb(255,48,64)]">
                            Signaler
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem onClick={opendismiss} className="!text-[rgb(255,48,64)]">
                            Supprimer
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </motion.div>
        </DropdownMenu>
    )
}

export default WhisperDropDownAction;