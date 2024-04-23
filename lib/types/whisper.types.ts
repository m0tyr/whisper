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
export interface MentionsDatas {
    mentions: string[];
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
    isVideo: boolean;
}