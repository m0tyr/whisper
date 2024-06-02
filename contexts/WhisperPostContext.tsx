"use client"
import React, { createContext, useContext, ReactNode, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { DBImageData, ExtractedElement } from '@/lib/types/whisper.types';

interface Author {
    username: string;
    image: string;
    id: string;
}

interface Comments {
    posts: { number: number };
    childrens: any;
}

interface Mentions {
    link: string;
    text: string;
    version: number;
}

interface LikeInfo {
    like_count: number;
    liketracker: { id: string }[];
}

interface WhisperData {
    id: string;
    parentId: string | null;
    content: ExtractedElement[];
    medias: DBImageData[];
    author: Author;
    createdAt: string;
    comments: Comments[];
    isNotComment?: boolean;
    mentions: Mentions[];
    like_info: LikeInfo;
    likewhisper: any;
    currentUserId: string;
    ping: (e: MouseEvent) => void;
}

const WhisperContext = createContext<WhisperData | undefined>(undefined);

export const WhisperProvider = ({ children, value }: { children: ReactNode; value: Omit<WhisperData, 'ping'> }) => {
    const router = useRouter();

    const ping = (e: any) => {
        if (e.target === e.currentTarget) {
            router.push(`/${value.author.username}/post/${value.id}`);
        }
    };

    return (
        <WhisperContext.Provider value={{ ...value, ping }}>
            {children}
        </WhisperContext.Provider>
    );
};

export const useWhisper = () => {
    const context = useContext(WhisperContext);
    if (context === undefined) {
        throw new Error('useWhisper must be used within a WhisperProvider');
    }
    return context;
};