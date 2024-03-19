import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-[#181818] dark:bg-[#383838]", className)}
      {...props}
    />
  )
}

export { Skeleton }
