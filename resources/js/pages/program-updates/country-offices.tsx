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

type CountryOffice = {
    id: number;
    name: string;
};

export default function CountryOffices({
    countryOffices,
}: {
    countryOffices: CountryOffice[];
}) {
    const form = useForm({ name: '' });

    return (
        <>
            <Head title="Country Office" />

            <div className="flex flex-col gap-6 p-6">
                <Heading
                    title="Country Office"
                    description="Manage country offices for program updates."
                />

                <div className="grid gap-6 xl:grid-cols-[minmax(280px,360px)_minmax(0,1fr)]">
                    <div>
                        <Card>
                            <CardContent>
                                <form
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        form.post(
                                            '/program-updates/country-offices',
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
                                                placeholder="Country office name"
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
                                        Add Country Office
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="gap-0 overflow-hidden py-0">
                        <CardHeader className="border-b py-6">
                            <CardTitle>Country offices</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {countryOffices.length === 0 ? (
                                <Empty className="m-6">
                                    <EmptyHeader>
                                        <EmptyTitle>
                                            No country offices
                                        </EmptyTitle>
                                        <EmptyDescription>
                                            Add a country office to start
                                            assigning locations.
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
                                        {countryOffices.map((countryOffice) => (
                                            <CountryOfficeRow
                                                key={countryOffice.id}
                                                countryOffice={countryOffice}
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

CountryOffices.layout = {
    breadcrumbs: [
        {
            title: 'Program Updates',
            href: '/program-updates',
        },
        {
            title: 'Country Office',
            href: '/program-updates/country-offices',
        },
    ],
};

function CountryOfficeRow({ countryOffice }: { countryOffice: CountryOffice }) {
    const form = useForm({ name: countryOffice.name });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        form.patch(`/program-updates/country-offices/${countryOffice.id}`, {
            preserveScroll: true,
        });
    }

    return (
        <TableRow>
            <TableCell>
                <form
                    id={`country-office-form-${countryOffice.id}`}
                    onSubmit={submit}
                >
                    <Input
                        id={`country-office-${countryOffice.id}`}
                        value={form.data.name}
                        onChange={(event) =>
                            form.setData('name', event.target.value)
                        }
                        required
                        aria-label="Country Office"
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
                        form={`country-office-form-${countryOffice.id}`}
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
                                    Delete country office?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Deleting this country office also removes
                                    its locations.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() =>
                                        router.delete(
                                            `/program-updates/country-offices/${countryOffice.id}`,
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
