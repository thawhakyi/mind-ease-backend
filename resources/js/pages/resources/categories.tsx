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

type Category = {
    id: number;
    name: string;
};

export default function ResourceCategories({
    categories,
}: {
    categories: Category[];
}) {
    const form = useForm({ name: '' });

    return (
        <>
            <Head title="Resource Categories" />

            <div className="flex flex-col gap-6 p-6">
                <Heading
                    title="Category"
                    description="Manage categories for resources."
                />

                <div className="grid gap-6 xl:grid-cols-[minmax(280px,360px)_minmax(0,1fr)]">
                    <div>
                        <Card>
                            <CardContent>
                                <form
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        form.post('/resources/categories', {
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
                                                placeholder="Category name"
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
                                        Add Category
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="gap-0 overflow-hidden py-0">
                        <CardHeader className="border-b py-6">
                            <CardTitle>Categories</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {categories.length === 0 ? (
                                <Empty className="m-6">
                                    <EmptyHeader>
                                        <EmptyTitle>No categories</EmptyTitle>
                                        <EmptyDescription>
                                            Add a category to start assigning
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
                                        {categories.map((category) => (
                                            <CategoryRow
                                                key={category.id}
                                                category={category}
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

ResourceCategories.layout = {
    breadcrumbs: [
        {
            title: 'Resources',
            href: '/resources',
        },
        {
            title: 'Category',
            href: '/resources/categories',
        },
    ],
};

function CategoryRow({ category }: { category: Category }) {
    const form = useForm({ name: category.name });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        form.patch(`/resources/categories/${category.id}`, {
            preserveScroll: true,
        });
    }

    return (
        <TableRow>
            <TableCell>
                <form id={`category-form-${category.id}`} onSubmit={submit}>
                    <Input
                        id={`category-${category.id}`}
                        value={form.data.name}
                        onChange={(event) =>
                            form.setData('name', event.target.value)
                        }
                        required
                        aria-label="Category"
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
                        form={`category-form-${category.id}`}
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
                                    Delete category?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Deleting this category removes it from
                                    assigned resources.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() =>
                                        router.delete(
                                            `/resources/categories/${category.id}`,
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
