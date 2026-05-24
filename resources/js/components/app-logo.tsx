import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-7 items-center justify-center rounded-full">
                <AppLogoIcon className="fill-current text-foreground" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-1 truncate leading-tight font-semibold">
                    Mind Ease
                </span>
            </div>
        </>
    );
}
