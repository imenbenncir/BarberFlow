import { Skeleton } from './Skeleton';

export const GlobalLoading = () => {
    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            <div className="space-y-2">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-4 w-96" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-32 rounded-3xl" />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Skeleton className="lg:col-span-2 h-[400px] rounded-[2.5rem]" />
                <Skeleton className="h-[400px] rounded-[2.5rem]" />
            </div>
        </div>
    );
};
