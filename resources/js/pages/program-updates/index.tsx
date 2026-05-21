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

type ProgramUpdateListItem = {
    id: number;
    title: string;
    description?: string | null;
    quarter?: string | null;
    year?: number | null;
    date?: string | null;
    country_offices?: string | null;
    event_type?: string | null;
    created_at: string;
};

export default function ProgramUpdatesIndex({
    programUpdates,
}: {
    programUpdates: ProgramUpdateListItem[];
}) {
    return (
        <>
            <Head title="Program Updates" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <Heading
                        title="Program Updates"
                        description="Manage program updates by country office and location."
                    />
                    <Button asChild>
                        <Link href="/program-updates/create">Add New</Link>
                    </Button>
                </div>

                <Card className="gap-0 overflow-hidden py-0">
                    <CardContent className="p-0">
                        {programUpdates.length === 0 ? (
                            <Empty className="m-6">
                                <EmptyHeader>
                                    <EmptyTitle>No program updates</EmptyTitle>
                                    <EmptyDescription>
                                        Create the first update from Add New.
                                    </EmptyDescription>
                                </EmptyHeader>
                            </Empty>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Quarter</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Country Offices</TableHead>
                                        <TableHead>Event Type</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {programUpdates.map((programUpdate) => (
                                        <TableRow key={programUpdate.id}>
                                            <TableCell className="max-w-md whitespace-normal">
                                                <div className="font-medium">
                                                    {programUpdate.title}
                                                </div>
                                                {programUpdate.description && (
                                                    <p className="mt-1 line-clamp-2 text-muted-foreground">
                                                        {
                                                            programUpdate.description
                                                        }
                                                    </p>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {[
                                                    programUpdate.quarter,
                                                    programUpdate.year,
                                                ]
                                                    .filter(Boolean)
                                                    .join(', ') || 'Not set'}
                                            </TableCell>
                                            <TableCell>
                                                {programUpdate.date ??
                                                    'Not set'}
                                            </TableCell>
                                            <TableCell>
                                                {programUpdate.country_offices ??
                                                    'Not set'}
                                            </TableCell>
                                            <TableCell>
                                                {programUpdate.event_type ??
                                                    'Not set'}
                                            </TableCell>
                                            <TableCell>
                                                <ButtonGroup className="ml-auto">
                                                    <Button
                                                        variant="outline"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/program-updates/${programUpdate.id}/edit`}
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
                                                                    program
                                                                    update?
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
                                                                            `/program-updates/${programUpdate.id}`,
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

ProgramUpdatesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Program Updates',
            href: '/program-updates',
        },
    ],
};
