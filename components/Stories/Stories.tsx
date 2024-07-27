"use client";
import { useRef } from "react";
import StoryRing from "./StoryRing";

const Stories = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: -containerRef.current.clientWidth * 0.8,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: containerRef.current.clientWidth * 0.8,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      <div className="w-full h-24 px-6 py-4 mb-4 relative overflow-hidden">
        {/* Buttons */}
        <button 
          onClick={scrollLeft} 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-500 text-white p-2 rounded-full shadow-lg hover:bg-gray-600"
        >
          &lt;
        </button>
        <button 
          onClick={scrollRight} 
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-500 text-white p-2 rounded-full shadow-lg hover:bg-gray-600"
        >
          &gt;
        </button>
        
        <div 
          ref={containerRef} 
          className="flex flex-row gap-[25px] overflow-x-auto no-scrollbar"
        >
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-2 justify-center items-center">
              <div className="flex relative">
                <StoryRing />
                <img
                  src="/profil.png"
                  alt="profile_icon"
                  width={56}
                  height={56}
                  className="rounded-full"
                />
              </div>
              <div className="text-[13px] max-w-[64px] text-ellipsis whitespace-nowrap overflow-hidden">
                {index % 2 === 0 ? 'tesaefaefaefaft' : 'configured'}
              </div>
            </div>
          ))}
        </div>
      </div>
      <hr className="border-x-2 border-border rounded-full" />
    </>
  );
};

export default Stories;