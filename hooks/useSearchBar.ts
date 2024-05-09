'use client'
import { useEffect, useRef, useState } from "react";

type SearchResultType = {
    id: string;
    name: string;
    image: string;
    username: string;
    isfollowing: boolean;
};

export const useSearchBar = () => {
    const searchResultsRef = useRef<HTMLDivElement>(null);
    const maindiv = useRef<HTMLDivElement>(null)
    const [inputValue, setInputValue] = useState("");
    const [searchResult, setSearchResult] = useState<SearchResultType[]>([]);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [leftValue, setLeftValue] = useState(0);

    const handleFocus = () => {
        setIsInputFocused(true);
    };
    const SelectedQuery = () => {
        setIsInputFocused(false);
    }

    //On input make a call to db with onsubmit
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, onSubmit: ({ username }: { username: string }) => void) => {
        const value = event.target.value;
        setInputValue(value);
        onSubmit({ username: value });
    };
    //Clear Button
    const handleClearInput = () => {
        setInputValue("");
    };


    //Handling hidding the listbox menu when clicking outside of it
    const handleClickOutside = (event: MouseEvent) => {
        if (
            searchResultsRef.current &&
            !searchResultsRef.current.contains(event.target as Node)
        ) {
            setIsInputFocused(false);
        }
    };
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    //Handling listbox position
    useEffect(() => {
        const default_w = 598
        function handleResize() {
            if (searchResultsRef.current) {
                const newLeftValue = window.innerWidth / 2 - default_w / 2 + 2.8;
                setLeftValue(newLeftValue);
            }
        }
        if (typeof document !== "undefined") {
            if (searchResultsRef.current) {
                const newLeftValue = window.innerWidth / 2 - default_w / 2 + 2.8;
                setLeftValue(newLeftValue);
            }
        }
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return {
        searchResultsRef,
        maindiv,
        inputValue,
        searchResult,
        setSearchResult,
        setIsInputFocused,
        isInputFocused,
        leftValue,
        handleFocus,
        SelectedQuery,
        handleClearInput,
        handleInputChange,
    }
}