import { Head, router, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyTitle,
} from '@/components/ui/empty';
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type ServiceLocation = {
    id: number;
    name: string;
};

export default function ServiceLocations({
    serviceLocations,
}: {
    serviceLocations: ServiceLocation[];
}) {
    const form = useForm({ name: '' });

    return (
        <>
            <Head title="Service Locations" />

            <div className="flex flex-col gap-6 p-6">
                <Heading
                    title="Service Location"
                    description="Manage counselling provider service locations."
                />

                <div className="grid gap-6 xl:grid-cols-[minmax(280px,360px)_minmax(0,1fr)]">
                    <div>
                        <Card>
                            <CardContent>
                                <form
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        form.post(
                                            '/counselling-providers/service-locations',
                                            {
                                                preserveScroll: true,
                                                onSuccess: () => form.reset(),
                                            },
                                        );
                                    }}
                                    className="flex flex-col gap-4"
                                >
                                    <FieldGroup>
                                        <Field
                                            data-invalid={!!form.errors.name}
                                        >
                                            <FieldLabel htmlFor="name">
                                                Name
                                            </FieldLabel>
                                            <Input
                                                id="name"
                                                value={form.data.name}
                                                onChange={(event) =>
                                                    form.setData(
                                                        'name',
                                                        event.target.value,
                                                    )
                                                }
                                                required
                                                aria-invalid={
                                                    !!form.errors.name
                                                }
                                                placeholder="Service location"
                                            />
                                            <FieldError
                                                errors={
                                                    form.errors.name
                                                        ? [
                                                              {
                                                                  message:
                                                                      form
                                                                          .errors
                                                                          .name,
                                                              },
                                                          ]
                                                        : undefined
                                                }
                                            />
                                        </Field>
                                    </FieldGroup>
                                    <Button disabled={form.processing}>
                                        Add Service Location
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="gap-0 overflow-hidden py-0">
                        <CardHeader className="border-b py-6">
                            <CardTitle>Service locations</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {serviceLocations.length === 0 ? (
                                <Empty className="m-6">
                                    <EmptyHeader>
                                        <EmptyTitle>
                                            No service locations
                                        </EmptyTitle>
                                        <EmptyDescription>
                                            Add a location to start assigning
                                            providers.
                                        </EmptyDescription>
                                    </EmptyHeader>
                                </Empty>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead className="text-right">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {serviceLocations.map((location) => (
                                            <ServiceLocationRow
                                                key={location.id}
                                                location={location}
                                            />
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

ServiceLocations.layout = {
    breadcrumbs: [
        {
            title: 'Counselling Providers',
            href: '/counselling-providers',
        },
        {
            title: 'Service Location',
            href: '/counselling-providers/service-locations',
        },
    ],
};

function ServiceLocationRow({ location }: { location: ServiceLocation }) {
    const form = useForm({ name: location.name });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        form.patch(`/counselling-providers/service-locations/${location.id}`, {
            preserveScroll: true,
        });
    }

    return (
        <TableRow>
            <TableCell>
                <form
                    id={`service-location-form-${location.id}`}
                    onSubmit={submit}
                >
                    <Input
                        id={`service-location-${location.id}`}
                        value={form.data.name}
                        onChange={(event) =>
                            form.setData('name', event.target.value)
                        }
                        required
                        aria-label="Service location"
                        aria-invalid={!!form.errors.name}
                    />
                    <FieldError
                        className="mt-2"
                        errors={
                            form.errors.name
                                ? [{ message: form.errors.name }]
                                : undefined
                        }
                    />
                </form>
            </TableCell>
            <TableCell>
                <ButtonGroup className="ml-auto">
                    <Button
                        form={`service-location-form-${location.id}`}
                        type="submit"
                        variant="outline"
                        disabled={form.processing}
                    >
                        Save
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button type="button" variant="destructive">
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Delete service location?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Locations assigned to providers cannot be
                                    deleted.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() =>
                                        router.delete(
                                            `/counselling-providers/service-locations/${location.id}`,
                                            { preserveScroll: true },
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
    );
}
