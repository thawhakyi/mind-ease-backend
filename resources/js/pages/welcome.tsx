import { Head, Link, usePage } from '@inertiajs/react';
import { HeartIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuthSplitLayout from '@/layouts/auth/auth-split-layout';
import { dashboard, login } from '@/routes';

export default function Welcome() {
    const { auth } = usePage().props;

    return (
        <AuthSplitLayout>
            <Head title="Welcome | Mind Ease" />

            <div className="mb-12 inline-flex items-center gap-2 rounded-full border border-rose-400 bg-transparent px-3 py-1 text-sm font-medium text-rose-400 dark:border-rose-300 dark:text-rose-300">
                <HeartIcon className="size-4" /> Here to listen, Here to care!
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                Mind Ease
            </h1>
            <h2 className="text-xl font-medium tracking-tight text-muted-foreground">
                Program Management Dashboard
            </h2>

            <div className="mt-8 flex w-full flex-col gap-4">
                {auth.user ? (
                    <Link href={dashboard()} className="w-full sm:w-auto">
                        <Button size="lg" fullWidth className="w-full">
                            Go to Dashboard
                        </Button>
                    </Link>
                ) : (
                    <>
                        <Link href={login()}>
                            <Button variant="default" fullWidth>
                                Log in
                            </Button>
                        </Link>
                    </>
                )}
            </div>

            <div className="mt-12 text-center sm:text-left">
                <p className="text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} Mind Ease. All rights
                    reserved.
                </p>
            </div>
        </AuthSplitLayout>
    );
}
