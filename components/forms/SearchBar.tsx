'use client'
import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z, ZodType } from "zod";
import { SearchModel } from "@/lib/actions/user.actions";
import SearchResult from "../shared/SearchResult";
import SearchValue from "../shared/SearchValue";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SearchValidation } from "@/lib/validations/whisper";
import { Suspense } from "react";
import Loader from "../shared/loader/loader";
import { motion } from "framer-motion"
import { useSearchBar } from "@/hooks/useSearchBar";

type SearchResultType = {
  id: string;
  name: string;
  image: string;
  username: string;
  isfollowing: boolean;
};


const SearchBar = () => {
  const {
    searchResultsRef,
    maindiv,
    inputValue,
    searchResult,
    setSearchResult,
    isInputFocused,
    setIsInputFocused,
    leftValue,
    handleFocus,
    SelectedQuery,
    handleClearInput,
    handleInputChange,
  } = useSearchBar()
  const form = useForm<z.infer<typeof SearchValidation>>({
    resolver: zodResolver(SearchValidation),
    defaultValues: {
      username: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof SearchValidation>) => {
    const username = values.username || "";
    const result = await SearchModel(username);
    const filteredResults = result.filter((data) =>
      data.username.toLowerCase().includes(username.toLowerCase())
    );
    setSearchResult(filteredResults);
    setIsInputFocused(true);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} >
        <FormField
          control={useForm<z.infer<typeof SearchValidation>>({
            resolver: zodResolver(SearchValidation),
            defaultValues: { username: "" },
          }).control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl >
                <div className="w-[600px]">
                  <div className="w-full flex flex-row pr-2">
                    <div className={` ${isInputFocused && inputValue ? 'w-0' : 'w-3'}`}></div>
                    <div className="w-full h-[60px] shadow-xl">
                      <label className={`bg-[#181818] px-3 py-3 flex w-full h-[60px] ${isInputFocused && inputValue ? 'rounded-t-2xl' : 'rounded-2xl'} border-x-[1px] border-y-[1px] border-x-border border-y-border`}>
                        <div className="px-2 py-2 flex justify-center items-center mx-auto my-auto">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox={isInputFocused && inputValue ? '0 0 50 50' : '0 0 48 48'} width='22px' height='22px' className="">
                            <path fill="#706f6f" d="M 20.5 6 C 12.515556 6 6 12.515562 6 20.5 C 6 28.484438 12.515556 35 20.5 35 C 23.773158 35 26.788919 33.893018 29.220703 32.050781 L 38.585938 41.414062 A 2.0002 2.0002 0 1 0 41.414062 38.585938 L 32.050781 29.220703 C 33.893017 26.788918 35 23.773156 35 20.5 C 35 12.515562 28.484444 6 20.5 6 z M 20.5 10 C 26.322685 10 31 14.677319 31 20.5 C 31 23.295711 29.914065 25.820601 28.148438 27.697266 A 2.0002 2.0002 0 0 0 27.701172 28.144531 C 25.824103 29.912403 23.29771 31 20.5 31 C 14.677315 31 10 26.322681 10 20.5 C 10 14.677319 14.677315 10 20.5 10 z" />
                          </svg>
                        </div>
                        <input
                          {...field}
                          id="search"
                          autoComplete="off"
                          placeholder="Rechercher"
                          type="search"
                          className="search-cancel:bg-[url(https://picsum.photos/16/16)] placeholder:text-[15px] placeholder:font-[150] placeholder:text-white placeholder:opacity-50 w-full h-full outline-none bg-[#181818] font-light text-[15px] "
                          onChange={(e) => handleInputChange(e, onSubmit)}
                          onFocus={handleFocus}
                          value={inputValue}
                        />
                        {inputValue && (
                          <div className="px-2 py-2 flex justify-center items-center mx-auto cursor-pointer " onClick={handleClearInput}>
                            <svg aria-label="Effacer" role="img" viewBox="0 0 24 24" width='16px' height='16px' className="fill-[rgb(77,77,77)] opacity-80">
                              <title>Effacer</title>
                              <path d="M12 0a12 12 0 1 0 12 12A12 12 0 0 0 12 0Zm5.139 16.056a.766.766 0 1 1-1.083 1.083L12 13.083 7.944 17.14a.766.766 0 0 1-1.083-1.083L10.917 12 6.86 7.944a.766.766 0 0 1 1.083-1.083L12 10.917l4.056-4.056a.766.766 0 0 1 1.083 1.083L13.083 12Z"></path>
                            </svg>
                          </div>
                        )}
                      </label>
                    </div>
                    <div className={` ${isInputFocused && inputValue ? 'w-0' : 'w-3'}`}></div>
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <div
          id="w_main_search"
          ref={maindiv}
          className={`z-[1] absolute top-0 left-0 mr-[-9999px] ${isInputFocused && inputValue ? '' : 'hidden'}`}
          style={{
            transform: `translate(${leftValue}px, 140px)`,
          }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            ref={searchResultsRef}
            className="max-w-[592px] min-w-[592px] 
        flex flex-col items-center max-h-[484px] 
        overflow-x-hidden overflow-y-scroll  
         bg-[#181818]  rounded-b-2xl border-x-[1px] border-b-[1px] border-x-border border-b-border  shadow-xl"
            style={{ scrollbarWidth: 'none' }}>
            <div
              className="flex flex-col transition-all duration-150"
            >
              <ul
                className="max-w-[592px] min-w-[592px]  flex overflow-x-hidden overflow-y-scroll flex-col items-center justify-center transition-all duration-150" style={{ scrollbarWidth: 'none' }}>
                <SearchValue key={`search_value_${inputValue}`} inputValue={inputValue} svgViewBox={isInputFocused && inputValue ? '0 0 50 50' : '0 0 48 48'} onClick={SelectedQuery} />
                {searchResult.map((result, index) => (
                  <SearchResult key={index} id={result.id} name={result.name} username={result.username} isfollowing={result.isfollowing} image={result.image} />
                ))}
              </ul>
            </div>
          </motion.div>
        </div>


      </form>
    </Form>
  );
};

export default SearchBar;