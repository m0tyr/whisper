import { motion } from "framer-motion";
import { useState } from "react";
import AutoResizeTextarea from "../AutoResizeTextArea/AutoResizeTextArea";

const StoriesGalleryPlayer = () => {
  const [isPlayerTextAreaExtended, setPlayerTextAreaExtended] = useState(false);
  const extendPlayerTextAreaView = () => {
    setPlayerTextAreaExtended(!isPlayerTextAreaExtended);
  };

  return (
    <>
      <div className=" pt-6 pb-9 px-4">
        <div className=" bg-white w-full h-[2px] rounded-full"></div>
        <div className="pt-3 flex flex-row">
          <div className="flex flex-row gap-0.5">
            <div className=" h-[32px] w-[32px] rounded-full bg-slate-100"></div>
            <div className="flex justify-center items-center tracking-tight font-normal text-[14.25px] pl-2">
              test
            </div>
          </div>
          <div className="flex flex-row gap-6 mr-2.5 ml-auto justify-center items-center">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 384 512"
              >
                <path
                  fill="currentColor"
                  d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80v352c0 17.4 9.4 33.4 24.5 41.9S58.2 482 73 473l288-176c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"
                />
              </svg>
            </div>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 20 20"
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M2.5 7.5a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5Zm15 0a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5Zm-7.274 0a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5Z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-row justify-between items-center pt-9 pb-4 pr-[1.2rem] pl-[1rem] absolute bottom-0">
        <div className="flex grow ">
          <motion.div
            className={`${
              isPlayerTextAreaExtended ? "w-full" : "w-[12.5rem]"
            } min-h-[44px] flex items-center border border-[rgb(240,240,240,0.5)] px-2 rounded-full`}
          >
            <AutoResizeTextarea onFocus={extendPlayerTextAreaView} />
          </motion.div>
        </div>
        {!isPlayerTextAreaExtended && (
          <div className="flex flex-row ml-2.5">
            <motion.div
              whileTap={{ scale: 0.95 }}
              whileHover={{
                backgroundColor: "rgb(34, 34, 34,0.4)",
                scale: 1,
                transition: { duration: 0 },
              }}
              transition={{ duration: 0 }}
              className=" cursor-pointer rounded-full"
            >
              <div className="z-10 h-[42px] inset-0 pointer-events-none flex flex-row gap-1.5 px-2 justify-center items-center">
                <svg
                  width="26"
                  height="26"
                  aria-label="J’aime"
                  role="img"
                  viewBox="0 0 26 22"
                >
                  <title>J’aime</title>
                  <path
                    className={"fill-transparent stroke-[2] stroke-white"}
                    d="M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z"
                  ></path>
                </svg>
              </div>
            </motion.div>
            <motion.div
              whileTap={{ scale: 0.95 }}
              whileHover={{
                backgroundColor: "rgb(34, 34, 34,0.4)",
                scale: 1,
                transition: { duration: 0 },
              }}
              transition={{ duration: 0 }}
              className=" cursor-pointer rounded-full"
            >
              <div className="z-10 h-[42px] inset-0 pointer-events-none flex flex-row gap-1.5 px-2 justify-center items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="m14 10l-3 3m9.288-9.969a.535.535 0 0 1 .68.681l-5.924 16.93a.535.535 0 0 1-.994.04l-3.219-7.242a.534.534 0 0 0-.271-.271l-7.242-3.22a.535.535 0 0 1 .04-.993l16.93-5.925Z"
                  />
                </svg>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
};

export default StoriesGalleryPlayer;
