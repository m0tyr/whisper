'use client'
import { useState } from "react";
import { Button } from "../ui/button";

const SearchBar = () => {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event: any) => {
        setInputValue(event.target.value);
    };
    const handleClearInput = () => {
        setInputValue('');
      };
    const svgViewBox = inputValue ? '0 0 50 50' : '0 0 48 48';

    return [
        <div className="w-[600px]">
        <div className="w-full flex flex-row">
          <div className={` ${inputValue ? 'w-0' : 'w-3'}`}>
          </div>
          <div className="w-full h-[60px] shadow-xl ">
            <label className={`bg-[rgb(10,10,10)]  px-3 py-3 flex w-full h-[60px] ${inputValue ? 'rounded-t-2xl' : 'rounded-2xl'} outline-1 outline-double outline-[rgba(243,245,247,0.15)]`}>
              <div className="px-2 py-2 flex justify-center items-center mx-auto my-auto" >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox={svgViewBox} width='22px' height='22px' className=" ">
                  <path fill="#706f6f" d="M 20.5 6 C 12.515556 6 6 12.515562 6 20.5 C 6 28.484438 12.515556 35 20.5 35 C 23.773158 35 26.788919 33.893018 29.220703 32.050781 L 38.585938 41.414062 A 2.0002 2.0002 0 1 0 41.414062 38.585938 L 32.050781 29.220703 C 33.893017 26.788918 35 23.773156 35 20.5 C 35 12.515562 28.484444 6 20.5 6 z M 20.5 10 C 26.322685 10 31 14.677319 31 20.5 C 31 23.295711 29.914065 25.820601 28.148438 27.697266 A 2.0002 2.0002 0 0 0 27.701172 28.144531 C 25.824103 29.912403 23.29771 31 20.5 31 C 14.677315 31 10 26.322681 10 20.5 C 10 14.677319 14.677315 10 20.5 10 z" />
                </svg>
              </div>
              <input
                id="search"
                placeholder="Rechercher"
                type="search"
                className=" search-cancel:bg-[url(https://picsum.photos/16/16)] 
                placeholder:text-[15px] placeholder:font-[150] placeholder:text-white placeholder:opacity-50
                 w-full h-full outline-none bg-[rgb(10,10,10)] 
                 font-light text-[15px]"
                onChange={handleInputChange}
                value={inputValue}
              />
              {inputValue && (
                <div className="px-2 py-2 flex justify-center items-center mx-auto cursor-pointer " onClick={handleClearInput}>
                  <svg aria-label="Effacer" role="img" viewBox="0 0 24 24" width='16px' height='16px' className=" fill-[rgb(77,77,77)] opacity-80" >
                    <title>Effacer</title>
                    <path d="M12 0a12 12 0 1 0 12 12A12 12 0 0 0 12 0Zm5.139 16.056a.766.766 0 1 1-1.083 1.083L12 13.083 7.944 17.14a.766.766 0 0 1-1.083-1.083L10.917 12 6.86 7.944a.766.766 0 0 1 1.083-1.083L12 10.917l4.056-4.056a.766.766 0 0 1 1.083 1.083L13.083 12Z">
                    </path>
                  </svg>
                </div>
              )}
            </label>
          </div>
          <div className={` ${inputValue ? 'w-0' : 'w-3'}`}>
          </div>
        </div>
      </div>
    ]
}

export default SearchBar