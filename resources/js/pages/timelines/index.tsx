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

type Timeline = {
    id: number;
    title: string;
    year: string;
    description?: string | null;
    created_at: string;
};

export default function TimelinesIndex({
    timelines,
}: {
    timelines: Timeline[];
}) {
    return (
        <>
            <Head title="Timeline" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <Heading
                        title="Timeline"
                        description="Manage timeline items."
                    />
                    <Button asChild>
                        <Link href="/timelines/create">Add New</Link>
                    </Button>
                </div>

                {timelines.length === 0 ? (
                    <Empty className="m-6">
                        <EmptyHeader>
                            <EmptyTitle>No timeline items</EmptyTitle>
                            <EmptyDescription>
                                Create the first item from Add New.
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Year</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {timelines.map((timeline) => (
                                <TableRow key={timeline.id}>
                                    <TableCell className="max-w-md whitespace-normal">
                                        <div className="font-medium">
                                            {timeline.title}
                                        </div>
                                    </TableCell>
                                    <TableCell>{timeline.year}</TableCell>
                                    <TableCell>{timeline.created_at}</TableCell>
                                    <TableCell>
                                        <ButtonGroup className="ml-auto">
                                            <Button variant="outline" asChild>
                                                <Link
                                                    href={`/timelines/${timeline.id}/edit`}
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
                                                            Delete timeline
                                                            item?
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
                                                                    `/timelines/${timeline.id}`,
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

TimelinesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Timeline',
            href: '/timelines',
        },
    ],
};
