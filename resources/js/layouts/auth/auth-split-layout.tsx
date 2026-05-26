import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="justify-between bg-background md:flex md:min-h-screen">
            {/* Image side (left) */}

            <img
                src="/welcome.jpg"
                alt="Background"
                className="hidden max-w-[60%] object-cover md:block"
            />

            {/* Form side (right) */}
            <div className="flex min-h-screen flex-col items-center justify-center md:w-[40%]">
                <div className="w-full max-w-sm space-y-2 rounded-lg border border-border bg-card px-6 py-16">
                    <div className="flex w-full flex-col items-center justify-center">
                        <Link
                            href={home()}
                            className="relative z-20 flex justify-center"
                        >
                            <AppLogoIcon className="size-18 fill-current" />
                        </Link>

                        {title && (
                            <h1 className="text-2xl font-semibold tracking-tight">
                                {title}
                            </h1>
                        )}
                        {description && (
                            <p className="mb-4 text-sm text-balance text-muted-foreground">
                                {description}
                            </p>
                        )}
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
