'use client'
import ParentWhisperPost from '../cards/ParentWhisperCard';
import WhisperPost from '../WhisperPostLayout/WhisperPost';

const RenderParentViewWhisperPost = (post: any) => {
    const renderedPost = post.post;
    return (
        <WhisperPost
            key={`${post._id}`}
            post={{
                id: `${renderedPost._id}`,
                parentId: renderedPost.parentId,
                content: renderedPost.content.map((content: any) => ({
                    text: content.text,
                    type: content.type
                })),
                medias: renderedPost.media.map((media: any) => ({
                    s3url: media.s3url,
                    aspectRatio: media.aspectRatio,
                    width: media.width,
                    height: media.height,
                    isVideo: media.isVideo
                })),
                author: {
                    image: renderedPost.author.image,
                    username: renderedPost.author.username,
                    id: renderedPost.author.id
                },
                createdAt: renderedPost.createdAt,
                comments: [
                    {
                        posts: {
                            number: renderedPost.children.length
                        },
                        childrens: renderedPost.children.map((child: { author: { image: any; username: any; id: any; }; content: any; createdAt: any; }) => ({
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
                isNotComment: renderedPost.children.length === 0,
                mentions: renderedPost.mentions.map((mention: any) => ({
                    link: mention.link,
                    text: mention.text,
                    version: mention.version
                })),
                like_info: {
                    like_count: renderedPost.interaction_info.like_count,
                    liketracker: renderedPost.interaction_info.liketracker.map((likeid: any) => ({
                        id: likeid.id
                    }))
                },
                isInReplyContext: false,
                isInViewingView: false,
                isOnlyMediaPost: renderedPost.content && renderedPost.content.length === 0,
                ViewportIndicator: "default"
            }}
        >
            <ParentWhisperPost />
        </WhisperPost>
    )
}

export default RenderParentViewWhisperPost;