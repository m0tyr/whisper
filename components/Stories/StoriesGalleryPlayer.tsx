const StoriesGalleryPlayer = () => {
  return (
    <div className=" pt-6 pb-9 px-4">
      <div className=" bg-white w-full h-[2px] rounded-full"></div>
      <div className="pt-3 flex flex-row">
        <div className="flex flex-row gap-0.5">
          <div className=" h-[32px] w-[32px] rounded-full bg-slate-100"></div>
          <div className="flex justify-center items-center tracking-tight font-normal text-[14.25px] pl-2">
            test
          </div>
        </div>
        <div className="flex flex-row gap-6 mr-2.5 ml-auto justify-center items-center">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 384 512"
            >
              <path
                fill="currentColor"
                d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80v352c0 17.4 9.4 33.4 24.5 41.9S58.2 482 73 473l288-176c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"
              />
            </svg>
          </div>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 20 20"
            >
              <path
                fill="currentColor"
                fill-rule="evenodd"
                d="M2.5 7.5a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5Zm15 0a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5Zm-7.274 0a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5Z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoriesGalleryPlayer;
