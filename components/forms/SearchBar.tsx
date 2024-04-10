'use client'
import { useState } from "react";
import { Button } from "../ui/button";
import SearchResult from "../shared/SearchResult";
import SearchValue from "../shared/SearchValue"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"; import { zodResolver } from "@hookform/resolvers/zod";
import { SearchValidation } from "@/lib/validations/whisper";
import { z } from "zod";
import { FieldValues, useForm } from "react-hook-form";
import { SearchModel } from "@/lib/actions/user.actions";

type SearchResultType = { name: string, image:string, username: string, isfollowing: boolean };

const SearchBar = () => {
  const [inputValue, setInputValue] = useState('');
  const [searchResult, setSearchResult] = useState<SearchResultType[]>([]); 

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event?.target.value);
    onSubmit({ username: inputValue });
  };
  const handleClearInput = () => {
    setInputValue('');
  };
  const svgViewBox = inputValue ? '0 0 50 50' : '0 0 48 48';
  let sampledata = [
    { name: "John Doe", username: "johndoe1", isfollowing: false },
    { name: "Jane Doe", username: "janedoe1", isfollowing: false },
    { name: "Bob Smith", username: "bobsmith1", isfollowing: false },
    { name: "Alice Johnson", username: "alicejohnson1", isfollowing: false },
    { name: "Charlie Brown", username: "charliebrown1", isfollowing: false },
    { name: "Emma White", username: "emmawhite1", isfollowing: false },
    { name: "Frank Black", username: "frankblack1", isfollowing: false },
    { name: "Grace Green", username: "gracegreen1", isfollowing: false },
    { name: "Harry Red", username: "harryred1", isfollowing: false },
    { name: "Ivy Blue", username: "ivyblue1", isfollowing: false },
    { name: "Jack Yellow", username: "jackyellow1", isfollowing: false },
    { name: "Kate Pink", username: "katepink1", isfollowing: false },
    { name: "Leo Purple", username: "leopurple1", isfollowing: false },
    { name: "Mia Grey", username: "miagrey1", isfollowing: false },
    { name: "Noah Brown", username: "noahbrown1", isfollowing: false },
    { name: "Olivia Green", username: "oliviagreen1", isfollowing: false },
    { name: "Peter Black", username: "peterblack1", isfollowing: false },
    { name: "Quinn White", username: "quinnwhite1", isfollowing: false },
    { name: "Robert Red", username: "robertred1", isfollowing: false },
    { name: "Sophia Blue", username: "sophiablue1", isfollowing: false },
    { name: "Thomas Yellow", username: "thomasyellow1", isfollowing: false },
    { name: "Uma Purple", username: "umapurple1", isfollowing: false },
    { name: "Victor Grey", username: "victorgrey1", isfollowing: false },
    { name: "Wendy Brown", username: "wendybrown1", isfollowing: false },
    { name: "Xavier Green", username: "xaviergreen1", isfollowing: false },
    { name: "Yara Black", username: "yarablack1", isfollowing: false },
    { name: "Zoe White", username: "zoewhite1", isfollowing: false },
    { name: "Alan Red", username: "alanred1", isfollowing: false },
    { name: "Bella Blue", username: "bellablue1", isfollowing: false },
    { name: "Chloe Yellow", username: "chloeyellow1", isfollowing: false },
    { name: "Daniel Purple", username: "danielpurple1", isfollowing: false },
    { name: "Ella Grey", username: "ellagrey1", isfollowing: false },
    { name: "Finn Brown", username: "finnbrown1", isfollowing: false },
    { name: "Grace Green", username: "gracegreen1", isfollowing: false },
    { name: "Hannah Black", username: "hannahblack1", isfollowing: false },
    { name: "Isabella White", username: "isabellawhite1", isfollowing: false },
    { name: "Jackson Red", username: "jacksonred1", isfollowing: false },
    { name: "Kimberly Blue", username: "kimberlyblue1", isfollowing: false },
    { name: "Liam Yellow", username: "liamyellow1", isfollowing: false },
    { name: "Mason Purple", username: "masonpurple1", isfollowing: false },
    { name: "Nora Grey", username: "noragrey1", isfollowing: false },
    { name: "Oliver Brown", username: "oliverbrown1", isfollowing: false },
    { name: "Penelope Green", username: "penelopegreen1", isfollowing: false }
  ];
  const form = useForm<z.infer<typeof SearchValidation>>({
    resolver: zodResolver(SearchValidation),
    defaultValues: {
      username: "",
    },
  });
  async function onSubmit(values: z.infer<typeof SearchValidation>) {
    console.log("Search values:", values);
  
      const username = values?.username || ''; 
      const resultat = await SearchModel(username) 
      const results = resultat.filter((data) =>
        data.username.toLowerCase().includes(username.toLowerCase())
      );
    setSearchResult(results);
    console.log(results)
  }
  return [
    <>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="username"
            render={({ field }: { field: FieldValues }) => (
              <FormItem>
                <FormControl className="outline-none">
                  <div className="w-[600px]">
                    <div className="w-full flex flex-row">
                      <div className={`transition-all duration-[20ms] ${inputValue ? 'w-0' : 'w-3'}`}></div>
                      <div className="w-full h-[60px] shadow-xl ">
                        <label className={`bg-[rgb(10,10,10)] transition-all duration-[20ms] px-3 py-3 flex w-full h-[60px] ${inputValue ? 'rounded-t-2xl' : 'rounded-2xl'} border-x-[1px] border-y-[1px] border-x-border border-y-border`}>
                          <div className="px-2 py-2 flex justify-center items-center mx-auto my-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox={svgViewBox} width='22px' height='22px' className="">
                              <path fill="#706f6f" d="M 20.5 6 C 12.515556 6 6 12.515562 6 20.5 C 6 28.484438 12.515556 35 20.5 35 C 23.773158 35 26.788919 33.893018 29.220703 32.050781 L 38.585938 41.414062 A 2.0002 2.0002 0 1 0 41.414062 38.585938 L 32.050781 29.220703 C 33.893017 26.788918 35 23.773156 35 20.5 C 35 12.515562 28.484444 6 20.5 6 z M 20.5 10 C 26.322685 10 31 14.677319 31 20.5 C 31 23.295711 29.914065 25.820601 28.148438 27.697266 A 2.0002 2.0002 0 0 0 27.701172 28.144531 C 25.824103 29.912403 23.29771 31 20.5 31 C 14.677315 31 10 26.322681 10 20.5 C 10 14.677319 14.677315 10 20.5 10 z" />
                            </svg>
                          </div>
                          <input
                            {...field}
                            id="search"
                            placeholder="Rechercher"
                            type="search"
                            className="search-cancel:bg-[url(https://picsum.photos/16/16)] placeholder:text-[15px] placeholder:font-[150] placeholder:text-white placeholder:opacity-50 w-full h-full outline-none bg-[rgb(10,10,10)] font-light text-[15px]"
                            onChange={handleInputChange}
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
                      <div className={`transition-all duration-[20ms] ${inputValue ? 'w-0' : 'w-3'}`}></div>
                    </div>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
      {inputValue && (

        <div
          className="max-w-[600px] min-w-[600px] 
        flex flex-col items-center max-h-[484px] 
        overflow-x-hidden overflow-y-scroll
         bg-[rgb(10,10,10)]  rounded-b-2xl border-x-[1px] border-b-[1px] border-x-border border-b-border  shadow-xl"
          style={{ scrollbarWidth: 'none' }}>
          <div className="flex flex-col">
            <ul className="max-w-[600px] min-w-[600px] flex overflow-x-hidden overflow-y-scroll flex-col items-center justify-center " style={{ scrollbarWidth: 'none' }}>
              <SearchValue inputValue={inputValue} svgViewBox={svgViewBox} />
              {searchResult.map((result, index) => (
                <SearchResult name={result.name} username={result.username} isfollowing={result.isfollowing} />
              ))}



            </ul>
          </div>
        </div>
      )}
    </>
  ]
}

export default SearchBar