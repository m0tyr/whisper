'use client'
import { Suspense } from "react";
import Loader from "../shared/loader/loader";
import RenderHomeViewWhisperPost from "../cards/components/WhisperPostRenderer/renderHomeViewWhisperPost";
import RenderMainViewWhisperPost from "../cards/components/WhisperPostRenderer/renderMainViewWhisperPost";
import RenderParentViewWhisperPost from "../cards/components/WhisperPostRenderer/renderParentViewWhisperPost";

interface Props {
    allparents: any;
    whisperdatas: any;
}

const ViewWhisperLayout = ({ allparents, whisperdatas }: Props) => {
    return (
        <>
            <div className=" flex flex-col relative grow">
                <div>
                    {Object.keys(allparents).map((postId) => {
                        const post = allparents[postId];
                        return (
                            <RenderParentViewWhisperPost post={post} />
                        )

                    })}
                </div>
                <div >
                    <RenderMainViewWhisperPost post={whisperdatas} />
                </div>
                <div className=" min-h-[70vh]">
                    <Suspense fallback={
                        <Loader />
                    }>
                        {whisperdatas.children.map((post: any) => (
                            <RenderHomeViewWhisperPost post={post} key={post._id} />
                        ))}
                    </Suspense>
                </div>
            </div>
        </>

    )
}

export default ViewWhisperLayout;