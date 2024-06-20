"use client";
import React, { createContext, useContext, ReactNode, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { DBImageData, ExtractedElement, WhisperViewportTypes } from '@/lib/types/whisper.types';
import { likewhisper } from '@/lib/actions/whisper.actions';

export interface Author {
    username: string;
    image: string;
    id: string;
}

export interface Comments {
    posts: { number: number };
    childrens: any;
}

export interface Mentions {
    link: string;
    text: string;
    version: number;
}

export interface LikeInfo {
    like_count: number;
    liketracker: { id: string }[];
}


export interface WhisperData {
    id: string;
    parentId: string | null;
    content: ExtractedElement[];
    medias: DBImageData[];
    author: Author;
    createdAt: string;
    comments: Comments[];
    mentions: Mentions[];
    like_info: LikeInfo;
    isNotComment: boolean;
    isInReplyContext: boolean;
    isOnlyMediaPost: boolean;
    isInViewingView: boolean;
    ViewportIndicator: WhisperViewportTypes;
}


interface UtlsFuncWhisperData extends WhisperData {
    ping: (e: MouseEvent) => void;
    likeAction: (myusername: string, whisperid: string, username: string) => Promise<void>;
}

const WhisperContext = createContext<UtlsFuncWhisperData | undefined>(undefined);

export const Whisper = ({ children, value }: { children: ReactNode; value: Omit<WhisperData, 'ping' | 'likeAction'> }) => {
    const router = useRouter();

    const ping = (e: any) => {
        if (e.target === e.currentTarget) {
            router.push(`/${value.author.username}/post/${value.id}`);
        }
    };

    const likeAction = async (myusername: string, whisperid: string, username: string) => {
        await likewhisper(myusername, whisperid, username);
    };

    return (
        <WhisperContext.Provider value={{ ...value, ping, likeAction }}>
            {children}
        </WhisperContext.Provider>
    );
};

export function useWhisper() {
    const context = useContext(WhisperContext);
    if (context === undefined) {
        throw new Error('useWhisper must be used within a WhisperProvider');
    }
    return context;
};
