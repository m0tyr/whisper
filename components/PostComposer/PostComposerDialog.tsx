
import React from "react";
import PostComposerButton from "./PostComposerButton";

const PostComposerDialog = () => {
    return (
        <div id="editableDiv"
            className='items-center justify-center rounded-b-2xl  
bg-good-gray  border-x-[0.2333333px] border-b-[0.2333333px]  border-x-border border-b-border  w-basic h-20 mx-auto p-4'>

           <PostComposerButton isFixed={true}/>

        </div>
    )
}


export default PostComposerDialog;