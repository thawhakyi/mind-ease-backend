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

type Provider = {
    id: number;
    provider_name: string;
    provider_background?: string | null;
    number_of_professionals: number;
    professional_types: string;
    languages: string;
    service_locations: string;
    service_modes: string[];
    in_person: boolean;
    contact_methods: string;
    email: string;
    sort_order: number;
    created_at: string;
};

export default function CounsellingProvidersIndex({
    providers,
}: {
    providers: Provider[];
}) {
    return (
        <>
            <Head title="Counselling Providers" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <Heading
                        title="Counselling Providers"
                        description="Manage counselling provider profiles."
                    />
                    <Button asChild>
                        <Link href="/counselling-providers/create">
                            Add New
                        </Link>
                    </Button>
                </div>

                {providers.length === 0 ? (
                    <Empty className="m-6">
                        <EmptyHeader>
                            <EmptyTitle>No providers</EmptyTitle>
                            <EmptyDescription>
                                Create the first provider from Add New.
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Provider</TableHead>
                                <TableHead>Locations</TableHead>
                                <TableHead>Languages</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Mode</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {providers.map((provider) => (
                                <TableRow key={provider.id}>
                                    <TableCell className="max-w-md whitespace-normal">
                                        <div className="font-medium">
                                            {provider.provider_name}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {provider.service_locations}
                                    </TableCell>
                                    <TableCell>{provider.languages}</TableCell>
                                    <TableCell>
                                        <div>{provider.contact_methods}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1.5">
                                            {provider.service_modes.length > 0
                                                ? provider.service_modes.map(
                                                      (mode) => (
                                                          <Badge
                                                              key={mode}
                                                              variant={
                                                                  mode ===
                                                                  'In Person'
                                                                      ? 'default'
                                                                      : 'secondary'
                                                              }
                                                          >
                                                              {mode ===
                                                              'In Person'
                                                                  ? 'In person'
                                                                  : 'Remote'}
                                                          </Badge>
                                                      ),
                                                  )
                                                : (
                                                      <Badge variant="secondary">
                                                          Remote
                                                      </Badge>
                                                  )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <ButtonGroup className="ml-auto">
                                            <Button variant="outline" asChild>
                                                <Link
                                                    href={`/counselling-providers/${provider.id}/edit`}
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
                                                            Delete provider?
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
                                                                    `/counselling-providers/${provider.id}`,
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

CounsellingProvidersIndex.layout = {
    breadcrumbs: [
        {
            title: 'Counselling Providers',
            href: '/counselling-providers',
        },
    ],
};
