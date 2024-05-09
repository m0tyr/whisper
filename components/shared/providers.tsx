'use client';

import { ReactQueryProvider } from "@/contexts/react_query.provider";
import { Toaster } from "../ui/toaster";


export function Providers({
    children,
}: {
    children: React.ReactNode;
}) {
    return (

        <ReactQueryProvider>
                {children}
                <Toaster />
        </ReactQueryProvider>
    );
}