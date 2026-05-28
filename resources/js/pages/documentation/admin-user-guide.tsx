import { Head } from '@inertiajs/react';
import { ChevronDownIcon, ListIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import DocumentationController from '@/actions/App/Http/Controllers/DocumentationController';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function AdminUserGuide({
    contentHtml,
    tableOfContents,
}: {
    contentHtml: string;
    tableOfContents: TableOfContentsItem[];
}) {
    const [isTocOpen, setIsTocOpen] = useState(false);

    useEffect(() => {
        const query = window.matchMedia('(min-width: 1024px)');
        const syncTableOfContents = () => setIsTocOpen(query.matches);

        syncTableOfContents();
        query.addEventListener('change', syncTableOfContents);

        return () => query.removeEventListener('change', syncTableOfContents);
    }, []);

    return (
        <>
            <Head title="Admin documentation" />

            <div className="flex flex-col gap-6 p-6">
                <Heading
                    title="Admin documentation"
                    description="Operational guide for managing Mind Ease backend content and settings."
                />

                <div
                    className={cn(
                        'grid max-w-7xl gap-6 transition-[grid-template-columns] duration-200 lg:items-start',
                        isTocOpen
                            ? 'lg:grid-cols-[260px_minmax(0,1fr)]'
                            : 'lg:grid-cols-[56px_minmax(0,1fr)]',
                    )}
                >
                    <aside className="lg:sticky lg:top-6 lg:self-start">
                        <nav
                            aria-label="Documentation table of contents"
                            className="rounded-lg border border-border bg-card p-3 text-card-foreground shadow-xs"
                        >
                            <div className="flex items-center justify-between gap-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    aria-controls="documentation-toc-list"
                                    aria-expanded={isTocOpen}
                                    className={cn(
                                        'h-8 w-full justify-between px-2',
                                        !isTocOpen && 'lg:justify-center',
                                    )}
                                    onClick={() =>
                                        setIsTocOpen((isOpen) => !isOpen)
                                    }
                                >
                                    <span
                                        className={cn(
                                            'flex min-w-0 items-center gap-2',
                                            !isTocOpen && 'lg:justify-center',
                                        )}
                                    >
                                        <ListIcon className="size-4 shrink-0" />
                                        <span
                                            className={cn(
                                                'truncate text-sm font-semibold tracking-tight',
                                                !isTocOpen && 'lg:sr-only',
                                            )}
                                        >
                                            Table of contents
                                        </span>
                                    </span>
                                    <ChevronDownIcon
                                        className={cn(
                                            'size-4 shrink-0 transition-transform',
                                            isTocOpen && 'rotate-180',
                                            !isTocOpen && 'lg:hidden',
                                        )}
                                    />
                                </Button>
                            </div>

                            {isTocOpen && (
                                <div
                                    id="documentation-toc-list"
                                    className="mt-4 grid gap-1.5"
                                >
                                    {tableOfContents.map((item) => (
                                        <a
                                            key={item.id}
                                            href={`#${item.id}`}
                                            className={
                                                item.level === 3
                                                    ? 'rounded-md px-3 py-1.5 pl-6 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
                                                    : 'rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground'
                                            }
                                        >
                                            {item.title}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </nav>
                    </aside>

                    <article
                        className="min-w-0 rounded-lg border border-border bg-card p-5 text-card-foreground shadow-xs [&_a]:font-medium [&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_h2]:mt-10 [&_h2]:scroll-mt-6 [&_h2]:border-t [&_h2]:pt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h3]:mt-8 [&_h3]:scroll-mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_img]:mt-4 [&_img]:rounded-lg [&_img]:border [&_img]:border-border [&_img]:bg-muted [&_img]:shadow-sm [&_li]:mt-1.5 [&_ol]:ml-6 [&_ol]:list-decimal [&_p]:mt-4 [&_p]:leading-7 [&_pre]:mt-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-4 [&_ul]:ml-6 [&_ul]:mt-3 [&_ul]:list-disc"
                        dangerouslySetInnerHTML={{ __html: contentHtml }}
                    />
                </div>
            </div>
        </>
    );
}

type TableOfContentsItem = {
    id: string;
    title: string;
    level: 2 | 3;
};

AdminUserGuide.layout = {
    breadcrumbs: [
        {
            title: 'Documentation',
            href: DocumentationController(),
        },
    ],
};
