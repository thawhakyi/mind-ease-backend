import { Head, Link, router } from '@inertiajs/react';
import Heading from '@/components/heading';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyTitle,
} from '@/components/ui/empty';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { ArrowUpIcon, ArrowDownIcon, ArrowUpDownIcon } from 'lucide-react';
import { useState, useCallback, useRef } from 'react';

type Item = {
    id: number;
    title: string;
    description?: string | null;
    categories?: string | null;
    created_at: string;
};

type PaginatedData<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
    total: number;
    from: number;
    to: number;
};

export default function OpportunitiesNewsIndex({
    items,
    filters,
}: {
    items: PaginatedData<Item>;
    filters: { search?: string; sort?: string; direction?: 'asc' | 'desc' };
}) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        
        debounceTimeout.current = setTimeout(() => {
            router.get(
                '/opportunities-news',
                { search: value, sort: filters.sort, direction: filters.direction },
                { preserveState: true, replace: true }
            );
        }, 300);
    };

    const handleSort = (column: string) => {
        let newDirection = 'asc';
        if (filters.sort === column && filters.direction === 'asc') {
            newDirection = 'desc';
        } else if (filters.sort === column && filters.direction === 'desc') {
            newDirection = 'asc';
        }

        router.get(
            '/opportunities-news',
            { search: searchQuery, sort: column, direction: newDirection },
            { preserveState: true, replace: true }
        );
    };

    const SortIcon = ({ column }: { column: string }) => {
        if (filters.sort !== column) return <ArrowUpDownIcon className="ml-2 h-4 w-4 inline text-muted-foreground" />;
        return filters.direction === 'asc' ? (
            <ArrowUpIcon className="ml-2 h-4 w-4 inline" />
        ) : (
            <ArrowDownIcon className="ml-2 h-4 w-4 inline" />
        );
    };

    const handlePageClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string | null) => {
        e.preventDefault();
        if (url) {
            router.get(url, { search: searchQuery, sort: filters.sort, direction: filters.direction }, { preserveScroll: true, preserveState: true });
        }
    };

    return (
        <>
            <Head title="Opportunities & News" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        title="Opportunities & News"
                        description="Manage opportunities and news content."
                    />
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <Input
                            placeholder="Search by title..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="max-w-sm"
                        />
                        <Button asChild className="shrink-0">
                            <Link href="/opportunities-news/create">Add New</Link>
                        </Button>
                    </div>
                </div>

                {items.data.length === 0 ? (
                    <Empty className="m-6 border rounded-md">
                        <EmptyHeader>
                            <EmptyTitle>No items</EmptyTitle>
                            <EmptyDescription>
                                {searchQuery ? 'No items match your search.' : 'Create the first item from Add New Button.'}
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <div className="border rounded-md overflow-hidden bg-background">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-1/2 cursor-pointer hover:bg-muted/50 select-none" onClick={() => handleSort('title')}>
                                        Title <SortIcon column="title" />
                                    </TableHead>
                                    <TableHead>Categories</TableHead>
                                    <TableHead className="cursor-pointer hover:bg-muted/50 select-none" onClick={() => handleSort('created_at')}>
                                        Created <SortIcon column="created_at" />
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.data.map((item) => (
                                    <TableRow key={item.id} className="group transition-colors">
                                        <TableCell className="max-w-md whitespace-normal py-3">
                                            <div className="font-medium text-foreground">
                                                {item.title}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground py-3">
                                            {item.categories || 'Not set'}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground py-3">
                                            {item.created_at}
                                        </TableCell>
                                        <TableCell className="py-3">
                                            <ButtonGroup className="ml-auto">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link
                                                        href={`/opportunities-news/${item.id}/edit`}
                                                    >
                                                        Edit
                                                    </Link>
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                        >
                                                            Delete
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                Delete item?
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot
                                                                be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>
                                                                Cancel
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() =>
                                                                    router.delete(
                                                                        `/opportunities-news/${item.id}`,
                                                                        {
                                                                            preserveScroll: true,
                                                                        },
                                                                    )
                                                                }
                                                            >
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </ButtonGroup>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
                
                {items.last_page > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
                        <div className="text-sm text-muted-foreground pl-2">
                            Showing <span className="font-medium text-foreground">{items.from || 0}</span> to <span className="font-medium text-foreground">{items.to || 0}</span> of <span className="font-medium text-foreground">{items.total}</span> entries
                        </div>
                        <Pagination className="justify-end w-auto mx-0">
                            <PaginationContent>
                                {items.prev_page_url ? (
                                    <PaginationItem>
                                        <PaginationPrevious href={items.prev_page_url} onClick={(e) => handlePageClick(e, items.prev_page_url)} />
                                    </PaginationItem>
                                ) : (
                                    <PaginationItem>
                                        <PaginationPrevious href="#" className="pointer-events-none opacity-50" aria-disabled />
                                    </PaginationItem>
                                )}
                                
                                {items.links.slice(1, -1).map((link, i) => (
                                    <PaginationItem key={i} className="hidden sm:inline-block">
                                        {link.url ? (
                                            <PaginationLink 
                                                href={link.url} 
                                                isActive={link.active}
                                                onClick={(e) => handlePageClick(e, link.url)}
                                            >
                                                {link.label.replace('&laquo;', '').replace('&raquo;', '')}
                                            </PaginationLink>
                                        ) : (
                                            <PaginationEllipsis />
                                        )}
                                    </PaginationItem>
                                ))}

                                {items.next_page_url ? (
                                    <PaginationItem>
                                        <PaginationNext href={items.next_page_url} onClick={(e) => handlePageClick(e, items.next_page_url)} />
                                    </PaginationItem>
                                ) : (
                                    <PaginationItem>
                                        <PaginationNext href="#" className="pointer-events-none opacity-50" aria-disabled />
                                    </PaginationItem>
                                )}
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>
        </>
    );
}

OpportunitiesNewsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Opportunities & News',
            href: '/opportunities-news',
        },
    ],
};
