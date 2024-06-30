import WhisperDropDownAction from "@/components/shared/widgets/whisper_dropdown_actions";
import { useWhisper } from "@/contexts/WhisperPostContext";
import { calculateTimeAgo } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from "react";
import WhisperPost from "../WhisperPost";
import WhisperPostInteractions from "../WhisperPostInteractions";
import WhisperPostMediaAttachments from "../WhisperPostMediaAttachments";
import WhisperPostText from "../WhisperPostText";

//Components
WhisperPost.ParentContainer = function WhisperPostParentContainer({
    children,
  }: {
    children: ReactNode;
  }) {
    const { isNotComment, ping, parentId } = useWhisper();
    return (
      <div
        className={`opacity-95 rounded-3xl hover:opacity-100 transition-all duration-300 ${parentId === undefined ? "pt-[18px]" : "pt-1.5"
          } mobile:px-[1.6rem] px-2.5   w-full cursor-pointer relative`}
        onClick={(e) => {
          ping(e);
        }}
      >
        <div
          className={`flex w-full flex-1 flex-col  ${isNotComment ? "" : "gap-2"
            } mb-1 relative`}
        >
          <div className="relative outline-none">
            <div className="grid grid-cols-[48px_minmax(0,1fr)] grid-rows-[max-content] flex-1">
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  WhisperPost.ParentHeaderCell = function WhisperPostParentHeaderCell({
    children,
  }: {
    children: ReactNode;
  }) {
    const { ping } = useWhisper()
    return (
      <div className="w-full relative pb-1.5" onClick={(e) => {
        ping(e)
      }} >
        {children}
      </div>
    )
  }
  
  WhisperPost.ParentLeftHeaderGrow = function WhisperPostParentLeftHeaderGrow() {
    const { isNotComment, ping, author } = useWhisper();
    return (
      <>
        {!isNotComment && (
          <div className=" flex flex-col w-10">
            <div
              className=" col-start-1 row-start-1 row-span-2 w-10  mt-[3px]  justify-center"
              onClick={(e) => {
                ping(e);
              }}
            >
              <Link href={`${author.username}`}>
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.01 }}
                >
                  <div className="w-[40px] h-[40px] flex">
                    <Image
                      src={author.image}
                      alt="logo"
                      width={40}
                      height={40}
                      className="border-border border float-left cursor-pointer rounded-full"
                    />
                  </div>
                </motion.div>
              </Link>
            </div>
            <div className="thread-card_bar " />
          </div>
        )}
        {isNotComment && (
          <div className="mt-2 flex flex-col w-10">
            <div
              className=" flex-grow  col-start-1 row-start-1 row-span-2 w-10 justify-center mt-[1px] relative"
              onClick={(e) => {
                ping(e);
              }}
            >
              <Link href={`${author.username}`} className="absolute top-0.5">
                <Image
                  src={author.image}
                  alt="logo"
                  width={37}
                  height={37}
                  className=" cursor-pointer rounded-full"
                />
              </Link>
            </div>
          </div>
        )}
      </>
    );
  };
  
  WhisperPost.DefaultContainer = function WhisperPostDefaultContainer({
    children,
  }: {
    children: ReactNode;
  }) {
    const { isNotComment, ping } = useWhisper();
    return (
      <>
        <div
          className="rounded-3xl hover:opacity-100 transition-all duration-300 pb-3 pt-1 mobile:px-[1.19rem] px-2.5 w-full cursor-pointer relative"
          onClick={(e) => {
            ping(e);
          }}
        >
          <div
            className={`flex w-full flex-1 flex-col ${isNotComment ? "" : "gap-2"
              } mb-1 relative`}
          >
            <div className="relative outline-none">
              <div className="grid grid-cols-[48px_minmax(0,1fr)] grid-rows-[max-content] flex-1">
                {children}
              </div>
            </div>
          </div>
        </div>
        <hr className="border-x-2 opacity-20 rounded-full" />
      </>
    );
  };
  
  WhisperPost.DefaultRightContainer = function WhisperPostDefaultRightContainer({
    children,
  }: {
    children: ReactNode;
  }) {
    const { ping } = useWhisper();
    return (
      <>
        <div
          className=" mt-[6.2px] w-full relative"
          onClick={(e) => {
            ping(e);
          }}
        >
          {children}
        </div>
      </>
    );
  };
  
  WhisperPost.RightContainer = function WhisperPostRightContainer({
    children,
  }: {
    children: ReactNode;
  }) {
    const { ping } = useWhisper();
    return (
      <>
        <div
          className=" mt-[6.2px] w-full relative"
          onClick={(e) => {
            ping(e);
          }}
        >
          {children}
        </div>
      </>
    );
  };
  
  WhisperPost.MainHeaderCellContainer =  function WhisperPostMainHeaderCellContainer({
      children,
    }: {
      children: ReactNode;
    }) {
      return (
        <div className="flex flex-row mb-2  items-center gap-3">{children}</div>
      );
    };
  
  WhisperPost.ViewingContainer = function WhisperPostViewingContainer({
    children,
  }: {
    children: ReactNode;
  }) {
    const { isNotComment, ping, parentId } = useWhisper();
    return (
      <>
        <div
          className={`rounded-3xl hover:opacity-100 transition-all duration-300  pb-3 ${parentId === undefined ? "pt-3.5" : ""
            }  mobile:px-[1.6rem] px-2.5   w-full cursor-pointer relative`}
          onClick={(e) => {
            ping(e);
          }}
        >
          <div className="flex w-full flex-1 flex-col mt-1.5 gap-1 mb-1 relative">
            <div className="flex flex-row flex-1  gap-3 ">
              <div
                className="w-full relative"
                onClick={(e) => {
                  ping(e);
                }}
              >
                {children}
              </div>
            </div>
          </div>
        </div>
        {!isNotComment ? (
          <>
            <hr className="border-x-2 opacity-20 rounded-full " />
          </>
        ) : null}
      </>
    );
  };
  
  WhisperPost.MainProfilePhoto = function WhisperPostMainProfilePhoto() {
    const { author } = useWhisper();
    return (
      <Link href={`/${author.username}`}>
        <motion.div
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.01 }}
          className="col-start-3 ml-auto"
        >
          <div className="w-[40px] h-[40px] flex">
            <Image
              src={author.image}
              alt="logo"
              width={40}
              height={40}
              className=" border-border border cursor-pointer rounded-full"
            />
          </div>
        </motion.div>
      </Link>
    );
  };
  
  WhisperPost.Text = function WhisperPostTexts() {
    return <WhisperPostText />;
  };
  
  WhisperPost.HeaderCell = function WhisperPostHeaderCell() {
    const { author, createdAt } = useWhisper();
  
    return (
      <>
        <div className="flex flex-row mb-0.5  items-center gap-3">
          <Link href={`/${author.username}`}>
            <p className="text-white text-small-semibold !text-[15px] hover:underline inline  ">
              {author.username}
            </p>
          </Link>
          <div className="absolute right-0  text-white text-small-regular font-light opacity-50 flex h-5">
            <p className="opacity-50">{calculateTimeAgo(createdAt.toString())}</p>
            <WhisperDropDownAction />
          </div>
        </div>
      </>
    );
  };
  
  WhisperPost.HeaderCellOnlyMedia = function WhisperPostHeaderCellOnlyMedia() {
    const { author, createdAt } = useWhisper();
    return (
      <>
        <div className="flex flex-row mt-2.5  items-center gap-3">
          <Link href={`/${author.username}`}>
            <p className="text-white text-small-semibold !text-[15px] hover:underline inline  ">
              {author.username}
            </p>
          </Link>
          <div className="absolute right-0  text-white text-small-regular font-light opacity-50 flex h-5">
            <p className="opacity-50">{calculateTimeAgo(createdAt.toString())}</p>
            <WhisperDropDownAction />
          </div>
        </div>
      </>
    );
  };
  
  WhisperPost.LeftCell = function WhisperPostLeftCell() {
    const { isInReplyContext, author, isNotComment, ping, comments } =
      useWhisper();
    return (
      <>
        {!isNotComment && (
          <div
            className={`${isInReplyContext ? "" : "mt-2 relative"
              } flex flex-col w-10`}
          >
            <div
              className="flex w-10 mt-[3px] justify-center items-center"
              onClick={(e) => ping(e)}
            >
              <Link href={`/${author.username}`}>
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.01 }}
                  className="col-start-3 ml-auto"
                >
                  <div className="w-[40px] h-[40px] flex">
                    <Image
                      src={author.image}
                      alt="logo"
                      width={40}
                      height={40}
                      className="cursor-pointer rounded-full border-border border"
                    />
                  </div>
                </motion.div>
              </Link>
            </div>
            <div
              className={`${isInReplyContext ? "" : "relative left-[18px]"
                } thread-card_bar`}
            />
            <div className=" relative bottom-[29px] mt-8 w-12 flex">
              <div className="justify-center flex w-full relative">
                {comments[0].childrens.length >= 10 ? (
                  <>
                    <div className="w-[21px] h-[21px] flex absolute top-[-0.165rem] left-[0.265rem] ">
                      <Image
                        src={comments[0].childrens[0].author.image}
                        alt="logo"
                        width={21}
                        height={21}
                        className="rounded-full border border-[#4747476e]"
                      />
                    </div>
                    <div className="w-[17px] h-[17px] flex absolute top-3 right-[0.675rem]">
                      <Image
                        src={comments[0].childrens[1].author.image}
                        alt="logo"
                        width={17}
                        height={17}
                        className="rounded-full border border-[#4747476e]"
                      />
                    </div>
  
                    <div className="w-[13px] h-[13px] flex absolute top-[1.125rem] left-2">
                      <Image
                        src={comments[0].childrens[2].author.image}
                        alt="logo"
                        width={13}
                        height={13}
                        className="rounded-full border border-[#4747476e]"
                      />
                    </div>
                  </>
                ) : comments[0].childrens.length >= 2 ? (
                  <>
                    <div className="w-[20px] h-[20px] flex absolute left-0.5 top-0">
                      <Image
                        src={comments[0].childrens[1].author.image}
                        alt="logo"
                        width={20}
                        height={20}
                        className="rounded-full border border-[#4747476e]"
                      />
                    </div>
                    <div className="w-[20px] h-[20px] flex absolute top-0 right-3">
                      <Image
                        src={comments[0].childrens[0].author.image}
                        alt="logo"
                        width={20}
                        height={20}
                        className="rounded-full border border-double border-[#4747477e]"
                      />
                    </div>
                  </>
                ) : comments[0].childrens.length === 1 ? (
                  <div className="w-[20px] h-[20px] flex absolute left-[0.565rem] top-0">
                    <Image
                      src={comments[0].childrens[0].author.image}
                      alt="logo"
                      width={20}
                      height={20}
                      className="rounded-full border border-[#4747476e]"
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}
        {isNotComment && (
          <div className="mt-2 flex flex-col w-10">
            <div
              className="flex-grow col-start-1 row-start-1 row-span-2 w-10 justify-center mt-[1px] relative"
              onClick={(e) => ping(e)}
            >
              <Link href={`/${author.username}`} className="absolute top-0.5">
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.01 }}
                  className="col-start-3 ml-auto"
                >
                  <div className="w-[40px] h-[40px] flex">
                    <Image
                      src={author.image}
                      alt="logo"
                      width={40}
                      height={40}
                      className="border-border border cursor-pointer rounded-full"
                    />
                  </div>
                </motion.div>
              </Link>
            </div>
          </div>
        )}
      </>
    );
  };
  
  WhisperPost.ParentActions = function WhisperPostActions({
    children,
  }: {
    children: ReactNode;
  }) {
    return (
      <div className="float-right relative  text-white text-small-regular font-light opacity-50 flex h-5 top-1">
        {children}
      </div>
    );
  };
  
  WhisperPost.AuthorName = function WhisperPostAuthorName() {
    const { author } = useWhisper();
    return (
      <Link href={`/${author.username}`}>
        <p className="text-white text-small-semibold !text-[15px] hover:underline inline  ">
          {author.username}
        </p>
      </Link>
    );
  };
  
  WhisperPost.MainActions = function WhisperPostMainActions({
    children,
  }: {
    children: ReactNode;
  }) {
    return (
      <div className="absolute right-0  text-white text-small-regular font-light opacity-50 flex h-5">
        {children}
      </div>
    );
  };
  
  WhisperPost.Date = function WhisperPostDate() {
    const { createdAt } = useWhisper();
    return <p className="opacity-50">{calculateTimeAgo(createdAt.toString())}</p>;
  };
  
  WhisperPost.DropDownActions = function WhisperPostDropDownActions() {
    return <WhisperDropDownAction />;
  };
  
  WhisperPost.Medias = function WhisperPostMedias() {
    return <WhisperPostMediaAttachments />;
  };
  
  WhisperPost.InteractionElements = function WhisperPostInteractionElements() {
    return <WhisperPostInteractions />;
  };
  