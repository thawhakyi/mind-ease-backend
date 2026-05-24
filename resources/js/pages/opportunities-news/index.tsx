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

type Item = {
    id: number;
    title: string;
    description?: string | null;
    categories?: string | null;
    created_at: string;
};

export default function OpportunitiesNewsIndex({ items }: { items: Item[] }) {
    return (
        <>
            <Head title="Opportunities & News" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <Heading
                        title="Opportunities & News"
                        description="Manage opportunities and news content."
                    />
                    <Button asChild>
                        <Link href="/opportunities-news/create">Add New</Link>
                    </Button>
                </div>

                {items.length === 0 ? (
                    <Empty className="m-6">
                        <EmptyHeader>
                            <EmptyTitle>No items</EmptyTitle>
                            <EmptyDescription>
                                Create the first item from Add New Button.
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Categories</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="max-w-md whitespace-normal">
                                        <div className="font-medium">
                                            {item.title}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {item.categories || 'Not set'}
                                    </TableCell>
                                    <TableCell>{item.created_at}</TableCell>
                                    <TableCell>
                                        <ButtonGroup className="ml-auto">
                                            <Button variant="outline" asChild>
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
