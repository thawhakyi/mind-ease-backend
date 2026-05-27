import { Head, router, useForm } from '@inertiajs/react';
import { ChevronsUpDownIcon } from 'lucide-react';
import { useState } from 'react';
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
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
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
    FieldTitle,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
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

type Location = {
    id: number;
    country_office_id: number;
    name: string;
    country_office?: string | null;
};

export default function Locations({
    countryOffices,
    locations,
}: {
    countryOffices: CountryOffice[];
    locations: Location[];
}) {
    const form = useForm({
        country_office_id: '',
        name: '',
    });

    return (
        <>
            <Head title="Location" />

            <div className="flex flex-col gap-6 p-6">
                <Heading
                    title="Location"
                    description="Manage locations for program updates."
                />

                <div className="grid gap-6 xl:grid-cols-[minmax(280px,380px)_minmax(0,1fr)]">
                    <Card>
                        <CardContent>
                            <form
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    form.post('/program-updates/locations', {
                                        preserveScroll: true,
                                        onSuccess: () => form.reset(),
                                    });
                                }}
                                className="flex flex-col gap-4"
                            >
                                <FieldGroup>
                                    <Field
                                        data-invalid={
                                            !!form.errors.country_office_id
                                        }
                                    >
                                        <FieldTitle>Country Office</FieldTitle>
                                        <CountryOfficeCombobox
                                            countryOffices={countryOffices}
                                            value={form.data.country_office_id}
                                            ariaInvalid={
                                                !!form.errors.country_office_id
                                            }
                                            onChange={(value) =>
                                                form.setData(
                                                    'country_office_id',
                                                    value,
                                                )
                                            }
                                        />
                                        <FieldError
                                            errors={
                                                form.errors.country_office_id
                                                    ? [
                                                          {
                                                              message:
                                                                  form.errors
                                                                      .country_office_id,
                                                          },
                                                      ]
                                                    : undefined
                                            }
                                        />
                                    </Field>
                                    <Field data-invalid={!!form.errors.name}>
                                        <FieldLabel htmlFor="name">
                                            Name
                                        </FieldLabel>
                                        <Input
                                            id="name"
                                            autoComplete="off"
                                            value={form.data.name}
                                            onChange={(event) =>
                                                form.setData(
                                                    'name',
                                                    event.target.value,
                                                )
                                            }
                                            required
                                            aria-invalid={!!form.errors.name}
                                            placeholder="Location name"
                                        />
                                        <FieldError
                                            errors={
                                                form.errors.name
                                                    ? [
                                                          {
                                                              message:
                                                                  form.errors
                                                                      .name,
                                                          },
                                                      ]
                                                    : undefined
                                            }
                                        />
                                    </Field>
                                </FieldGroup>
                                <Button disabled={form.processing}>
                                    Add Location
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="gap-0 overflow-hidden py-0">
                        <CardHeader className="border-b py-6">
                            <CardTitle>Locations</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {locations.length === 0 ? (
                                <Empty className="m-6">
                                    <EmptyHeader>
                                        <EmptyTitle>No locations</EmptyTitle>
                                        <EmptyDescription>
                                            Add a location after creating a
                                            country office.
                                        </EmptyDescription>
                                    </EmptyHeader>
                                </Empty>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>
                                                Country Office
                                            </TableHead>
                                            <TableHead>Location</TableHead>
                                            <TableHead className="text-right">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {locations.map((location) => (
                                            <LocationRow
                                                key={location.id}
                                                countryOffices={countryOffices}
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

Locations.layout = {
    breadcrumbs: [
        {
            title: 'Program Updates',
            href: '/program-updates',
        },
        {
            title: 'Location',
            href: '/program-updates/locations',
        },
    ],
};

function LocationRow({
    countryOffices,
    location,
}: {
    countryOffices: CountryOffice[];
    location: Location;
}) {
    const form = useForm({
        country_office_id: location.country_office_id.toString(),
        name: location.name,
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        form.patch(`/program-updates/locations/${location.id}`, {
            preserveScroll: true,
        });
    }

    return (
        <TableRow>
            <TableCell>
                <form id={`location-form-${location.id}`} onSubmit={submit}>
                    <CountryOfficeCombobox
                        countryOffices={countryOffices}
                        value={form.data.country_office_id}
                        ariaInvalid={!!form.errors.country_office_id}
                        onChange={(value) =>
                            form.setData('country_office_id', value)
                        }
                    />
                    <FieldError
                        className="mt-2"
                        errors={
                            form.errors.country_office_id
                                ? [
                                      {
                                          message:
                                              form.errors.country_office_id,
                                      },
                                  ]
                                : undefined
                        }
                    />
                </form>
            </TableCell>
            <TableCell>
                <Input
                    form={`location-form-${location.id}`}
                    id={`location-${location.id}`}
                    value={form.data.name}
                    onChange={(event) =>
                        form.setData('name', event.target.value)
                    }
                    required
                    aria-label="Location"
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
            </TableCell>
            <TableCell>
                <ButtonGroup className="ml-auto">
                    <Button
                        form={`location-form-${location.id}`}
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
                                    Delete location?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() =>
                                        router.delete(
                                            `/program-updates/locations/${location.id}`,
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

function CountryOfficeCombobox({
    ariaInvalid,
    countryOffices,
    onChange,
    value,
}: {
    ariaInvalid?: boolean;
    countryOffices: CountryOffice[];
    onChange: (value: string) => void;
    value: string;
}) {
    const [open, setOpen] = useState(false);
    const selectedCountryOffice = countryOffices.find(
        (countryOffice) => countryOffice.id.toString() === value,
    );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    aria-invalid={ariaInvalid}
                    aria-label="Country office"
                    className="w-full justify-between"
                >
                    <span className="truncate">
                        {selectedCountryOffice?.name ?? 'Select country office'}
                    </span>
                    <ChevronsUpDownIcon data-icon="inline-end" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-(--radix-popover-trigger-width) min-w-56 p-0">
                <Command>
                    <CommandInput placeholder="Search country office..." />
                    <CommandList>
                        <CommandEmpty>No country office found.</CommandEmpty>
                        <CommandGroup>
                            {countryOffices.map((countryOffice) => {
                                const countryOfficeId =
                                    countryOffice.id.toString();
                                const isSelected = countryOfficeId === value;

                                return (
                                    <CommandItem
                                        key={countryOffice.id}
                                        value={countryOffice.name}
                                        data-checked={isSelected}
                                        onSelect={() => {
                                            onChange(
                                                isSelected
                                                    ? ''
                                                    : countryOfficeId,
                                            );
                                            setOpen(false);
                                        }}
                                    >
                                        {countryOffice.name}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
