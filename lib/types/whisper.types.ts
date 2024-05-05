export interface Props {
    ref: any;
    watchtext: any;
}
export interface Child {
    type: string;
    text?: string;
}

export interface Paragraph {
    children: Child[];
}

export interface Root {
    root: { children: any; };
    children: Paragraph[];
}
export interface MediaSize {
    mediaWidth: number;
    mediaHeight: number;
}

export interface MentionsDatas {
    id: string, 
    mention: string;
}
export interface Element {
    detail?: number;
    format?: number;
    mode?: string;
    style?: string;
    text?: string;
    type: string;
    version: number;
    mentionName?: string;
}

export interface Root {
    children: Paragraph[];
}

export interface Input {
    root: Root;
}

export interface ExtractedElement {
    text: string;
    type: string;
}

export interface PrevImageData {
    file: File,
    s3url: string | undefined;
    url: string;
    aspectRatio: string;
    width: string;
    height: string;
    isVideo: boolean;
}

export interface ProfileImageData {
    file: File,
    url: string
}

export interface DBImageData {
    s3url?: string | undefined;
    aspectRatio: string;
    width: string;
    height: string;
    isVideo: boolean;
}

export interface PostSkeleton {
        _id: string;
        interaction_info: any;
        content: any[];
        author: {
            username: string;
        };
        mentions: any[];
        media: any[];
        children: any[];
        caption: string;
        createdAt: Date;
        __v: number;
        rankScore: number;
}

export interface UserTweet {
    affinity: number;
    tweets: PostSkeleton[];
}

export type Feed = PostSkeleton[];


export interface FeedOptions {
    skipamount: number;
    pagesize: number;
    affinity_deep_search_min_value: number;
    affinity_deep_search_max_value: number;
    affinity_deep_talk_value: number;
    affinity_deep_like_value: number;
    affinity_deep_followage_value:number;
    ranking_like_effect: number;
    ranking_time_effect: number;
}