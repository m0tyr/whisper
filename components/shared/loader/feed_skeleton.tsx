import WhisperSkeleton from "./ui/whisper_skeleton";


export default function FeedSkeleton({ feed_length }: { feed_length: number }) {
    const skeletons = Array.from({ length: feed_length }, (_, index) => (
        <WhisperSkeleton key={index} />
    ));

    return <>
        <div className="flex flex-col gap-y-9 py-4 px-5">
            {skeletons}
        </div>
    </>;
}