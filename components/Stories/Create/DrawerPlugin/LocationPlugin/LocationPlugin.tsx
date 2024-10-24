import React from "react";
import { motion } from "framer-motion";
import CreateCustomLocation from "./CreateCustomLocation/CreateCustomLocation";

interface LocationPluginProps {
  storyProperties: {
    width: number;
    height: number;
  };
  setIsInAddingLocationContext: (value: boolean) => void;
  setIsInWidgetBaseContext: (value: boolean) => void;
}

const LocationPlugin: React.FC<LocationPluginProps> = ({
  storyProperties,
  setIsInAddingLocationContext,
  setIsInWidgetBaseContext,
}) => {
  return (
    <div
      className="z-62 overflow-hidden"
      style={{
        width: storyProperties.width,
        height: storyProperties.height,
      }}
    >
      <motion.div
        initial={{ x: storyProperties.width / 2, opacity: 0, zIndex: 62 }}
        animate={{ x: 0, opacity: 1, zIndex: 62 }}
        exit={{
          x: storyProperties.width,
          opacity: 0,
          zIndex: 62,
        }}
        transition={{
          duration: 0.275,
          ease: [0.55, 0.79, 0.16, 0.99],
        }}
        style={{
          width: storyProperties.width,
          height: storyProperties.height,
        }}
        className=" flex relative rounded-lg w-full bg-border"
      >
        <div className="flex flex-col absolute top-4 w-full  h-full z-62 bg-border">
          <div
            style={{
              width: storyProperties.width,
              height: "40px",
            }}
            className="flex flex-row pr-[6px] bg-border"
          >
            <motion.div
              whileTap={{ scale: 0.98, opacity: 0.6 }}
              onClick={() => {
                setIsInAddingLocationContext(false);
                setIsInWidgetBaseContext(true);
              }}
              className="flex justify-center items-center ml-2 mr-1 py-1 rounded-full hover:opacity-80 cursor-pointer h-[35px]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 20 20"
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M7.222 9.897c2.3-2.307 4.548-4.559 6.744-6.754a.65.65 0 0 0 0-.896c-.311-.346-.803-.316-1.027-.08c-2.276 2.282-4.657 4.667-7.143 7.156c-.197.162-.296.354-.296.574c0 .221.099.418.296.592l7.483 7.306a.749.749 0 0 0 1.044-.029c.358-.359.22-.713.058-.881a3407.721 3407.721 0 0 1-7.16-6.988Z"
                />
              </svg>
            </motion.div>
            <label
              className={`bg-[#181818] z-[62] px-3 py-1.5 flex w-full h-[35px] rounded-xl border-x-[1px] border-y-[1px] border-x-border border-y-border`}
            >
              <input
                id="search"
                autoComplete="off"
                placeholder="Rechercher un lieu"
                type="search"
                className="placeholder:text-[13px] placeholder:font-[150] placeholder:text-white placeholder:opacity-50 w-full h-full outline-none bg-[#181818] font-light text-[13px]"
              />
            </label>
          </div>
          <div
            className={`w-[${
              storyProperties.width / 2
            }] flex justify-center items-center mt-0.5 cursor-pointer`}
          >
            <motion.div
              className="flex justify-center items-center bg-white rounded-lg pr-1"
              whileTap={{
                scale: 0.98,
              }}
            >
              <div className="w-[22px] h-[22px]  flex justify-center items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="#181818"
                    stroke-linecap="square"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v12m6-6H6"
                  />
                </svg>
              </div>
              <span className=" tracking-tighter font-semibold text-[12px] text-black select-none mb-[1.5px] mr-[1.5px]">
                Créer une localisation personnalisé
              </span>
            </motion.div>
          </div>
          <div className="flex justify-center items-center p-5">
            <CreateCustomLocation />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LocationPlugin;
