import { Skeleton } from "@/components/ui/skeleton";
import React from 'react';

export default function WhisperPostSkeleton() {
    const usernamewidth_generator = () => {
        const maxWidth = 36.66666; 
        const minWidth = 12.333; 
        return `${Math.round(Math.random() * (maxWidth - minWidth) + minWidth)}%`;
    };

    const contentwidth_generator = () => {
        const maxWidth = 100; 
        const minWidth = 40; 
        return `${Math.round(Math.random() * (maxWidth - minWidth) + minWidth)}%`;
    };
    return (
        <>
            <div className="flex flex-row flex-grow space-x-4 ">
                <div className="flex flex-col items-center  ">
                    <Skeleton className="h-[40px] w-[40px] rounded-full" />
                </div>
                <div className="flex flex-col space-y-3" style={{ width: '100%' }}>
                    <div className="space-y-2">
                    <div className="flex flex-row relative">
                            <Skeleton className="h-4" style={{ width: usernamewidth_generator() }} />
                        </div>
                        <Skeleton className="h-4" style={{ width: contentwidth_generator() }} />
                        <Skeleton className="h-4" style={{ width: contentwidth_generator() }} />
                    </div>
                </div>
            </div>
        </>
    )
}