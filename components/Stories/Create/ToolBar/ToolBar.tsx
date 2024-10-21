import { motion } from "framer-motion";

interface ToolBarProps {
  x: number;
  y: number;
}

const ToolBar = ({ x, y }: ToolBarProps) => {
  return (
    <motion.div
      className="w-fit h-8"
      style={{
        position: "absolute",
        zIndex: 45,
        top: 0,
        left: 0,
        transformOrigin: "left-top",
        transform: `translate(${x}px, ${y + 32}px)`,
      }}
    >
      <div
        style={{
          position: "relative",
          transform: `translate(-50%, -50%)`,
        }}
      >
        <div className="flex flex-row p-[2px] h-[34px] justify-center items-center bg-[#2D2D2D] shadow-[0px_0px_0px_1px_rgba(33,33,36,.04),0px_7px_8px_-4px_rgba(33,33,36,.75)] rounded-2xl">
          <motion.div
            whileHover={{ backgroundColor: "#21212140" }}
            whileTap={{ backgroundColor: "#404040"}}
            transition={{ duration: 0.15 }}
            className="cursor-pointer w-[32px] h-[32px] flex justify-center items-center rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 100 100"
            >
              <path
                id="gisLayerUpload0"
                fill="currentColor"
                fill-opacity="1"
                fill-rule="nonzero"
                stroke="none"
                stroke-dasharray="none"
                stroke-dashoffset="0"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-miterlimit="4"
                stroke-opacity="1"
                stroke-width="7"
                d="M50 5L24.637 30.469H41.34v20.705h17.32V30.469h16.703ZM28.135 37.309a3.5 3.5 0 0 0-2.668 1.234L.832 67.559a3.5 3.5 0 0 0 2.67 5.765l93-.064a3.5 3.5 0 0 0 2.666-5.766L74.59 38.543a3.5 3.5 0 0 0-2.668-1.234H64.66c-.002 2.333-.008 4.666-.008 7h5.649l18.64 21.957l-77.873.052l18.686-22.01h5.586c.002-2.333.003-4.666 0-7zM89.91 78.264l-9.178.007l8.211 9.67l-77.875.053l8.22-9.682l-9.188.008L.832 89.234A3.5 3.5 0 0 0 3.502 95l93-.064a3.5 3.5 0 0 0 2.666-5.766z"
                color="currentColor"
                color-interpolation="sRGB"
                color-rendering="auto"
                display="inline"
                vector-effect="none"
                visibility="visible"
              />
            </svg>
          </motion.div>
          <motion.div
            whileHover={{ backgroundColor: "#21212140" }}
            whileTap={{ backgroundColor: "#404040"}}
            transition={{ duration: 0.15 }}
            className="cursor-pointer w-[32px] h-[32px] flex justify-center items-center rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 100 100"
            >
              <path
                id="gisLayerDownload0"
                fill="currentColor"
                fill-opacity="1"
                fill-rule="nonzero"
                stroke="none"
                stroke-dasharray="none"
                stroke-dashoffset="0"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-miterlimit="4"
                stroke-opacity="1"
                stroke-width="7"
                d="m89.91 78.264l-9.178.007l8.211 9.67l-77.875.053l8.22-9.682l-9.188.008L.832 89.234A3.5 3.5 0 0 0 3.502 95l93-.064a3.5 3.5 0 0 0 2.666-5.766z"
                color="currentColor"
                color-interpolation="sRGB"
                color-rendering="auto"
                display="inline"
                vector-effect="none"
                visibility="visible"
              />
              <path
                id="gisLayerDownload1"
                fill="currentColor"
                fill-opacity="1"
                fill-rule="nonzero"
                stroke="none"
                stroke-dasharray="none"
                stroke-dashoffset="0"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-miterlimit="4"
                stroke-opacity="1"
                stroke-width="7"
                d="M41.34 5v20.705H24.637L50 51.174l25.363-25.469H58.66V5H41.34zm30.912 32.324c-2.317 2.328-4.632 4.658-6.951 6.985h5l18.64 21.957l-77.873.052l18.686-22.01H34.7c-2.317-2.328-4.637-4.65-6.955-6.978a3.5 3.5 0 0 0-2.28 1.213L.833 67.559a3.5 3.5 0 0 0 2.67 5.765l93-.064a3.5 3.5 0 0 0 2.666-5.766L74.59 38.543a3.5 3.5 0 0 0-2.338-1.219z"
                color="currentColor"
                color-interpolation="sRGB"
                color-rendering="auto"
                display="inline"
                vector-effect="none"
                visibility="visible"
              />
            </svg>
          </motion.div>
          <motion.div
            whileHover={{ backgroundColor: "#21212140" }}
            whileTap={{ scale : 0.98 , backgroundColor: "#21212180"}}
            transition={{ duration: 0.15 }}
            className="cursor-pointer w-[32px] h-[32px] flex justify-center items-center rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
            >
              <g fill="none" fill-rule="evenodd">
                <path d="M24 0v24H0V0h24ZM12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036c-.01-.003-.019 0-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.016-.018Zm.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01l-.184-.092Z" />
                <path
                  fill="currentColor"
                  d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2h-1v12a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V7H4a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2h4.558ZM17 7H7v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7Zm-2.72-3H9.72l-.333 1h5.226l-.334-1Z"
                />
              </g>
            </svg>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ToolBar;
