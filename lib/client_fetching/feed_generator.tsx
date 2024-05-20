"use server"
import WhisperCard from "@/components/cards/WhisperCard";
import { fetchwhispers, likewhisper } from "../actions/whisper.actions";
import React from "react";
import FeedUserCard from "@/components/shared/widgets/feed_user_card";
import { FamousUserSuggestion, follow } from "../actions/user.actions";

interface Props {
    userID: string;
}

export default async function FeedGenerator({ userID }: Props) {
    const fetchedPosts = await fetchwhispers(userID, 1, 30);
    let suggestions: any;
    if(!fetchedPosts){
        suggestions = await FamousUserSuggestion()
    }
    const likeAction = async (myusername: string, whisperid: string, username: string) => {
        "use server";
        return await likewhisper(myusername, whisperid, username)
    }
    const addtofollowing = async (myusername: string, username: string) => {
        "use server";
        await follow(myusername, username)
    }
    return (
        <>
            {!fetchedPosts ? (
              <FeedUserCard suggestions={suggestions} follow={addtofollowing} />
            ) : (
                <>
                    {fetchedPosts && fetchedPosts.posts_exec.map((post: any) => (
                        <WhisperCard
                            id={post._id}
                            parentId={post.parentId}
                            content={post.content.map((content: any) => ({
                                text: content.text,
                                type: content.type
                            }))}
                            medias={post.media.map((media: any) => ({
                                s3url: media.s3url,
                                aspectRatio: media.aspectRatio,
                                width: media.width,
                                height: media.height,
                                isVideo: media.isVideo
                            }))}
                            author={{
                                image: post.author.image,
                                username: post.author.username,
                                id: post.author.id
                            }}
                            createdAt={post.createdAt}
                            like_info={{
                                like_count: post.interaction_info.like_count,
                                liketracker: post.interaction_info.liketracker.map((likeid: any) => ({
                                    id: likeid.id
                                }))
                            }}
                            comments={[{
                                posts: {
                                    number: post.children.length
                                },
                                childrens: post.children.map((child: any) => ({
                                    author: {
                                        image: child.author.image,
                                        username: child.author.username,
                                        id: child.author.id
                                    },
                                    content: [], // No data needed here
                                    createdAt: child.createdAt
                                }))
                            }]}
                            isNotComment={post.children.length === 0}
                            mentions={post.mentions.map((mention: any) => ({
                                link: mention.link,
                                text: mention.text,
                                version: mention.version
                            }))}
                            likewhisper={likeAction}
                        />
                    ))}
                </>
            )}
        </>
    );
};
