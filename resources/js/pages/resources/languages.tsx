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

type Language = {
    id: number;
    name: string;
};

export default function ResourceLanguages({
    languages,
}: {
    languages: Language[];
}) {
    const form = useForm({ name: '' });

    return (
        <>
            <Head title="Resource Languages" />

            <div className="flex flex-col gap-6 p-6">
                <Heading
                    title="Language"
                    description="Manage languages for resources."
                />

                <div className="grid gap-6 xl:grid-cols-[minmax(280px,360px)_minmax(0,1fr)]">
                    <div>
                        <Card>
                            <CardContent>
                                <form
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        form.post('/resources/languages', {
                                            preserveScroll: true,
                                            onSuccess: () => form.reset(),
                                        });
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
                                                placeholder="Language name"
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
                                        Add Language
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="gap-0 overflow-hidden py-0">
                        <CardHeader className="border-b py-6">
                            <CardTitle>Languages</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {languages.length === 0 ? (
                                <Empty className="m-6">
                                    <EmptyHeader>
                                        <EmptyTitle>No languages</EmptyTitle>
                                        <EmptyDescription>
                                            Add a language to start assigning
                                            resources.
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
                                        {languages.map((language) => (
                                            <LanguageRow
                                                key={language.id}
                                                language={language}
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

ResourceLanguages.layout = {
    breadcrumbs: [
        {
            title: 'Resources',
            href: '/resources',
        },
        {
            title: 'Language',
            href: '/resources/languages',
        },
    ],
};

function LanguageRow({ language }: { language: Language }) {
    const form = useForm({ name: language.name });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        form.patch(`/resources/languages/${language.id}`, {
            preserveScroll: true,
        });
    }

    return (
        <TableRow>
            <TableCell>
                <form id={`language-form-${language.id}`} onSubmit={submit}>
                    <Input
                        id={`language-${language.id}`}
                        value={form.data.name}
                        onChange={(event) =>
                            form.setData('name', event.target.value)
                        }
                        required
                        aria-label="Language"
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
                        form={`language-form-${language.id}`}
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
                                    Delete language?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Languages assigned to resources cannot be
                                    deleted.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() =>
                                        router.delete(
                                            `/resources/languages/${language.id}`,
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
