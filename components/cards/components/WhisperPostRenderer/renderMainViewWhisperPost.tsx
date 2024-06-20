'use client'
import WhisperPost from "../../WhisperPost";

const RenderMainViewWhisperPost = (post: any) => {
    return (
        <>
        <WhisperPost
            key={post._id}
            post={{
                id: `${post._id}`,
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
                    image: post.author.image,
                    username: post.author.username,
                    id: post.author.id
                },
                createdAt: post.createdAt,
                comments: [
                    {
                        posts: {
                            number: post.children.length
                        },
                        childrens: post.children.map((child: { author: { image: any; username: any; id: any; }; content: any; createdAt: any; }) => ({
                            author: {
                                image: child.author.image,
                                username: child.author.username,
                                id: child.author.id
                            },
                            content: child.content.map((content: any) => ({
                                text: content.text,
                                type: content.type
                            })),
                            createdAt: child.createdAt
                        }))
                    }
                ],
                isNotComment: post.children.length === 0,
                mentions: post.mentions.map((mention: any) => ({
                    link: mention.link,
                    text: mention.text,
                    version: mention.version
                })),
                like_info: {
                    like_count: post.interaction_info.like_count,
                    liketracker: post.interaction_info.liketracker.map((likeid: any) => ({
                        id: likeid.id
                    }))
                },
                isInReplyContext: false,
                isInViewingView: false,
                isOnlyMediaPost: post.content && post.content.length === 0,
                ViewportIndicator: "parent"
            }}
        >
            <WhisperPost.HomeView />
        </WhisperPost>
        </>
    )
}

export default RenderMainViewWhisperPost;
