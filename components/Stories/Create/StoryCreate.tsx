"use client";

import { motion } from "framer-motion";

const StoryCreate = () => {
  return (
    <div className="absolute left-0 bg-border rounded-lg w-[400px] h-screen">
              <div className=" pt-6 pb-9 px-4">
            <div className=" bg-white w-full h-[2px] rounded-full"></div>
            <div className="pt-3 flex flex-row">
              <div className="flex flex-row gap-0.5">
                <div className=" h-[32px] w-[32px] rounded-full bg-slate-100"></div>
                <motion.div
                whileHover={{opacity: 0.85}}
                  whileTap={{opacity: 0.5}} className=" select-none cursor-pointer z-50 flex justify-center items-center tracking-tight font-normal text-[14.25px] pl-2">
                  myself
                </motion.div>
              </div>
             
            </div>
          </div>

          <div className="w-full flex flex-row justify-between items-center pt-9 pb-4 pr-[1.2rem] pl-[1rem] absolute bottom-0">
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
          </div>
    </div>
  );
};

export default StoryCreate;
