import AppLogoIcon from '@/components/app-logo-icon';
import { cn } from '@/lib/utils';

export default function AppLogo({
    iconClassName,
}: {
    iconClassName?: string;
}) {
    return (
        <>
            <div className="flex aspect-square size-12 items-center justify-center rounded-full">
                <AppLogoIcon className={cn('h-full w-full', iconClassName)} />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-1 truncate leading-tight font-semibold">
                    Mind Ease
                </span>
            </div>
        </>
    );
}
