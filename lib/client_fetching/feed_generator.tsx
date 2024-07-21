"use client";
import React from "react";

import WhisperPost from "@/components/WhisperPostLayout/WhisperPost";
import useQueryForYouFeed from "@/hooks/queries/useQueryForYouFeed";
import SuggestedUsers from "@/components/SuggestedUsers/SuggestedUsers";
import FeedSkeleton from "@/components/shared/loader/FeedSkeleton";

export default function FeedGenerator() {
  const addtofollowing = async (myusername: string, username: string) => {
    /*         await follow(myusername, username);
     */
  };
  const { data, isFetched } = useQueryForYouFeed();

  return (
    <>
      {!isFetched ? (
        <FeedSkeleton feed_length={15} />
      ) : (
        <>
          {!data ? (
            <SuggestedUsers  follow={addtofollowing} />
          ) : (
            <>
              {data.posts_exec.map((post: any) => (
                <WhisperPost
                  key={post._id}
                  post={{
                    id: post._id,
                    parentId: post.parentId,
                    content: post.content.map((content: any) => ({
                      text: content.text,
                      type: content.type,
                    })),
                    medias: post.media.map((media: any) => ({
                      s3url: media.s3url,
                      aspectRatio: media.aspectRatio,
                      width: media.width,
                      height: media.height,
                      isVideo: media.isVideo,
                    })),
                    author: {
                      image: post.author.image,
                      username: post.author.username,
                      id: post.author.id,
                    },
                    createdAt: post.createdAt,
                    like_info: {
                      like_count: post.interaction_info.like_count,
                      liketracker: post.interaction_info.liketracker.map(
                        (likeid: any) => ({
                          id: likeid.id,
                        })
                      ),
                    },
                    comments: [
                      {
                        posts: {
                          number: post.children.length,
                        },
                        childrens: post.children.map((child: any) => ({
                          author: {
                            image: child.author.image,
                            username: child.author.username,
                            id: child.author.id,
                          },
                          content: [], // No data needed here
                          createdAt: child.createdAt,
                        })),
                      },
                    ],
                    isNotComment: post.children.length === 0,
                    mentions: post.mentions.map((mention: any) => ({
                      link: mention.link,
                      text: mention.text,
                      version: mention.version,
                    })),
                    isInReplyContext: false,
                    isInViewingView: false,
                    isOnlyMediaPost: post.content && post.content.length === 0,
                    ViewportIndicator: "default",
                  }}
                >
                  <WhisperPost.HomeView />
                </WhisperPost>
              ))}
            </>
          )}
        </>
      )}
    </>
  );
}
