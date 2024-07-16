import Link from "next/link";

interface Props {
    inputValue: string;
    svgViewBox: string;
    onClick : any;
}

const SearchValue = ({ inputValue, svgViewBox, onClick }: Props) => {
    return (
        <li key={`search_value_${inputValue}`} onClick={onClick}>
            <div className="w-full mx-0 my-0 px-0 py-0 overflow-hidden flex items-center relative">
                <Link href={`/search?q=${inputValue}`} className="w-full relative flex-shrink-0 basis-auto inline-block z-0 mx-0 my-0 px-0 py-0">
                    <div className=" flex flex-nowrap items-center mb--[6px] mt--5 mx--[6px]">
                        <div className=" min-w-0 flex flex-shrink flex-col relative z-0 flex-grow px-[6px] py-[6px] box-border basis-0 max-w-full">

                            <div className="relative right-1.5 w-[592px] h-[50px] flex justify-center items-center flex-row flex-grow ">
                                <div className="px-[22px] py-[23px] block" >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox={svgViewBox} width='22px' height='22px' className=" ">
                                        <path fill="#706f6f" d="M 20.5 6 C 12.515556 6 6 12.515562 6 20.5 C 6 28.484438 12.515556 35 20.5 35 C 23.773158 35 26.788919 33.893018 29.220703 32.050781 L 38.585938 41.414062 A 2.0002 2.0002 0 1 0 41.414062 38.585938 L 32.050781 29.220703 C 33.893017 26.788918 35 23.773156 35 20.5 C 35 12.515562 28.484444 6 20.5 6 z M 20.5 10 C 26.322685 10 31 14.677319 31 20.5 C 31 23.295711 29.914065 25.820601 28.148438 27.697266 A 2.0002 2.0002 0 0 0 27.701172 28.144531 C 25.824103 29.912403 23.29771 31 20.5 31 C 14.677315 31 10 26.322681 10 20.5 C 10 14.677319 14.677315 10 20.5 10 z" />
                                    </svg>
                                </div>
                                <div className="py-4 px-4  h-[62px] border-solid border-b border-b-border content-center pl-0 flex flex-grow justify-between items-center">
                                    <span
                                        className="flex-shrink-0 max-w-[94%] text-left overflow-x-visible overflow-y-visible min-w-0 font-semibold text-[15px] whitespace-pre-line"
                                        style={{ wordBreak: 'break-word' }}
                                    >
                                        Rechercher « {inputValue} »
                                    </span>
                                    <div className="pr-[2.7px] flex justify-center">
                                        <span className="inline-block">
                                            <svg version="1.1" id="icons_1_" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 128 128" width={18} height={18} className="fill-[rgb(77,77,77)] stroke-2 relative block">
                                                <g id="row1_1_">
                                                    <g id="_x31__3_">
                                                        <path className="stroke-2" d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64 64-28.7 64-64S99.3 0 64 0zm0 121.6C32.2 121.6 6.4 95.8 6.4 64S32.2 6.4 64 6.4s57.6 25.8 57.6 57.6-25.8 57.6-57.6 57.6zM49.2 38.4 73.6 64 49.2 89.6h13.5L86.4 64 62.7 38.4H49.2z" id="_x32__2_" />
                                                    </g>
                                                </g>
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        </li>
    )


}
export default SearchValue