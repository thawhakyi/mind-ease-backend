import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-12 items-center justify-center rounded-full">
                <AppLogoIcon className="h-full w-full" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-1 truncate leading-tight font-semibold">
                    Mind Ease
                </span>
            </div>
        </>
    );
}
