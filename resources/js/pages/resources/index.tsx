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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Card, CardContent } from '@/components/ui/card';
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

type Resource = {
    id: number;
    title: string;
    description?: string | null;
    year: number;
    category: string;
    language?: string | null;
    url: string;
    internal_members_only: boolean;
    is_published: boolean;
    sort_order: number;
    created_at: string;
};

export default function ResourcesIndex({
    resources,
}: {
    resources: Resource[];
}) {
    return (
        <>
            <Head title="Resources" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <Heading
                        title="Resources"
                        description="Manage resource links and documents."
                    />
                    <Button asChild>
                        <Link href="/resources/create">Add New</Link>
                    </Button>
                </div>

                <Card className="gap-0 overflow-hidden py-0">
                    <CardContent className="p-0">
                        {resources.length === 0 ? (
                            <Empty className="m-6">
                                <EmptyHeader>
                                    <EmptyTitle>No resources</EmptyTitle>
                                    <EmptyDescription>
                                        Create the first resource from Add New.
                                    </EmptyDescription>
                                </EmptyHeader>
                            </Empty>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Year</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Language</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Access</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {resources.map((resource) => (
                                        <TableRow key={resource.id}>
                                            <TableCell className="max-w-md whitespace-normal">
                                                <div className="font-medium">
                                                    {resource.title}
                                                </div>
                                                <a
                                                    href={resource.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="mt-1 block truncate text-muted-foreground underline-offset-4 hover:underline"
                                                >
                                                    {resource.url}
                                                </a>
                                            </TableCell>
                                            <TableCell>
                                                {resource.year}
                                            </TableCell>
                                            <TableCell>
                                                {resource.category}
                                            </TableCell>
                                            <TableCell>
                                                {resource.language ?? 'Not set'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        resource.is_published
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {resource.is_published
                                                        ? 'Published'
                                                        : 'Draft'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {resource.internal_members_only
                                                    ? 'Members only'
                                                    : 'Public'}
                                            </TableCell>
                                            <TableCell>
                                                <ButtonGroup className="ml-auto">
                                                    <Button
                                                        variant="outline"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/resources/${resource.id}/edit`}
                                                        >
                                                            Edit
                                                        </Link>
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger
                                                            asChild
                                                        >
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
                                                                    Delete
                                                                    resource?
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This action
                                                                    cannot be
                                                                    undone.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>
                                                                    Cancel
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() =>
                                                                        router.delete(
                                                                            `/resources/${resource.id}`,
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
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

ResourcesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Resources',
            href: '/resources',
        },
    ],
};
