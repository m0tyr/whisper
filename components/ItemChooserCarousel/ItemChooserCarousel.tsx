import { motion } from "framer-motion";
import {
  useRef,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
  Children,
} from "react";

function ItemChooserCarousel({
  children,
  containerRef,
  itemsCarousel,
  setindex,
  index,
}: {
  children: ReactNode;
  containerRef: { width: number; height: number };
  setindex: Dispatch<SetStateAction<number>>;
  itemsCarousel: any;
  index: number;
}) {
  const LayoutContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]); // Store refs for each item
  const [OverflowStories, setOverflowStories] = useState(false);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);
  const [animationContainerValue, setAnimationContainerValue] = useState(
    containerRef.width / 2
  );
  const [scrollValue, setScrollValue] = useState(0);
  const gap = 12; // 12px gap between items

  useEffect(() => {
    if (LayoutContainerRef.current && itemsCarousel.current) {
      const isEnoughToDisplayButtons =
        containerRef.width / 2.13337 > LayoutContainerRef.current.clientWidth;
      setOverflowStories(isEnoughToDisplayButtons);
      setShowLeftButton(index > 0);
      setShowRightButton(index < itemsCarousel?.current?.length - 1);
    }
  }, [animationContainerValue, index]);

// Adjusted function to calculate the dynamic step size
const getCurrentStep = (isScrollingLeft = false) => {
  const currentItem = itemRefs.current[index];
  let adjacentItem;

  if (isScrollingLeft) {
    // Get the previous item when scrolling left
    adjacentItem = itemRefs.current[index - 1];
  } else {
    // Get the next item when scrolling right
    adjacentItem = itemRefs.current[index + 1];
  }

  if (currentItem && adjacentItem) {
    // Calculate the step based on the current and adjacent item's width
    return currentItem.offsetWidth / 2 + adjacentItem.offsetWidth / 2 + gap;
  }

  return 0;
};

const scrollLeft = () => {
  if (index > 0 && LayoutContainerRef.current && itemsCarousel.current) {
    const step = getCurrentStep(true); // Calculate the step for left scroll

    // Log for debugging
    console.log("scrollLeft step:", step, "index:", index);

    // Update scroll index
    setindex(index - 1);

    // Adjust scrollValue and animationContainerValue
    const newScrollValue = scrollValue + step;
    setScrollValue(newScrollValue); // Increment scrollValue to move left
    setAnimationContainerValue(containerRef.width / 2 - newScrollValue); // Update the position

    console.log("scrollLeft newScrollValue:", newScrollValue, "animationContainerValue:", containerRef.width / 2 - newScrollValue);
  }
};

const scrollRight = () => {
  if (index < itemsCarousel.current.length - 1 && LayoutContainerRef.current && itemsCarousel.current) {
    const step = getCurrentStep(); // Calculate the step for right scroll

    // Log for debugging
    console.log("scrollRight step:", step, "index:", index);

    // Update scroll index
    setindex(index + 1);

    // Adjust scrollValue and animationContainerValue
    const newScrollValue = scrollValue - step;
    setScrollValue(newScrollValue); // Decrement scrollValue to move right
    setAnimationContainerValue(containerRef.width / 2 - newScrollValue); // Update the position

    console.log("scrollRight newScrollValue:", newScrollValue, "animationContainerValue:", containerRef.width / 2 - newScrollValue);
  }
};


  useEffect(() => {
    if (LayoutContainerRef.current && itemsCarousel.current) {
      setAnimationContainerValue(
        containerRef.width / 2 -
          (itemRefs.current?.[0]?.offsetWidth || 0) / 2 +
          scrollValue
      );
      setShowLeftButton(index > 0);
      setShowRightButton(index < itemsCarousel?.current?.length - 1);
    }
  }, [containerRef, scrollValue, index]);

  return (
    <>
      {showLeftButton && !OverflowStories && (
        <div className="absolute z-50 left-0 h-14 w-9 cursor-pointer">
          <button
            onClick={scrollLeft}
            className="absolute top-1/2 transform -translate-y-1/2 bg-border shadow-[0_7px_12px_0_rgba(0,0,0,0.3)] text-white ml-1.5 px-1 py-1 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 15 15"
            >
              <path
                fill="none"
                stroke="white"
                strokeLinecap="square"
                d="m8.5 4.5l-3 3l3 3"
              />
            </svg>
          </button>
        </div>
      )}
      {showRightButton && !OverflowStories && (
        <div className="absolute z-50 right-0 h-14 w-9 cursor-pointer">
          <button
            onClick={scrollRight}
            className="absolute z-50 top-1/2 transform -translate-y-1/2 bg-border shadow-[0_7px_12px_0_rgba(0,0,0,0.3)] text-white mr-1.5 px-1 py-1 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 15 15"
            >
              <path
                fill="none"
                stroke="white"
                strokeLinecap="square"
                d="m6.5 10.5l3-3l-3-3"
              />
            </svg>
          </button>
        </div>
      )}
      <div className="z-[49] absolute w-full h-14 bg-[linear-gradient(90deg,rgba(27,27,27,1)_0%,rgba(27,27,27,0.5)_20%,rgba(255,255,255,0)_50%,rgba(27,27,27,0.5)_80%,rgba(27,27,27,1)_100%)]"></div>
      <motion.div
        ref={LayoutContainerRef}
        animate={{ x: animationContainerValue }}
        style={{ x: containerRef.width / 2, scrollBehavior: "smooth" }}
        transition={{
          type: "tween",
          duration: 0.2,
          ease: [0.4, 0, 0.2, 1],
        }}
        className="flex flex-row items-end gap-[10px] hide-scrollbar overflow-visible h-14 w-full"
      >
        {Children.map(children, (child, i) => (
          <div
            className="flex flex-row gap-[12px] justify-center items-center p-1 "
            key={i}
            ref={(el) => {
              itemRefs.current[i] = el;
            }} // Assign refs to each child
          >
            {child}
          </div>
        ))}
      </motion.div>
    </>
  );
}

export default ItemChooserCarousel;
