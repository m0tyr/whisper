"use client"
import { useState } from 'react';


interface DataReacherProps {
    editableDivHeight: number;
    data: string;
    data_limit: number;
    toclose: any;
    cache: string;
    onUpdateData: (newData: string, type: string) => void;

}
const DataReacherPage = ({ editableDivHeight, data, data_limit, onUpdateData, cache, toclose }: DataReacherProps) => {

    const placeholder: string = `Ecrivez votre ${data.toString()}...`;
    const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.currentTarget.textContent?.length! >= data_limit) {
            event.preventDefault();
        }
    };
    const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
        const pastedText = event.clipboardData.getData('text/plain');
        if (pastedText.length + (event.currentTarget.textContent?.length || 0) > data_limit) {
            event.preventDefault();
        }
    };
    const handleContentChange = () => {
        const inputText = document.getElementById("data") as HTMLElement;
        const textContent = inputText.textContent || "";
        onUpdateData(textContent, data.toString().toLowerCase());
        toclose()
    };
    const UndoContentChange = () => {
        onUpdateData(cache, data.toString().toLowerCase());
        toclose()
    };


    return (


        <div className='fixed left-1/2 top-1/2  transform -translate-x-1/2 -translate-y-[70%] '
            id="editableDiv"
        >
            <div className='flex flex-col'>
                <div className=' flex-row h-10 grid grid-cols-[1fr_max-content_1fr] px-4'>
                    <p className='inline font-light cursor-pointer'><button onClick={UndoContentChange}>Annuler</button></p>
                    <p className='inline font-semibold '>Modifier votre {data}</p>
                    <p className='inline ml-auto font-light text-sky-500 cursor-pointer'> <button onClick={handleContentChange}>Terminé</button></p>
                </div>
                <div
                    className='bg-good-gray p-6 max-h-[calc(100svh - 193px)] min-h-20 w-basic  mx-auto break-words whitespace-pre-wrap 
          select-text	overflow-y-auto overflow-x-auto   rounded-2xl  border-x-[0.2333333px] border-y-[0.2333333px] border-x-border
            border-y-border  '
                    role="textbox"
                    style={{ maxHeight: editableDivHeight / 1.15, textAlign: 'left', }}
                    tabIndex={0}
                    id="editableDiv"
                >
                    <div
                        id="data"
                        placeholder={placeholder}
                        onKeyPress={handleKeyPress}
                        onPaste={handlePaste}
                        className="bg-good-gray text-small-regular  text-white outline-none rounded-md ring-offset-background cursor-text placeholder:text-neutral-400 disabled:cursor-not-allowed disabled:opacity-50"
                        contentEditable
                    >{cache}
                    </div>

                </div>
            </div>
        </div>

    )
}

export default DataReacherPage;