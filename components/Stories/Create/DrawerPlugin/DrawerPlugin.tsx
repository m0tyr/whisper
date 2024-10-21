import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import GifPlugin from "./GifPlugin/GifPlugin";
import { useQueryFeaturedStickers } from "@/hooks/queries/useQueryFeaturedStickers";

interface DrawerPluginProps {
  storyContainerProperties: {
    width: string | number;
    height: string | number;
  };
  storyProperties: {
    width: number;
    height: number;
  };
  isInWidgetGifContext: boolean;
  isInWidgetBaseContext: boolean;
  setIsInWidgetContext: (value: boolean) => void;
  setIsInWidgetGifContext: (value: boolean) => void;
  setIsInWidgetBaseContext: (value: boolean) => void;
}

const DrawerPlugin: React.FC<DrawerPluginProps> = ({
  storyContainerProperties,
  storyProperties,
  isInWidgetGifContext,
  isInWidgetBaseContext,
  setIsInWidgetContext,
  setIsInWidgetGifContext,
  setIsInWidgetBaseContext,
}) => {
  const [visibleAreaBeforeScroll, setVisibleAreaBeforeScroll] = useState(0);
  const [isExtendedDrawer, setIsExtendedDrawer] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const transformValue = getTranslateYValue(
      drawerRef.current?.style.transform || ""
    );
    if (isDragging) {
      setVisibleAreaBeforeScroll(storyProperties.height - transformValue);
      return;
    }
    if (isExtendedDrawer) {
      setVisibleAreaBeforeScroll(storyProperties.height - 46);
      return;
    } else if (!isExtendedDrawer) {
      setVisibleAreaBeforeScroll(storyProperties.height / 1.66667 - 46);
    }
  }, [isDragging, storyProperties.height, drawerRef.current?.style.transform]);

  const { data, refetch } = useQueryFeaturedStickers();

  const [searchValue, setSearchValue] = useState("");

  const makeGIFSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
  };

  // Helper function to get translateY value from transform style
  function getTranslateYValue(transform: string) {
    const match = transform.match(/translateY\((-?\d+(\.\d+)?)px\)/);
    return match ? parseFloat(match[1]) : 0;
  }

  return (
      <div className="min-h-screen absolute top-0 w-full flex items-center justify-center">
        <div
          className="flex items-center justify-center relative overflow-hidden"
          style={{
            width: storyContainerProperties.width,
            height: storyContainerProperties.height,
          }}
        >
          <div
            style={{
              width: storyContainerProperties.width,
              height: storyContainerProperties.height,
            }}
            className="absolute inset-0 bg-transparent z-[59]"
            onClick={() => {
              setIsExtendedDrawer(false);
              setIsInWidgetContext(false);
              setIsInWidgetGifContext(false);
            }}
          />
          <div
            style={{
              width: storyProperties.width,
              height: storyProperties.height,
            }}
            className="flex relative rounded-lg overflow-hidden"
          >
            <motion.div
              ref={drawerRef}
              initial={{ y: 1000 }}
              animate={{
                y: isExtendedDrawer ? 0 : storyProperties.height / 2.5,
              }}
              exit={{ y: 1200 }}
              drag="y"
              dragConstraints={{
                top: isExtendedDrawer ? 0 : storyProperties.height / 2.5,
                bottom: isExtendedDrawer ? 0 : storyProperties.height / 2.5,
              }}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={(event, info) => {
                setIsDragging(false);
                if (drawerRef.current) {
                  const translateY = getTranslateYValue(
                    drawerRef.current?.style.transform || ""
                  );
                  if (translateY >= storyProperties.height / 1.66667) {
                    setIsInWidgetContext(false);
                    setIsExtendedDrawer(false);
                    setIsInWidgetGifContext(false);
                    return;
                  }
                  if (
                    translateY <= storyProperties.height / 4 &&
                    !isExtendedDrawer
                  ) {
                    setIsExtendedDrawer(true);
                    return;
                  }
                  if (
                    translateY <= storyProperties.height / 2.6667 &&
                    translateY >= storyProperties.height / 7.33337 &&
                    isExtendedDrawer
                  ) {
                    setIsExtendedDrawer(false);
                    return;
                  }
                }
              }}
              transition={{
                duration: 0.475,
                ease: [0.55, 0.79, 0.16, 0.99],
              }}
              style={{
                width: storyProperties.width,
              }}
              className="backdrop-blur-[12px] bg-[#2d2d2d]/60 drawer-shadow flex flex-col flex-grow rounded-t-2xl z-[61] overflow-hidden h-[150%]"
            >
              <div className="flex p-3 items-stretch ">
                <div className="mx-auto w-12 h-1 cursor-grab active:cursor-grabbing flex-shrink-0 rounded-full bg-zinc-300" />
              </div>

              {isInWidgetGifContext && (
                <div
                  style={{
                    width: storyProperties.width,
                    height: "40px",
                  }}
                  className="flex flex-row shadow-xl pr-[6px] bg-[#2d2d2d]"
                >
                  <motion.div
                    whileTap={{ scale: 0.98, opacity: 0.6 }}
                    onClick={() => {
                      setIsInWidgetGifContext(false);
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
                    className={`bg-[#181818] z-[51] px-3 py-1.5 flex w-full h-[35px] rounded-xl border-x-[1px] border-y-[1px] border-x-border border-y-border`}
                  >
                    <input
                      id="search"
                      autoComplete="off"
                      placeholder="Rechercher"
                      type="search"
                      onChange={(e) => makeGIFSearch(e)}
                      className="placeholder:text-[13px] placeholder:font-[150] placeholder:text-white placeholder:opacity-50 w-full h-full outline-none bg-[#181818] font-light text-[13px]"
                    />
                  </label>
                </div>
              )}

              <div className="items-stretch flex flex-col flex-shrink-0 overflow-visible relative align-baseline">
                <div
                  className={`overflow-y-auto ${
                    isInWidgetGifContext ? "flex justify-end" : ""
                  } `}
                  id="style-4"
                  style={{
                    height: isInWidgetGifContext
                      ? visibleAreaBeforeScroll - 23.333337
                      : visibleAreaBeforeScroll,
                  }}
                >
                  {isInWidgetBaseContext && (
                    <>
                      <div className="w-full h-2 bg-transparent"></div>
                      <div className="flex translate-x-0 touch-pan-y">
                        <motion.div className="max-w-md mx-auto gap-4 grid-cols-auto">
                          <div className="flex flex-row justify-center items-center gap-3">
                            <motion.div
                              whileTap={{ scale: 0.97, rotate: "2deg" }}
                              style={{ rotate: "-2deg" }}
                              className="text-[20px] cursor-pointer flex flex-row gap-1 justify-center items-center w-fit rounded-xl bg-white rotate-[3deg] px-1.5 py-0.5 text-black"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                              >
                                <g
                                  fill="none"
                                  stroke="#52489C"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                >
                                  <circle cx="12" cy="10" r="3" />
                                  <path d="M12 2a8 8 0 0 0-8 8c0 1.892.402 3.13 1.5 4.5L12 22l6.5-7.5c1.098-1.37 1.5-2.608 1.5-4.5a8 8 0 0 0-8-8Z" />
                                </g>
                              </svg>
                              <span className="text-[20px]  tracking-tight font-[450] ">
                                LOCALISATION
                              </span>
                            </motion.div>
                            <motion.div
                              whileTap={{ scale: 0.98, rotate: "-3deg" }}
                              style={{ rotate: "3deg" }}
                              className="text-[20px]  cursor-pointer flex flex-row gap-1 justify-center items-center w-fit rounded-[10px] bg-white rotate-[3deg] px-1.5 py-0.5 text-black tracking-tight font-[450]"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                              >
                                <g
                                  fill="none"
                                  stroke="#22C55E"
                                  stroke-width="2"
                                >
                                  <circle cx="12" cy="12" r="4" />
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10c2.252 0 4.33-.744 6.001-2"
                                  />
                                  <path
                                    stroke-linecap="round"
                                    d="M16 8v4c0 1 .6 3 3 3s3-2 3-3"
                                  />
                                </g>
                              </svg>
                              <span className="text-[20px]  tracking-tight font-[450] ">
                                MENTION
                              </span>
                            </motion.div>
                          </div>

                          <div className="flex flex-row justify-center items-center gap-3">
                            <motion.div
                              whileTap={{ scale: 0.98, rotate: "-3deg" }}
                              style={{ rotate: "3deg" }}
                              className="text-[20px]  cursor-pointer flex flex-row gap-1 justify-center items-center w-fit rounded-[10px] bg-white rotate-[3deg] px-1.5 py-0.5 text-black tracking-tight font-[450]"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                              >
                                <g
                                  fill="none"
                                  stroke="#465C69"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                >
                                  <path d="m6.233 5.834l.445-2.226A2 2 0 0 1 8.64 2h6.72a2 2 0 0 1 1.962 1.608l.445 2.226a1.879 1.879 0 0 0 1.387 1.454A3.758 3.758 0 0 1 22 10.934V18a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4v-7.066a3.758 3.758 0 0 1 2.846-3.646a1.879 1.879 0 0 0 1.387-1.454Z" />
                                  <circle cx="12" cy="14" r="4" />
                                  <path d="M11 6h2" />
                                </g>
                              </svg>
                              <span className="text-[20px]  tracking-tight font-[450] ">
                                PHOTO
                              </span>
                            </motion.div>
                            <motion.div
                              whileTap={{ scale: 0.98, rotate: "3deg" }}
                              style={{ rotate: "-3deg" }}
                              className="text-[20px]  cursor-pointer flex flex-row gap-1 justify-center items-center w-fit rounded-[10px] bg-white rotate-[3deg] px-1.5 py-0.5 text-black tracking-tight font-[450]"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                className=" rotate-45"
                              >
                                <path
                                  fill="none"
                                  stroke="#A8201A"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M9 12h6m0-6h1a6 6 0 0 1 0 12h-1m-6 0H8A6 6 0 0 1 8 6h1"
                                />
                              </svg>
                              <span className="text-[20px]  tracking-tight font-[450] ">
                                LIEN
                              </span>
                            </motion.div>
                          </div>
                          <div className="flex flex-row justify-center items-center gap-3">
                            <motion.div
                              whileTap={{ scale: 0.98, rotate: "3deg" }}
                              style={{ rotate: "-4deg" }}
                              className="text-[18px]  cursor-pointer flex flex-row gap-1 justify-center items-center w-fit rounded-[10px] bg-white rotate-[3deg] px-1.5 py-0.5 text-black tracking-tight font-[450]"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="none"
                                  stroke="#ED254E"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M10 3L6 21M18 3l-4 18M4 8h17M3 16h17"
                                />
                              </svg>
                              <span className="text-[18px]  tracking-tight font-[450] ">
                                HASHTAG
                              </span>
                            </motion.div>
                            <motion.div
                              whileTap={{
                                scale: 0.93,
                                rotate: "-2deg",
                                opacity: 0.76667,
                                background:
                                  "linear-gradient(95deg, rgb(153,51,255), rgb(97,87,255))",
                              }}
                              style={{
                                rotate: "1deg",
                                background:
                                  "linear-gradient(45deg, rgb(153,51,255), rgb(97,87,255))",
                                animation: "gradientAnimation 5s ease infinite",
                              }}
                              onClick={() => {
                                setIsInWidgetGifContext(true);
                                setIsInWidgetBaseContext(false);
                              }}
                              className="text-[18px] cursor-pointer w-fit rounded-[10px] px-1.5 py-0.5 text-white tracking-tight font-[450] drop-shadow-glow"
                            >
                              GIF
                            </motion.div>
                          </div>
                        </motion.div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 p-5 translate-x-0 touch-pan-y">
                        {data?.map((src, index) => (
                          <div
                            key={index}
                            className="mt-1.5 w-full h-fit rounded-lg bg-black"
                          >
                            <img
                              className="rounded-lg"
                              src={src}
                              alt={`Image ${index + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="w-full h-2 bg-transparent"></div>
                    </>
                  )}
                  {isInWidgetGifContext && (
                    <GifPlugin
                      width={storyProperties.width}
                      searchValue={searchValue}
                    />
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
  );
};

export default DrawerPlugin;
