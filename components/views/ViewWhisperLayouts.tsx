"use client";

import RenderHomeViewWhisperPost
  from '../WhisperPostRenderer/RenderHomeViewWhisperPost';
import RenderMainViewWhisperPost
  from '../WhisperPostRenderer/RenderMainViewWhisperPost';
import RenderParentViewWhisperPost
  from '../WhisperPostRenderer/RenderParentViewWhisperPost';

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
            return <RenderParentViewWhisperPost post={post} />;
          })}
        </div>
        <div>
          <RenderMainViewWhisperPost post={whisperdatas} />
        </div>
        <div className=" min-h-[70vh]">
          {whisperdatas.children.map((post: any) => (
            <RenderHomeViewWhisperPost post={post} key={`${post._id}`} />
          ))}
        </div>
      </div>
    </>
  );
};

export default ViewWhisperLayout;
