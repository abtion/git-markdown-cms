import { cn } from "@/lib/utils/cn";

interface IPhone16FrameProps {
  children: React.ReactNode;
  className?: string;
}

export default function IPhone16Frame({
  children,
  className,
}: IPhone16FrameProps) {
  return (
    <div className="flex items-center justify-center p-8 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
      <div
        className={cn(
          "relative bg-black rounded-[3rem] shadow-2xl overflow-hidden",
          className,
        )}
        style={{ width: "390px", height: "844px" }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 bg-black rounded-b-3xl h-8 w-40" />

        {/* Screen content area */}
        <div className="relative h-full w-full bg-white dark:bg-zinc-950 rounded-[2.75rem] overflow-auto">
          {/* Status bar spacer */}
          <div className="h-12" />

          {/* Content */}
          <div className="px-4 pb-4">{children}</div>
        </div>

        {/* Border/bezel */}
        <div className="absolute inset-0 rounded-[3rem] border-[14px] border-black pointer-events-none" />
      </div>
    </div>
  );
}
