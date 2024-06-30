'use client'
import WhisperPost from "../WhisperPostLayout/WhisperPost";

interface UsesrWhispersProps{
    UserPosts: any;
}

export default function UserWhispers({UserPosts}: UsesrWhispersProps) {
    return (
        <div>
                            {UserPosts.whispers.length === 0 ? (
                                <p className="text-white text-body1-bold ">No Whispers found...</p>
                            ) : (
                                <>
                                    {UserPosts.whispers.map((post: any) => (
                                        <WhisperPost
                                            post={{
                                                id: post._id,
                                                parentId: post.parentId,
                                                content: post.content.map((content: any) => ({
                                                    text: content.text,
                                                    type: content.type
                                                })),
                                                medias: post.media.map((media: any) => ({
                                                    s3url: media.s3url,
                                                    aspectRatio: media.aspectRatio,
                                                    width: media.width,
                                                    height: media.height,
                                                    isVideo: media.isVideo
                                                })),
                                                author: {
                                                    image: UserPosts.image,
                                                    username: UserPosts.username,
                                                    id: UserPosts.id
                                                },
                                                createdAt: post.createdAt,
                                                like_info: {
                                                    like_count: post.interaction_info.like_count,
                                                    liketracker: post.interaction_info.liketracker.map((likeid: any) => ({
                                                        id: likeid.id
                                                    }))
                                                },
                                                comments: [{
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
                                                }],
                                                isNotComment: post.children.length === 0,
                                                mentions: post.mentions.map((mention: any) => ({
                                                    link: mention.link,
                                                    text: mention.text,
                                                    version: mention.version
                                                })),
                                                isInReplyContext: false,
                                                isInViewingView: false,
                                                isOnlyMediaPost: post.content && post.content.length === 0,
                                                ViewportIndicator : "default"
                                            }}
                                        >
                                            <WhisperPost.HomeView />
                                        </WhisperPost>
                                    ))}
                                </>
                            )}
                        </div>
    )
}