import { HTMLAttributes } from 'react';
import { cn } from '../lib/utils';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
}

export const Skeleton = ({ className, ...props }: SkeletonProps) => {
    return (
        <div
            className={cn(
                "animate-pulse rounded-md bg-muted/60",
                className
            )}
            {...props}
        />
    );
};

export const ChartSkeleton = () => (
    <div className="h-[300px] w-full bg-card p-6 rounded-[2rem] border border-primary/5 shadow-sm space-y-4">
        <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex items-end gap-2 h-[180px]">
            {[...Array(12)].map((_, i) => (
                <Skeleton
                    key={i}
                    className="flex-1 rounded-t-lg"
                    style={{ height: `${Math.random() * 80 + 20}%` }}
                />
            ))}
        </div>
        <div className="flex justify-between mt-4">
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-3 w-8" />
        </div>
    </div>
);

export const CardSkeleton = () => (
    <div className="p-6 rounded-3xl border border-primary/5 bg-card shadow-sm space-y-4">
        <div className="flex justify-between items-start">
            <Skeleton className="h-14 w-14 rounded-2xl" />
            <Skeleton className="h-7 w-16 rounded-full" />
        </div>
        <div className="space-y-2 mt-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-32" />
        </div>
    </div>
);
